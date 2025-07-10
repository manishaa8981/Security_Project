// src/utils/lazyImporter.ts
import { lazy } from "react";

export const lazyImport = (componentLocation: string) => {
  const componentPath = `../${componentLocation}`;
  return lazy(() => import(componentPath).catch((error) => {
    console.error(`Failed to import component from ${componentPath}:`, error);
    throw error;
  }));
};




