import React, { useRef } from "react";
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Shield, FileText, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react"

function WelcomeScreen({ onFileUpload, onDownloadTemplate, onNavigate }) {
  const fileInputRef = useRef();

  // Trigger file input dialog
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Navigation for evaluation
  const handleStartEvaluation = () => {
    console.log("Starting evaluation");
    onNavigate("gcmm");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Name */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">NCSec Platform</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button onClick={handleImportClick} variant="outline" className="text-md px-4 py-3 text-blue-600 hover:bg-blue-600 hover:text-white">
                Import File
                <FileText className="h-4 w-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              <Button onClick={handleStartEvaluation} className="bg-blue-600 hover:bg-blue-700 text-md text-white px-4 py-3">
                Start Evaluation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your <span className="text-blue-600">Cybersecurity Maturity</span> Assessment
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Evaluate, track, and improve your organization's cybersecurity posture with our comprehensive platform.
              Accessible and actionable for teams of all sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleStartEvaluation} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg text-white px-8 py-3">
                Start New Evaluation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button onClick={handleImportClick} size="lg" variant="outline" className="text-lg px-8 py-3 text-blue-600 hover:bg-blue-600 hover:text-white">
                Import Existing File
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose NCSec Platform?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes cybersecurity maturity assessment simple, collaborative, and actionable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Assessment</h3>
              <p className="text-gray-600">
                Evaluate your cybersecurity maturity across all critical domains with industry-standard frameworks.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Work together with your team members to ensure accurate assessments and shared understanding.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Actionable Reports</h3>
              <p className="text-gray-600">
                Generate detailed reports with clear recommendations to improve your security posture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Guide */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with your cybersecurity maturity assessment in just a few simple steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Starting Point</h3>
                  <p className="text-gray-600">
                    Import an existing NCSec file to continue previous work, or start a fresh evaluation from scratch.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete the Assessment</h3>
                  <p className="text-gray-600">
                    Follow our guided process to evaluate your organization's cybersecurity maturity across all key
                    areas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborate & Improve</h3>
                  <p className="text-gray-600">
                    Work with your team members and generate comprehensive reports with actionable recommendations.
                  </p>
                </div>
              </div>
            </div>

            <Card className="lg:ml-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Ready to Get Started?
                </CardTitle>
                <CardDescription>
                  Choose how you'd like to begin your cybersecurity maturity assessment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleImportClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                  <FileText className="mr-2 h-4 w-4" />
                  Import Existing NCSec File
                </Button>
                <Button onClick={handleStartEvaluation} variant="outline" className="w-full text-blue-600 hover:bg-blue-600 hover:text-white" size="lg">
                  <Shield className="mr-2 h-4 w-4" />
                  Start New Evaluation
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Both options will guide you through the complete assessment process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Strengthen Your Cybersecurity Posture Today</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join organizations worldwide who trust NCSec Platform to assess and improve their cybersecurity maturity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Start Your Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">NCSec Platform</span>
          </div>
          <p className="text-gray-400">
            © 2024 NCSec Platform. Streamlining cybersecurity maturity assessments for organizations worldwide.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default WelcomeScreen;
