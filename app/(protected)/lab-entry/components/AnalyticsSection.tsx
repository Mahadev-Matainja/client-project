"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsSection({
  setActiveSection,
}: {
  setActiveSection: (section: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Test Analytics
        </CardTitle>
        <CardDescription>
          Analytics and insights from your test data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Analytics will be available once you have entered test data.
          </p>
          <Button className="mt-4" onClick={() => setActiveSection("entry")}>
            Enter Test Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
