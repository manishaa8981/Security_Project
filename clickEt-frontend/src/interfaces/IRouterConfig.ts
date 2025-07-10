import { ERoles } from "./auth/IAuthContext";

export enum ELayouts {
  CLIENT = "default",
  ADMIN = "admin",
  NA = "none",
}

export interface IRouterConfig {
  [page: string]: IRouterMeta;
}

export interface IRouterMeta {
  path: string;
  layout: ELayouts;
  isProtected: boolean;
  roles?: ERoles[];
  componentLocation:string;
}
