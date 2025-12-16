import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProfileSubscriptionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          Subscription Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Current Plan</span>
          <Badge>Premium</Badge>
        </div>

        <div className="flex justify-between">
          <span>Status</span>
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        </div>

        <div className="flex justify-between">
          <span>Next Billing</span>
          <span>2025-02-15</span>
        </div>

        <Button variant="outline" className="w-full gap-2">
          <Star className="h-4 w-4" />
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSubscriptionCard;
