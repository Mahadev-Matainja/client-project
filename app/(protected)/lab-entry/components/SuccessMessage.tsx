"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function SuccessMessage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="border-green-200 bg-green-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Tests saved successfully!</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
