"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Crown,
  Check,
  X,
  Star,
  Shield,
  Database,
  TrendingUp,
  FileText,
  Zap,
  Heart,
  Award,
  Phone,
  Mail,
  AlertTriangle,
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import {
  fetchSubcription,
  RazorpaySignatureVerification,
  selectSubscription,
} from "@/services/Subcription";

import { RazorpayScriptLoader } from "@/utils/RazorpayScriptLoader";
import { toast } from "@/hooks/use-toast";
import Swal from "sweetalert2";

//  Type definition
interface SubscriptionPlan {
  id: number;
  name: string;
  icon: React.ReactNode;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    recordsEntry: number;
    analysisPeriod: number;
    recordSave: number;
    additionalFeatures: string[];
  };
  limitations: string[] | string;
  color: string;
  gradient: string;
  popular: boolean;
}

//  Icon mapping helper
const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="h-6 w-6" />,
  Star: <Star className="h-6 w-6" />,
  Crown: <Crown className="h-6 w-6" />,
};
const gradientMap: Record<string, string> = {
  silver: "from-gray-100 to-gray-200",
  gold: "from-yellow-100 to-yellow-200",
  platinum: "from-purple-100 to-purple-200",
};

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchSubcription();
        const formattedPlans = res.data.map((plan: any) => {
          const iconMatch = plan.icon.match(/<(\w+)/);
          const iconName = iconMatch ? iconMatch[1] : "Shield";

          return {
            ...plan,
            icon: iconMap[iconName] || <Shield className="h-6 w-6" />,
            id: Number(plan.id),
          };
        });

        setPlans(formattedPlans);
        setCurrentPlan(res.currentPlan);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleSelectPlan = async (plan_id: number) => {
    try {
      // Step 1: Load Razorpay SDK
      const isLoaded = await RazorpayScriptLoader();
      if (!isLoaded) {
        toast({
          title: "Failed to load Razorpay",
          description: "Please check your internet connection.",
          variant: "destructive",
        });

        return;
      }

      // Step 2: Create order via Laravel backend
      const orderResponse = await selectSubscription({
        plan_id,
        plan_duration: billingCycle,
      });

      const orderData = orderResponse?.data?.order;
      const customerDetails = orderResponse?.data?.customer_data;

      if (!orderData?.id) {
        toast({
          title: "Order creation failed",
          description: "Unable to initialize payment.",
          variant: "destructive",
        });
        return;
      }

      const { key, amount, currency, id, plan_name } = orderData;
      const { customer_id, name, contact, email } = customerDetails;

      // Step 3: Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Predikr Health",
        description: `${plan_name} Subscription`,
        order_id: id,
        payment_capture: 1,

        prefill: {
          customer_id,
          name,
          email,
          contact,
        },
        theme: {
          color: "#6366f1",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await RazorpaySignatureVerification({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan_id,
            });

            if (verifyRes.data.success) {
              Swal.fire({
                title: "Payment Successful 🎉",
                text: "Your subscription has been activated.",
                icon: "success",
                showConfirmButton: false,
                timer: 2500,
              });
            } else {
              Swal.fire({
                title: "Verification Failed",
                text: "Something went wrong verifying your payment.",
                icon: "error",
              });
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast({
              title: "Verification failed",
              description: "Something went wrong verifying your payment.",
              variant: "destructive",
            });
          }
        },
      };

      // Step 4: Open Razorpay popup
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment:", error);
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-yellow-600" />
            <h1 className="text-4xl font-bold">Choose Your Health Plan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock advanced health analytics, extended record storage, and
            premium features to take control of your health journey.
          </p>
        </div>

        {/* Current Plan Badge */}
        <div className="flex items-center justify-center gap-2">
          {currentPlan || selectedPlan ? (
            <Badge
              variant="outline"
              className="px-4 py-2 bg-green-600 flex items-center gap-2"
            >
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-white font-semibold">
                Current Plan: {currentPlan || selectedPlan}
              </span>
            </Badge>
          ) : (
            <div className="px-4 py-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>
                No active subscription found — please subscribe to continue.
              </span>
            </div>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <Label
            htmlFor="billing-toggle"
            className={billingCycle === "monthly" ? "font-semibold" : ""}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? "yearly" : "monthly")
            }
          />
          <Label
            htmlFor="billing-toggle"
            className={billingCycle === "yearly" ? "font-semibold" : ""}
          >
            Yearly
          </Label>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse border rounded-lg shadow-sm p-6 space-y-4 bg-white"
                >
                  <div className="h-6 w-24 bg-gray-200 rounded mx-auto" />
                  <div className="h-10 w-32 bg-gray-200 rounded mx-auto" />
                  <div className="space-y-3 mt-4">
                    <div className="h-5 bg-gray-200 rounded" />
                    <div className="h-5 bg-gray-200 rounded" />
                    <div className="h-5 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-3 mt-6">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="h-10 bg-gray-300 rounded mt-6" />
                </div>
              ))
            : plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all duration-300 hover:shadow-lg ${
                    plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                  } ${
                    currentPlan === plan.name ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader
                    className={`text-center bg-gradient-to-br  ${
                      gradientMap[plan.name.toLowerCase()] ||
                      "from-gray-100 to-gray-200"
                    } rounded-t-lg py-2.5`}
                  >
                    <div
                      className={`mx-auto p-3 rounded-full bg-white ${plan.color}`}
                    >
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>

                    <div className="space-y-2">
                      <div className="text-4xl font-bold">
                        ₹
                        {billingCycle === "yearly"
                          ? plan.price.yearly
                          : plan.price.monthly}
                        <span className="text-lg font-normal text-gray-600">
                          /{billingCycle === "yearly" ? "year" : "month"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 p-6">
                    {/* Core Features */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Records Entry</span>
                        </div>
                        <Badge variant="outline">
                          {plan.features.recordsEntry}/month
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Analysis Period</span>
                        </div>
                        <Badge variant="outline">
                          {plan.features.analysisPeriod} days
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Record Storage</span>
                        </div>
                        <Badge variant="outline">
                          {plan.features.recordSave} year
                          {plan.features.recordSave > 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Additional Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Features Included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.additionalFeatures.map(
                          (feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Limitations */}
                    {Array.isArray(plan.limitations) &&
                      plan.limitations.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">
                              Limitations:
                            </h4>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2"
                                >
                                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-600">
                                    {limitation}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                    {/* ✅ Action Button */}
                    <div className="pt-4">
                      {currentPlan?.toLowerCase() ===
                      plan.name.toLowerCase() ? (
                        <Button
                          variant="outline"
                          className="w-full border-green-600 text-green-700 bg-transparent cursor-not-allowed hover:bg-transparent"
                        >
                          <Award className="h-4 w-4 mr-2 text-green-800" />
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          className={`w-full cursor-pointer ${
                            plan.popular
                              ? "bg-blue-600 hover:bg-blue-700"
                              : plan.name.toLowerCase() === "platinum"
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-gray-700 hover:bg-gray-800"
                          }`}
                          onClick={() => handleSelectPlan(plan.id)}
                        >
                          {plan.name.toLowerCase() === "platinum" && (
                            <Zap className="h-4 w-4 mr-2" />
                          )}
                          {currentPlan &&
                          plans.findIndex(
                            (p) =>
                              p.name.toLowerCase() === currentPlan.toLowerCase()
                          ) < plans.findIndex((p) => p.id === plan.id)
                            ? `Upgrade to ${plan.name}`
                            : `Select ${plan.name}`}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-7xl mx-auto mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Detailed Feature Comparison
              </CardTitle>
              <CardDescription className="text-center">
                Compare all features across our subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold">
                        Features
                      </th>
                      {plans.map((plan) => (
                        <th
                          key={plan.id}
                          className="text-center py-4 px-4 font-semibold"
                        >
                          <div className="flex items-center justify-center gap-2">
                            {plan.icon}
                            {plan.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">
                        Monthly Test Entries
                      </td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          <Badge variant="outline">
                            {plan.features.recordsEntry}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Analysis Period</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.features.analysisPeriod} days
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Record Storage</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.features.recordSave} year
                          {plan.features.recordSave > 1 ? "s" : ""}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Family Profiles</td>
                      <td className="text-center py-4 px-4">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">Up to 3</td>
                      <td className="text-center py-4 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">
                        AI Health Insights
                      </td>
                      <td className="text-center py-4 px-4">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Support</td>
                      <td className="text-center py-4 px-4">Email</td>
                      <td className="text-center py-4 px-4">Email + Chat</td>
                      <td className="text-center py-4 px-4">
                        24/7 All Channels
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Can I change my plan anytime?
                  </h4>
                  <p className="text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time.
                    Changes will be reflected in your next billing cycle.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    What happens to my data if I downgrade?
                  </h4>
                  <p className="text-gray-600">
                    Your data is always safe. If you downgrade, older records
                    beyond your new plan's retention period will be archived but
                    not deleted.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Is there a free trial available?
                  </h4>
                  <p className="text-gray-600">
                    Yes, we offer a 14-day free trial for all plans. No credit
                    card required to start your trial.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    How secure is my health data?
                  </h4>
                  <p className="text-gray-600">
                    We use bank-level encryption and comply with HIPAA
                    regulations to ensure your health data is completely secure
                    and private.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Need Help Choosing?</h3>
          <p className="text-gray-600">
            Our health advisors are here to help you select the perfect plan
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Phone className="h-4 w-4" />
              Call Us
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
