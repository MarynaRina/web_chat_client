// src/types/routes.ts
import { ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  element: ReactNode; 
  protected?: boolean;
}