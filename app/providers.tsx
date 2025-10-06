"use client";
import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextUIProvider>
      <NextTopLoader
        color="#FF7101"
        height={5}
        zIndex={1000000}
        showSpinner={false}
      />
      <Toaster />
      {children}
    </NextUIProvider>
  );
}
