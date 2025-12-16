"use client";

import { toast } from "@/hooks/use-toast";
import { useRef, useState } from "react";

export type VerificationResponse = {
  success: boolean;
  token_type: string;
  access_token: string;
  expires_at: string;
};

export default function VerifyForm({ token }: { token: string }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Focus handling
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pin = otp.join("");
    if (pin.length < 4) return setMsg("Please enter all 4 digits");

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/dv/${encodeURIComponent(
          token
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
          cache: "no-store",
        }
      );

      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast({
          title: data?.message ?? "Invalid or expired token/pin",
        });
        // setMsg(data?.message ?? "Invalid or expired token/pin");
      } else {
        setMsg("Verified! Redirecting…");
        if (data) {
          localStorage.setItem("doctor_bearer", data.access_token);
          localStorage.setItem("doctor_pin", data.pin);
          localStorage.setItem("doctor_unique_key", data.unique_key);
        }
        window.location.href = `/doctor/reports/view`;
      }
    } catch (error: any) {
      toast({
        title: error.message,
      });

      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Enter 4-digit PIN
      </label>

      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading || !isOtpComplete}
        className={`cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg transition-colors ${
          loading || !isOtpComplete
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Verifying…" : "Verify"}
      </button>

      {msg && (
        <p
          className={`text-sm text-center ${
            msg.includes("Verified") ? "text-green-600" : "text-red-500"
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
