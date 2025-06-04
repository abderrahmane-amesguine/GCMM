import React, { useState, useEffect } from 'react';
import { Shield, Save, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { toast } from '../components/ui/Toast';
import { saveNCSecMMData, fetchNCSecMMData } from '../services/api';

function NCSecMMBuilder({ onNavigate }) {
    const [axes, setAxes] = useState([]);
    const [currentAxis, setCurrentAxis] = useState(null);
    const [currentDomain, setCurrentDomain] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Clear child selections when parent is changed
    useEffect(() => {
        if (!currentAxis) {
            setCurrentDomain(null);
        } else if (currentDomain && !currentAxis.domains.find(d => d.id === currentDomain.id)) {
            setCurrentDomain(null);
        }
    }, [currentAxis, currentDomain]);

    // Form states
    const [axisForm, setAxisForm] = useState({ name: '', color: '#3B82F6', description: '' });
    const [domainForm, setDomainForm] = useState({ name: '', description: '' });
    const [objectiveForm, setObjectiveForm] = useState({
        name: '',
        description: '',
        levels: {
            1: { description: '' },
            2: { description: '' },
            3: { description: '' },
            4: { description: '' },
            5: { description: '' }
        },
        profile: 1,
        targetProfile: 1,
        comment: ''
    });

    // Handle axis creation/editing
    const handleAxisSubmit = (e) => {
        e.preventDefault();
        if (isEditing && currentAxis) {
            setAxes(axes.map(axis =>
                axis.id === currentAxis.id
                    ? { ...axis, ...axisForm }
                    : axis
            ));
            toast({ title: "Success", description: "Axis updated successfully", type: "success" });
        } else {
            // Find the highest axis number and increment by 1
            const nextAxisNum = axes.length > 0 
                ? Math.max(...axes.map(a => parseInt(a.id))) + 1 
                : 1;
            
            const newAxis = {
                id: nextAxisNum.toString(),
                ...axisForm,
                domains: []
            };
            setAxes([...axes, newAxis]);
            toast({ title: "Success", description: "New axis created", type: "success" });
        }
        setAxisForm({ name: '', color: '#3B82F6', description: '' });
        setIsEditing(false);
    };

    // Handle domain creation/editing
    const handleDomainSubmit = (e) => {
        e.preventDefault();
        if (!currentAxis) return;

        if (isEditing && currentDomain) {
            setAxes(axes.map(axis => {
                if (axis.id === currentAxis.id) {
                    return {
                        ...axis,
                        domains: axis.domains.map(domain =>
                            domain.id === currentDomain.id
                                ? { ...domain, ...domainForm }
                                : domain
                        )
                    };
                }
                return axis;
            }));
            toast({ title: "Success", description: "Domain updated successfully", type: "success" });
        } else {
            // Find the highest domain number for this axis and increment by 1
            const domainNum = currentAxis.domains.length > 0
                ? Math.max(...currentAxis.domains.map(d => parseInt(d.id.split('.')[1]))) + 1
                : 1;
            
            const newDomain = {
                id: `${currentAxis.id}.${domainNum}`,
                ...domainForm,
                objectives: []
            };
            
            const updatedAxes = axes.map(axis =>
                axis.id === currentAxis.id
                    ? { ...axis, domains: [...axis.domains, newDomain] }
                    : axis
            );
            setAxes(updatedAxes);
            // Update currentAxis to reflect the new domain
            const updatedCurrentAxis = updatedAxes.find(axis => axis.id === currentAxis.id);
            setCurrentAxis(updatedCurrentAxis);
            toast({ title: "Success", description: "New domain created", type: "success" });
        }
        setDomainForm({ name: '', description: '' });
        setIsEditing(false);
    };

    // Handle objective creation/editing
    const handleObjectiveSubmit = (e) => {
        e.preventDefault();
        if (!currentAxis || !currentDomain) return;

        // Find the highest objective number across all domains in this axis
        const allObjectivesInAxis = currentAxis.domains.flatMap(domain => 
            domain.objectives?.map(obj => {
                const match = obj.id.match(/\d+\.(\d+)\.(\d+)/);
                return match ? parseInt(match[2]) : 0;
            }) || []
        );
        
        const nextObjNum = allObjectivesInAxis.length > 0
            ? Math.max(...allObjectivesInAxis) + 1
            : 1;
        
        // Pad with leading zero for single digits
        const paddedObjNum = nextObjNum.toString().padStart(2, '0');
        
        const newObjective = {
            id: `${currentDomain.id}.${paddedObjNum}`,
            ...objectiveForm
        };

        const updatedAxes = axes.map(axis => {
            if (axis.id === currentAxis.id) {
                return {
                    ...axis,
                    domains: axis.domains.map(domain => {
                        if (domain.id === currentDomain.id) {
                            return {
                                ...domain,
                                objectives: [...(domain.objectives || []), newObjective]
                            };
                        }
                        return domain;
                    })
                };
            }
            return axis;
        });

        setAxes(updatedAxes);

        // Update currentAxis and currentDomain to reflect the new objective
        const updatedCurrentAxis = updatedAxes.find(axis => axis.id === currentAxis.id);
        const updatedCurrentDomain = updatedCurrentAxis.domains.find(domain => domain.id === currentDomain.id);
        setCurrentAxis(updatedCurrentAxis);
        setCurrentDomain(updatedCurrentDomain);

        // Reset form with properly initialized fields
        setObjectiveForm({
            name: '',
            description: '',
            levels: {
                1: { description: '' },
                2: { description: '' },
                3: { description: '' },
                4: { description: '' },
                5: { description: '' }
            },
            profile: 1,
            targetProfile: 1,
            comment: ''
        });
        toast({ title: "Success", description: "New objective created", type: "success" });
    };    const handleSave = async () => {
        // Check for empty axes
        if (axes.length === 0) {
            toast({ 
                title: "Validation Error", 
                description: "Please add at least one axis before saving",
                type: "error"
            });
            return;
        }

        // Check for axes without domains
        const invalidAxes = axes.filter(axis => !axis.domains || axis.domains.length === 0);
        if (invalidAxes.length > 0) {
            toast({ 
                title: "Validation Error", 
                description: `The following axes need at least one domain: ${invalidAxes.map(a => a.name).join(', ')}`,
                type: "error"
            });
            return;
        }

        // Check for domains without objectives
        const axesWithEmptyDomains = axes.filter(axis => 
            axis.domains.some(domain => !domain.objectives || domain.objectives.length === 0)
        );
        if (axesWithEmptyDomains.length > 0) {
            toast({ 
                title: "Validation Error", 
                description: `Some domains in the following axes need at least one objective: ${axesWithEmptyDomains.map(a => a.name).join(', ')}`,
                type: "error"
            });
            return;
        }

        // Validate objective levels and profiles
        const axesWithInvalidObjectives = axes.filter(axis => 
            axis.domains.some(domain => 
                domain.objectives?.some(obj => 
                    !obj.levels || 
                    Object.keys(obj.levels).length < 5 ||
                    Object.values(obj.levels).some(level => !level.description) ||
                    !obj.profile ||
                    obj.profile < 1 ||
                    obj.profile > 5 ||
                    (obj.targetProfile && (obj.targetProfile < obj.profile || obj.targetProfile > 5))
                )
            )
        );
        if (axesWithInvalidObjectives.length > 0) {
            toast({ 
                title: "Validation Error", 
                description: `Some objectives have invalid levels or profiles in the following axes: ${axesWithInvalidObjectives.map(a => a.name).join(', ')}`,
                type: "error"
            });
            return;
        }

        try {
            const NCSecMMData = {
                axes: axes.map(axis => ({
                    ...axis,
                    domains: axis.domains.map(domain => ({
                        ...domain,
                        objectives: domain.objectives || []
                    }))
                }))
            };

            // Save the data
            await saveNCSecMMData(NCSecMMData);
            
            // Fetch the latest data to ensure everything is synced
            await fetchNCSecMMData();
            
            toast({ title: "Success", description: "NCSecMM structure saved successfully", type: "success" });
            
            // Navigate after data is loaded
            onNavigate('NCSecMM');
        } catch (error) {
            toast({ 
                title: "Error", 
                description: error.message || "Failed to save NCSecMM structure", 
                type: "error" 
            });
        }
    };

    // Handle axis deletion
    const handleAxisDelete = (axisId) => {
        setAxes(axes.filter(a => a.id !== axisId));
        if (currentAxis?.id === axisId) {
            setCurrentAxis(null);
            setCurrentDomain(null);
        }
    };

    // Handle domain deletion
    const handleDomainDelete = (domainId) => {
        const updatedAxes = axes.map(axis => {
            if (axis.id === currentAxis.id) {
                return {
                    ...axis,
                    domains: axis.domains.filter(d => d.id !== domainId)
                };
            }
            return axis;
        });
        setAxes(updatedAxes);
        if (currentDomain?.id === domainId) {
            setCurrentDomain(null);
        }
        // Update currentAxis to reflect domain removal
        const updatedCurrentAxis = updatedAxes.find(axis => axis.id === currentAxis.id);
        setCurrentAxis(updatedCurrentAxis);
    };

    // Handle objective deletion
    const handleObjectiveDelete = (objectiveId) => {
        const updatedAxes = axes.map(axis => {
            if (axis.id === currentAxis.id) {
                return {
                    ...axis,
                    domains: axis.domains.map(domain => {
                        if (domain.id === currentDomain.id) {
                            return {
                                ...domain,
                                objectives: (domain.objectives || []).filter(o => o.id !== objectiveId)
                            };
                        }
                        return domain;
                    })
                };
            }
            return axis;
        });
        setAxes(updatedAxes);
        // Update currentAxis and currentDomain to reflect objective removal
        const updatedCurrentAxis = updatedAxes.find(axis => axis.id === currentAxis.id);
        const updatedCurrentDomain = updatedCurrentAxis.domains.find(domain => domain.id === currentDomain.id);
        setCurrentAxis(updatedCurrentAxis);
        setCurrentDomain(updatedCurrentDomain);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">NCSecMM Builder</h1>
                            <p className="text-gray-600">Create your cybersecurity maturity model from scratch</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={axes.length === 0}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Save and Continue
                    </Button>
                </div>

                {/* Builder Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Axes Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Axes</CardTitle>
                            <CardDescription>Define the main assessment areas</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleAxisSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={axisForm.name}
                                        onChange={(e) => setAxisForm({ ...axisForm, name: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <input
                                        type="color"
                                        value={axisForm.color}
                                        onChange={(e) => setAxisForm({ ...axisForm, color: e.target.value })}
                                        className="w-full h-10 rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={axisForm.description}
                                        onChange={(e) => setAxisForm({ ...axisForm, description: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {isEditing ? 'Update Axis' : 'Add Axis'}
                                </Button>
                            </form>

                            <div className="mt-6 space-y-2">
                                {axes.map(axis => (
                                    <div
                                        key={axis.id}
                                        className={`p-3 rounded-md border ${currentAxis?.id === axis.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                            } hover:border-blue-500 cursor-pointer group transition-all`}
                                        onClick={() => setCurrentAxis(axis)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: axis.color }} />
                                                <span className="font-medium">{axis.name}</span>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAxisForm({
                                                            name: axis.name,
                                                            color: axis.color,
                                                            description: axis.description
                                                        });
                                                        setCurrentAxis(axis);
                                                        setIsEditing(true);
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-blue-600"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAxisDelete(axis.id);
                                                    }}
                                                    className="p-1 text-gray-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500 truncate">{axis.domains.length} domains</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Domains Section */}
                    <Card className={!currentAxis ? 'opacity-50' : ''}>
                        <CardHeader>
                            <CardTitle>Domains</CardTitle>
                            <CardDescription>Define areas within the selected axis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleDomainSubmit} className="space-y-4" disabled={!currentAxis}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={domainForm.name}
                                        onChange={(e) => setDomainForm({ ...domainForm, name: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        disabled={!currentAxis}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={domainForm.description}
                                        onChange={(e) => setDomainForm({ ...domainForm, description: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                        disabled={!currentAxis}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={!currentAxis}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Domain
                                </Button>
                            </form>

                            {currentAxis && (
                                <div className="mt-6 space-y-2">
                                    {currentAxis.domains.map(domain => (
                                        <div
                                            key={domain.id}
                                            className={`p-3 rounded-md border ${currentDomain?.id === domain.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                                } hover:border-blue-500 cursor-pointer group transition-all`}
                                            onClick={() => setCurrentDomain(domain)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{domain.name}</span>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDomainDelete(domain.id);
                                                        }}
                                                        className="p-1 text-gray-500 hover:text-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-500 truncate">
                                                {domain.objectives?.length || 0} objectives
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Objectives Section */}
                    <Card className={`md:col-span-2 ${!currentDomain ? 'opacity-50' : ''}`}>
                        <CardHeader>
                            <CardTitle>Objectives</CardTitle>
                            <CardDescription>Define objectives for the selected domain</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleObjectiveSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={objectiveForm.name}
                                            onChange={(e) => setObjectiveForm({ ...objectiveForm, name: e.target.value })}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            disabled={!currentDomain}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={objectiveForm.description}
                                            onChange={(e) => setObjectiveForm({ ...objectiveForm, description: e.target.value })}
                                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            rows="3"
                                            disabled={!currentDomain}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Maturity Levels */}
                                <h4 className="text-sm font-medium text-gray-900">Maturity Levels</h4>
                                <div className="grid md:grid-cols-5 gap-3">
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <div key={level} className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Level {level} Description
                                            </label>
                                            <textarea
                                                value={objectiveForm.levels[level].description}
                                                onChange={(e) => setObjectiveForm({
                                                    ...objectiveForm,
                                                    levels: {
                                                        ...objectiveForm.levels,
                                                        [level]: { description: e.target.value }
                                                    }
                                                })}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                rows="2"
                                                disabled={!currentDomain}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Profiles */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Profile
                                        </label>
                                        <select
                                            value={objectiveForm.profile}
                                            onChange={(e) => setObjectiveForm({
                                                ...objectiveForm,
                                                profile: parseInt(e.target.value),
                                                targetProfile: Math.max(parseInt(e.target.value), objectiveForm.targetProfile)
                                            })}
                                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            disabled={!currentDomain}
                                            required
                                        >
                                            {[1, 2, 3, 4, 5].map(level => (
                                                <option key={level} value={level}>Level {level}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Target Profile (Optional)
                                        </label>
                                        <select
                                            value={objectiveForm.targetProfile}
                                            onChange={(e) => setObjectiveForm({
                                                ...objectiveForm,
                                                targetProfile: parseInt(e.target.value)
                                            })}
                                            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            disabled={!currentDomain}
                                        >
                                            {[1, 2, 3, 4, 5].map(level => (
                                                <option key={level} value={level} disabled={level < objectiveForm.profile}>
                                                    Level {level}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Comments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Comments (Optional)
                                    </label>
                                    <textarea
                                        value={objectiveForm.comment}
                                        onChange={(e) => setObjectiveForm({ ...objectiveForm, comment: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="2"
                                        disabled={!currentDomain}
                                        placeholder="Add any additional notes or comments..."
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={!currentDomain}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Objective
                                </Button>
                            </form>

                            {currentDomain && (
                                <div className="mt-6 grid md:grid-cols-4 gap-3">
                                    {currentDomain.objectives?.map(objective => (<div
                                        key={objective.id}
                                        className="p-4 rounded-md border border-gray-200 group transition-all hover:border-blue-500"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-lg">{objective.name}</span>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleObjectiveDelete(objective.id)}
                                                    className="p-1 text-gray-500 hover:text-red-600"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">{objective.description}</p>

                                        {/* Profiles */}
                                        <div className="flex gap-4 mb-4">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium text-gray-500 mr-2">Current Profile:</span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                                    Level {objective.profile}
                                                </span>
                                            </div>
                                            {objective.targetProfile > objective.profile && (
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium text-gray-500 mr-2">Target:</span>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                                                        Level {objective.targetProfile}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Level Descriptions */}
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium text-gray-500 mb-1">Maturity Levels:</div>
                                            {Object.entries(objective.levels).map(([level, { description }]) => (
                                                <div
                                                    key={level}
                                                    className={`text-sm p-2 rounded ${parseInt(level) === objective.profile
                                                        ? 'bg-blue-50 border border-blue-200'
                                                        : 'bg-gray-50 border border-gray-200'
                                                        }`}
                                                >
                                                    <span className="font-medium">Level {level}:</span> {description}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Comment */}
                                        {objective.comment && (
                                            <div className="mt-4 text-sm text-gray-500">
                                                <span className="font-medium">Comment:</span> {objective.comment}
                                            </div>
                                        )}
                                    </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default NCSecMMBuilder;