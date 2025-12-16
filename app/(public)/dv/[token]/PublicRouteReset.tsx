// app/dv/[token]/PublicRouteReset.tsx
"use client";
import { useEffect } from "react";

export default function PublicRouteReset() {
  useEffect(() => {
    try {
      localStorage.removeItem("doctor_pin");
      sessionStorage.removeItem("doctor_pin");
      // any other client-only cleanup
    } catch {}
  }, []);
  return null;
}
