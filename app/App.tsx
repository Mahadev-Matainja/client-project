"use client";

import AuthProvider from "@/components/providers/auth-provider";
import { ReduxProvider } from "@/lib/providers";
import ClientLayout from "@/utils/ClientLayout";
import ErrorBoundary from "@/utils/ErrorBoundary";
import React from "react";

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default App;
