"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
  icon: string;
  title: string | React.ReactNode;
  description: string;
  features: string[];
  redirect?: string | null;
  buttonColor?: string;
  iconBg?: string;
  iconColor?: string;
  borderHover?: string;
  btnIcon?: React.ComponentType<{ className?: string }>;
  openSignup?: boolean;
  onOpenSignup?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  features,
  redirect = null,
  buttonColor = "",
  iconBg = "",
  iconColor = "",
  borderHover = "",
  btnIcon: BtnIcon,
  openSignup = false,
  onOpenSignup,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (openSignup && onOpenSignup) {
      onOpenSignup(); // OPEN SIGNUP MODAL
    } else if (redirect) {
      router.push(redirect); // NORMAL REDIRECT
    }
  };

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 border-2 cursor-pointer py-2.5 gap-2 ${borderHover}`}
      onClick={handleClick}
    >
      <CardHeader className="text-center pb-4">
        <div
          className={`mx-auto mb-1.5 p-3 rounded-full w-16 h-16 flex items-center justify-center transition-colors ${iconBg}`}
        >
          {icon && (
            <Image
              src={icon}
              alt={typeof title === "string" ? title : "service-icon"}
              width={40}
              height={40}
              className={`object-contain ${iconColor}`}
            />
          )}
        </div>

        <CardTitle className="text-lg text-gray-900 ">{title}</CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>

      {/* Make card content flex column */}
      <CardContent className="flex flex-col h-full">
        {/* FEATURES take remaining height */}
        <div className="space-y-4 flex-1">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* BUTTON always at bottom */}
        {BtnIcon && (
          <Button className={`w-full mt-4 ${buttonColor}`}>
            Learn More
            <BtnIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
