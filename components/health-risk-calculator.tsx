"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  Brain,
  Shield,
  TrendingUp,
  Calculator,
  ChevronRight,
} from "lucide-react"

interface HealthData {
  age: number
  gender: string
  height: number
  weight: number
  bloodPressure: string
  smoking: string
  exercise: number
  familyHistory: string
  stress: number
  sleep: number
  diet: string
}

interface RiskResult {
  overall: number
  cardiovascular: number
  diabetes: number
  mental: number
  category: string
  color: string
  recommendations: string[]
}

export default function HealthRiskCalculator() {
  const [healthData, setHealthData] = useState<HealthData>({
    age: 30,
    gender: "",
    height: 170,
    weight: 70,
    bloodPressure: "",
    smoking: "",
    exercise: 3,
    familyHistory: "",
    stress: 5,
    sleep: 7,
    diet: "",
  })

  const [result, setResult] = useState<RiskResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const calculateBMI = () => {
    const heightInM = healthData.height / 100
    return healthData.weight / (heightInM * heightInM)
  }

  const calculateRisk = () => {
    let riskScore = 0
    let cardiovascularRisk = 0
    let diabetesRisk = 0
    let mentalRisk = 0

    // Age factor
    if (healthData.age > 65) riskScore += 20
    else if (healthData.age > 45) riskScore += 10
    else if (healthData.age > 35) riskScore += 5

    // BMI factor
    const bmi = calculateBMI()
    if (bmi > 30) {
      riskScore += 15
      cardiovascularRisk += 20
      diabetesRisk += 25
    } else if (bmi > 25) {
      riskScore += 8
      cardiovascularRisk += 10
      diabetesRisk += 15
    }

    // Blood pressure
    if (healthData.bloodPressure === "high") {
      riskScore += 20
      cardiovascularRisk += 30
    } else if (healthData.bloodPressure === "elevated") {
      riskScore += 10
      cardiovascularRisk += 15
    }

    // Smoking
    if (healthData.smoking === "current") {
      riskScore += 25
      cardiovascularRisk += 35
    } else if (healthData.smoking === "former") {
      riskScore += 10
      cardiovascularRisk += 15
    }

    // Exercise (less exercise = higher risk)
    const exerciseRisk = Math.max(0, (5 - healthData.exercise) * 3)
    riskScore += exerciseRisk
    cardiovascularRisk += exerciseRisk * 1.5
    diabetesRisk += exerciseRisk * 1.2

    // Family history
    if (healthData.familyHistory === "yes") {
      riskScore += 15
      cardiovascularRisk += 20
      diabetesRisk += 20
    }

    // Stress level (higher stress = higher risk)
    const stressRisk = (healthData.stress - 1) * 2
    riskScore += stressRisk
    mentalRisk += stressRisk * 2

    // Sleep (poor sleep = higher risk)
    if (healthData.sleep < 6) {
      riskScore += 10
      mentalRisk += 15
    } else if (healthData.sleep < 7) {
      riskScore += 5
      mentalRisk += 8
    }

    // Diet
    if (healthData.diet === "poor") {
      riskScore += 15
      cardiovascularRisk += 20
      diabetesRisk += 18
    } else if (healthData.diet === "average") {
      riskScore += 8
      cardiovascularRisk += 10
      diabetesRisk += 10
    }

    // Normalize scores to 0-100
    const overall = Math.min(100, Math.max(0, riskScore))
    const cardio = Math.min(100, Math.max(0, cardiovascularRisk))
    const diabetes = Math.min(100, Math.max(0, diabetesRisk))
    const mental = Math.min(100, Math.max(0, mentalRisk))

    let category = "Low Risk"
    let color = "text-green-600"
    let recommendations: string[] = []

    if (overall < 25) {
      category = "Low Risk"
      color = "text-green-600"
      recommendations = [
        "Maintain your current healthy lifestyle",
        "Continue regular exercise routine",
        "Keep up with preventive health screenings",
      ]
    } else if (overall < 50) {
      category = "Moderate Risk"
      color = "text-yellow-600"
      recommendations = [
        "Consider lifestyle modifications",
        "Increase physical activity",
        "Schedule regular health check-ups",
        "Monitor blood pressure and weight",
      ]
    } else if (overall < 75) {
      category = "High Risk"
      color = "text-orange-600"
      recommendations = [
        "Consult with healthcare provider immediately",
        "Implement significant lifestyle changes",
        "Consider professional dietary counseling",
        "Regular monitoring of vital signs",
      ]
    } else {
      category = "Very High Risk"
      color = "text-red-600"
      recommendations = [
        "Seek immediate medical consultation",
        "Comprehensive health evaluation needed",
        "Consider specialist referrals",
        "Urgent lifestyle intervention required",
      ]
    }

    setResult({
      overall,
      cardiovascular: cardio,
      diabetes,
      mental,
      category,
      color,
      recommendations,
    })
    setShowResult(true)
  }

  const resetCalculator = () => {
    setHealthData({
      age: 30,
      gender: "",
      height: 170,
      weight: 70,
      bloodPressure: "",
      smoking: "",
      exercise: 3,
      familyHistory: "",
      stress: 5,
      sleep: 7,
      diet: "",
    })
    setResult(null)
    setShowResult(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calculator Form */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-3">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900">Health Risk Assessment</CardTitle>
              <CardDescription className="text-gray-600">
                Fill in your information to calculate your health risk factors
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={healthData.age}
                  onChange={(e) => setHealthData({ ...healthData, age: Number.parseInt(e.target.value) || 0 })}
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={healthData.gender}
                  onValueChange={(value) => setHealthData({ ...healthData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={healthData.height}
                  onChange={(e) => setHealthData({ ...healthData, height: Number.parseInt(e.target.value) || 0 })}
                  min="100"
                  max="250"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={healthData.weight}
                  onChange={(e) => setHealthData({ ...healthData, weight: Number.parseInt(e.target.value) || 0 })}
                  min="30"
                  max="200"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                BMI: <span className="font-semibold">{calculateBMI().toFixed(1)}</span>
                {calculateBMI() < 18.5 && <span className="text-blue-600 ml-2">(Underweight)</span>}
                {calculateBMI() >= 18.5 && calculateBMI() < 25 && <span className="text-green-600 ml-2">(Normal)</span>}
                {calculateBMI() >= 25 && calculateBMI() < 30 && (
                  <span className="text-yellow-600 ml-2">(Overweight)</span>
                )}
                {calculateBMI() >= 30 && <span className="text-red-600 ml-2">(Obese)</span>}
              </p>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-600" />
              Health Metrics
            </h3>

            <div>
              <Label>Blood Pressure</Label>
              <Select
                value={healthData.bloodPressure}
                onValueChange={(value) => setHealthData({ ...healthData, bloodPressure: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood pressure status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (&lt;120/80)</SelectItem>
                  <SelectItem value="elevated">Elevated (120-129/&lt;80)</SelectItem>
                  <SelectItem value="high">High (&gt;130/80)</SelectItem>
                  <SelectItem value="unknown">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Smoking Status</Label>
              <Select
                value={healthData.smoking}
                onValueChange={(value) => setHealthData({ ...healthData, smoking: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select smoking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never smoked</SelectItem>
                  <SelectItem value="former">Former smoker</SelectItem>
                  <SelectItem value="current">Current smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Lifestyle Factors
            </h3>

            <div>
              <Label>Exercise (days per week): {healthData.exercise}</Label>
              <Slider
                value={[healthData.exercise]}
                onValueChange={(value) => setHealthData({ ...healthData, exercise: value[0] })}
                max={7}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Stress Level (1-10): {healthData.stress}</Label>
              <Slider
                value={[healthData.stress]}
                onValueChange={(value) => setHealthData({ ...healthData, stress: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Sleep Hours per Night: {healthData.sleep}</Label>
              <Slider
                value={[healthData.sleep]}
                onValueChange={(value) => setHealthData({ ...healthData, sleep: value[0] })}
                max={12}
                min={4}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Diet Quality</Label>
              <Select value={healthData.diet} onValueChange={(value) => setHealthData({ ...healthData, diet: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (Balanced, nutritious)</SelectItem>
                  <SelectItem value="good">Good (Mostly healthy)</SelectItem>
                  <SelectItem value="average">Average (Mixed)</SelectItem>
                  <SelectItem value="poor">Poor (Processed, unhealthy)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Family History of Chronic Diseases</Label>
              <Select
                value={healthData.familyHistory}
                onValueChange={(value) => setHealthData({ ...healthData, familyHistory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select family history" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No significant history</SelectItem>
                  <SelectItem value="yes">Yes (Heart disease, diabetes, etc.)</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={calculateRisk} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Calculate Risk
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={resetCalculator} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50">
          <CardTitle className="text-2xl text-gray-900 flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-teal-600" />
            Your Health Risk Assessment
          </CardTitle>
          <CardDescription>
            {showResult ? "Based on your provided information" : "Complete the form to see your results"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {showResult && result ? (
            <div className="space-y-6">
              {/* Overall Risk */}
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className={`text-4xl font-bold mb-2 ${result.color}`}>{result.overall.toFixed(0)}%</div>
                <Badge
                  variant="secondary"
                  className={`text-lg px-4 py-2 ${result.color.replace("text-", "bg-").replace("-600", "-100")} ${result.color}`}
                >
                  {result.category}
                </Badge>
                <p className="text-gray-600 mt-2">Overall Health Risk Score</p>
              </div>

              {/* Specific Risk Categories */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-red-600 mr-3" />
                    <span className="font-medium">Cardiovascular Risk</span>
                  </div>
                  <span className="text-red-600 font-bold">{result.cardiovascular.toFixed(0)}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium">Diabetes Risk</span>
                  </div>
                  <span className="text-blue-600 font-bold">{result.diabetes.toFixed(0)}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium">Mental Health Risk</span>
                  </div>
                  <span className="text-purple-600 font-bold">{result.mental.toFixed(0)}%</span>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  {result.overall < 25 ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  )}
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Take Action Today</h4>
                <p className="text-gray-600 mb-4">
                  Ready to improve your health? Our experts can help you create a personalized plan.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Book Consultation
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Download Report</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Calculator className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Assess Your Health?</h3>
              <p className="text-gray-600 mb-4">
                Fill out the form on the left to get your personalized health risk assessment.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✓ Free and confidential</p>
                <p>✓ Based on medical guidelines</p>
                <p>✓ Personalized recommendations</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
