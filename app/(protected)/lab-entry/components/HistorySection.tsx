"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistorySectionProps {
  setActiveSection: (section: string) => void;
}

export default function HistorySection({
  setActiveSection,
}: HistorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Recent Test Entries
        </CardTitle>
        <CardDescription>Your recently entered test results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent test entries found.</p>
          <Button className="mt-4" onClick={() => setActiveSection("entry")}>
            Start Entering Tests
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
