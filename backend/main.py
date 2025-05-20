from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import io
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
gcmm_data = {
    "axes": [],
    "domains": [],
    "objectives": [],
    "globalScore": 0
}

# Color mapping for axes
axis_colors = [
    "#3366CC",  # Axis 1 - Legal (Blue)
    "#DC3912",  # Axis 2 - Technologies (Red)
    "#FF9900",  # Axis 3 - Organization (Orange)
    "#109618",  # Axis 4 - Capacity (Green)
    "#990099"   # Axis 5 - Cooperation (Purple)
]

def validate_excel_structure(df):
    """Validate the structure of the uploaded Excel file."""
    # Expected columns
    required_columns = [
        'Axe',           # Column 0
        'Nom Axe',       # Column 1
        'Domaine',       # Column 2
        'Nom Domaine',   # Column 3
        'Objectif',      # Column 4
        'Nom Objectif',  # Column 5
        'Description',   # Column 6
        'Niveau 1 (Ad hoc)',      # Column 7
        'Niveau 2 (Initiated)',      # Column 8
        'Niveau 3 (Defined)',      # Column 9
        'Niveau 4 (Managed)',      # Column 10
        'Niveau 5 (Optimized)',      # Column 11
        'Evaluation',    # Column 12
        'Commentaire'    # Column 13
    ]
    
    # Check if we have enough columns
    if len(df.columns) < len(required_columns):
        raise HTTPException(
            status_code=400,
            detail=f"Excel file should have {len(required_columns)} columns, but found {len(df.columns)}"
        )
    
    # Check column names (case-insensitive)
    df_columns = [str(col).strip().lower() for col in df.columns]
    required_columns_lower = [col.lower() for col in required_columns]
    
    # Find missing columns
    missing_columns = []
    for i, required_col in enumerate(required_columns_lower):
        found = False
        for df_col in df_columns:
            if required_col in df_col:
                found = True
                break
        if not found:
            missing_columns.append(required_columns[i])
    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(missing_columns)}"
        )
    
    return True

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Validate file extension
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file format: {file.filename}. Please upload an Excel file (.xlsx or .xls)"
            )

        # Read Excel file content
        try:
            contents = await file.read()
        except Exception as e:
            print(f"Error reading file: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Error reading file: {str(e)}. Please make sure it's a valid Excel file."
            )
        
        # Parse Excel file
        try:
            df = pd.read_excel(
                io.BytesIO(contents),
                engine='openpyxl'  # Explicitly use openpyxl for .xlsx files
            )
        except Exception as e:
            print(f"Error parsing Excel: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Error parsing Excel file: {str(e)}. Please check the file format."
            )
        
        # Validate DataFrame
        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="The Excel file is empty"
            )

        # Validate the structure of the Excel file
        validate_excel_structure(df)

        # Skip header row
        rows = df.iloc[0:].values.tolist()
        
        if not rows:
            raise HTTPException(
                status_code=400,
                detail="No data found in the Excel file after header row"
            )
        
        # Initialize empty lists
        axes = []
        domains = []
        objectives = []

        # Process data rows
        try:
            for row in rows:
                if not row[0]:  # Skip empty rows
                    continue
                    
                axis_id = int(row[0]) if not pd.isna(row[0]) else None
                axis_name = row[1]
                domain_id = str(row[2]) if not pd.isna(row[2]) else None
                domain_name = row[3]
                objective_id = str(row[4]) if not pd.isna(row[4]) else None
                objective_name = row[5]
                description = row[6]
                level1 = row[7]
                level2 = row[8]
                level3 = row[9]
                level4 = row[10]
                level5 = row[11]
                evaluation = float(row[12]) if not pd.isna(row[12]) else 0
                comment = row[13]
                
                # Add axis if it doesn't exist
                if axis_id and not any(a["id"] == axis_id for a in axes):
                    axes.append({
                        "id": axis_id,
                        "name": axis_name,
                        "score": 0,
                        "color": axis_colors[(axis_id - 1) % len(axis_colors)]
                    })
                
                # Add domain if it doesn't exist
                if domain_id and domain_name:
                    domain_key = f"{axis_id}-{domain_id}"
                    if not any(d["key"] == domain_key for d in domains):
                        domains.append({
                            "key": domain_key,
                            "id": domain_id,
                            "name": domain_name,
                            "axisId": axis_id,
                            "score": 0
                        })
                
                # Add objective
                if objective_id and objective_name:
                    objectives.append({
                        "id": objective_id,
                        "name": objective_name,
                        "description": description or "",
                        "domainId": domain_id,
                        "axisId": axis_id,
                        "levels": [level1, level2, level3, level4, level5],
                        "evaluation": evaluation,
                        "comment": comment or ""
                    })
        except Exception as e:
            print(f"Error processing data: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Error processing data: {str(e)}. Please check your Excel file format."
            )

        # Calculate scores and update data
        try:
            # Calculate domain scores
            for domain in domains:
                domain_objectives = [o for o in objectives 
                                if o["axisId"] == domain["axisId"] 
                                and o["domainId"] == domain["id"]]
                
                if domain_objectives:
                    domain["score"] = sum(o["evaluation"] for o in domain_objectives) / len(domain_objectives)
            
            # Calculate axis scores
            for axis in axes:
                axis_objectives = [o for o in objectives if o["axisId"] == axis["id"]]
                
                if axis_objectives:
                    axis["score"] = sum(o["evaluation"] for o in axis_objectives) / len(axis_objectives)
            
            # Calculate global score
            global_score = sum(axis["score"] for axis in axes) / len(axes) if axes else 0
            
            # Prepare radar data
            radar_data = [
                {
                    "axis": f"Axe {axis['id']}: {axis['name']}",
                    "score": axis["score"],
                    "fullMark": 5,
                    "color": axis["color"]
                }
                for axis in axes
            ]
            
            # Save processed data
            gcmm_data["axes"] = axes
            gcmm_data["domains"] = domains
            gcmm_data["objectives"] = objectives
            gcmm_data["globalScore"] = round(global_score, 1)
            gcmm_data["radarData"] = radar_data
        except Exception as e:
            print(f"Error calculating scores: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error calculating scores: {str(e)}"
            )
        
        return {
            "message": "File processed successfully",
            "filename": file.filename,
            "processedRows": len(rows),
            "axes": len(axes),
            "domains": len(domains),
            "objectives": len(objectives)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

def handle_nan_values(obj):
    if isinstance(obj, dict):
        return {key: handle_nan_values(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [handle_nan_values(item) for item in obj]
    elif isinstance(obj, (float, np.float64)) and (np.isnan(obj) or np.isinf(obj)):
        return None
    elif pd.isna(obj):
        return None
    return obj

@app.get("/api/data")
async def get_data():
    cleaned_data = handle_nan_values(gcmm_data)
    return JSONResponse(content=cleaned_data)

@app.get("/api/axes")
async def get_axes():
    cleaned_axes = handle_nan_values(gcmm_data["axes"])
    return JSONResponse(content=cleaned_axes)

@app.get("/api/domains/{axis_id}")
async def get_domains(axis_id: int):
    domains = [d for d in gcmm_data["domains"] if d["axisId"] == axis_id]
    cleaned_domains = handle_nan_values(domains)
    return JSONResponse(content=cleaned_domains)

@app.get("/api/objectives/{domain_id}")
async def get_objectives(domain_id: str):
    objectives = [o for o in gcmm_data["objectives"] if o["domainId"] == domain_id]
    cleaned_objectives = handle_nan_values(objectives)
    return JSONResponse(content=cleaned_objectives)

class ObjectiveEvaluation(BaseModel):
    objectiveId: str
    evaluation: float
    comment: str

@app.post("/api/objectives/{objective_id}/evaluate")
async def evaluate_objective(objective_id: str, evaluation: ObjectiveEvaluation):
    try:
        # Find the objective
        objective = next((obj for obj in gcmm_data["objectives"] if obj["id"] == objective_id), None)
        if not objective:
            raise HTTPException(status_code=404, detail="Objective not found")

        # Update the objective
        objective["evaluation"] = evaluation.evaluation
        objective["comment"] = evaluation.comment

        # Recalculate scores
        # Update domain scores
        for domain in gcmm_data["domains"]:
            domain_objectives = [o for o in gcmm_data["objectives"] 
                            if o["axisId"] == domain["axisId"] 
                            and o["domainId"] == domain["id"]]
            
            if domain_objectives:
                domain["score"] = sum(o["evaluation"] for o in domain_objectives) / len(domain_objectives)
        
        # Update axis scores
        for axis in gcmm_data["axes"]:
            axis_objectives = [o for o in gcmm_data["objectives"] if o["axisId"] == axis["id"]]
            
            if axis_objectives:
                axis["score"] = sum(o["evaluation"] for o in axis_objectives) / len(axis_objectives)
        
        # Update global score
        global_score = sum(axis["score"] for axis in gcmm_data["axes"]) / len(gcmm_data["axes"]) if gcmm_data["axes"] else 0
        gcmm_data["globalScore"] = round(global_score, 1)

        # Update radar data
        gcmm_data["radarData"] = [
            {
                "axis": f"Axe {axis['id']}: {axis['name']}",
                "score": axis["score"],
                "fullMark": 5,
                "color": axis["color"]
            }
            for axis in gcmm_data["axes"]
        ]

        return JSONResponse(content={
            "message": "Evaluation saved successfully",
            "objective": objective
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error saving evaluation: {str(e)}"
        )

@app.get("/api/export")
async def export_excel():
    """Export the current GCMM data to an Excel file."""
    try:        
        # Create a list of all records
        records = []
        for axis in gcmm_data["axes"]:
            axis_domains = [d for d in gcmm_data["domains"] if d["axisId"] == axis["id"]]
            
            for domain in axis_domains:
                # Get objectives for this specific domain
                domain_objectives = [o for o in gcmm_data["objectives"] 
                                  if o["domainId"] == domain["id"] and o["axisId"] == axis["id"]]
                for objective in domain_objectives:
                    records.append({
                        "Axe": axis["id"],
                        "Nom Axe": axis["name"],
                        "Domaine": domain["id"],
                        "Nom Domaine": domain["name"],
                        "Objectif": objective["id"],
                        "Nom Objectif": objective["name"],
                        "Description": objective["description"],
                        "Niveau 1 (Ad hoc)": objective["levels"][0],
                        "Niveau 2 (Initiated)": objective["levels"][1],
                        "Niveau 3 (Defined)": objective["levels"][2],
                        "Niveau 4 (Managed)": objective["levels"][3],
                        "Niveau 5 (Optimized)": objective["levels"][4],
                        "Evaluation": objective["evaluation"],
                        "Commentaire": objective["comment"]
                    })
        
        # Create DataFrame and write to Excel
        df = pd.DataFrame(records)
        
        # Create an in-memory Excel file
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='GCMM')
        
        # Get the value of the BytesIO buffer
        excel_data = output.getvalue()
        
        headers = {
            'Content-Disposition': 'attachment; filename="GCMM_Export.xlsx"',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
        
        return Response(content=excel_data, headers=headers)
    
    except Exception as e:
        print(f"Error during export: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))