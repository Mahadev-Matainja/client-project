"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Video,
  Book,
  Users,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react"
import MainLayout from "@/components/layout/main-layout"

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const faqCategories = [
    { id: "all", name: "All Topics", count: 24 },
    { id: "account", name: "Account & Billing", count: 6 },
    { id: "tests", name: "Test Results", count: 8 },
    { id: "subscription", name: "Subscription Plans", count: 5 },
    { id: "privacy", name: "Privacy & Security", count: 3 },
    { id: "technical", name: "Technical Support", count: 2 },
  ]

  const faqs = [
    {
      id: "1",
      category: "account",
      question: "How do I update my profile information?",
      answer:
        "You can update your profile information by navigating to the Profile page from the sidebar. Click the 'Edit Profile' button to make changes to your personal and medical information.",
      popular: true,
    },
    {
      id: "2",
      category: "tests",
      question: "How do I enter my lab test results?",
      answer:
        "Go to the 'Test Entry' page from the sidebar or dashboard. Select the tests you want to enter, fill in the values, and add any additional information like lab name and doctor. Click 'Save Entry' when done.",
      popular: true,
    },
    {
      id: "3",
      category: "subscription",
      question: "What's the difference between Silver, Gold, and Platinum plans?",
      answer:
        "Silver allows 20 test entries/month with 1-year storage. Gold offers 50 entries with 2-year storage plus family profiles. Platinum provides 100 entries with 5-year storage, AI insights, and 24/7 support.",
      popular: true,
    },
    {
      id: "4",
      category: "tests",
      question: "How do I interpret my test results?",
      answer:
        "Each test result shows your value, the reference range, and a status indicator (Normal, High, Low, Critical). You can view detailed information by clicking on any test result in your records.",
      popular: false,
    },
    {
      id: "5",
      category: "privacy",
      question: "How is my health data protected?",
      answer:
        "We use bank-level 256-bit AES encryption and comply with HIPAA regulations. Your data is encrypted both at rest and in transit. You control who can access your information.",
      popular: false,
    },
    {
      id: "6",
      category: "subscription",
      question: "Can I change my subscription plan?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time from the Subscription page. Changes take effect at your next billing cycle. Your data is always preserved when changing plans.",
      popular: false,
    },
    {
      id: "7",
      category: "account",
      question: "How do I reset my password?",
      answer:
        "Click on 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within a few minutes. Follow the instructions in the email to create a new password.",
      popular: false,
    },
    {
      id: "8",
      category: "tests",
      question: "Can I share my test results with my doctor?",
      answer:
        "Yes, you can share individual test results or comprehensive reports with your healthcare providers. Use the 'Share with Doctor' button on any test record or generate a PDF report from the Analytics page.",
      popular: true,
    },
    {
      id: "9",
      category: "technical",
      question: "The app is running slowly. What should I do?",
      answer:
        "Try refreshing your browser, clearing your cache, or using a different browser. If the issue persists, contact our technical support team with details about your device and browser version.",
      popular: false,
    },
    {
      id: "10",
      category: "privacy",
      question: "Can I delete my account and all my data?",
      answer:
        "Yes, you can permanently delete your account and all associated data from the Settings page under 'Data Management'. This action is irreversible and will remove all your health records.",
      popular: false,
    },
  ]

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="h-6 w-6" />,
      availability: "24/7 for Platinum, Business hours for others",
      action: "Start Chat",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="h-6 w-6" />,
      availability: "Response within 24 hours",
      action: "Send Email",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: <Phone className="h-6 w-6" />,
      availability: "Platinum members only",
      action: "Call Now",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Video Tutorial",
      description: "Watch step-by-step guides",
      icon: <Video className="h-6 w-6" />,
      availability: "Available 24/7",
      action: "Watch Videos",
      color: "bg-orange-50 text-orange-600",
    },
  ]

  const resources = [
    {
      title: "User Guide",
      description: "Complete guide to using the platform",
      icon: <Book className="h-5 w-5" />,
      link: "#",
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video instructions",
      icon: <Video className="h-5 w-5" />,
      link: "#",
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: <Users className="h-5 w-5" />,
      link: "#",
    },
    {
      title: "API Documentation",
      description: "For developers and integrations",
      icon: <FileText className="h-5 w-5" />,
      link: "#",
    },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularFaqs = faqs.filter((faq) => faq.popular)

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Help Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions, get support, and learn how to make the most of your health dashboard
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`mx-auto p-3 rounded-full w-fit mb-4 ${option.color}`}>{option.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-4">
                  <Clock className="h-3 w-3" />
                  {option.availability}
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Popular Questions
            </CardTitle>
            <CardDescription>Most frequently asked questions by our users</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {popularFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      {faq.question}
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* FAQ Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {faqCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-between"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCategory === "all"
                    ? "All Questions"
                    : faqCategories.find((c) => c.id === selectedCategory)?.name}
                  ({filteredFaqs.length})
                </CardTitle>
                <CardDescription>
                  {searchTerm ? `Search results for "${searchTerm}"` : "Browse through our comprehensive FAQ"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions found</p>
                    <p className="text-sm">Try adjusting your search or browse different categories</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-2">
                            {faq.question}
                            {faq.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>Explore more ways to get help and learn about the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.map((resource, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col gap-2 bg-transparent hover:bg-gray-50"
                  asChild
                >
                  <a href={resource.link} className="text-center">
                    <div className="p-2 bg-gray-100 rounded-full">{resource.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{resource.title}</div>
                      <div className="text-xs text-gray-600">{resource.description}</div>
                    </div>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>Our support team is here to assist you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold">Email Support</h4>
                <p className="text-sm text-gray-600">support@abhicare.com</p>
                <p className="text-xs text-gray-500">Response within 24 hours</p>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-full w-fit mx-auto">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold">Phone Support</h4>
                <p className="text-sm text-gray-600">1-800-ABHICARE</p>
                <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM EST</p>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-purple-50 rounded-full w-fit mx-auto">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold">Live Chat</h4>
                <p className="text-sm text-gray-600">Available in-app</p>
                <p className="text-xs text-gray-500">24/7 for Platinum members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
