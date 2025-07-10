import { ImageUploadRequest } from "./auth/IImage";

// Coordinates used in a location
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// A location is either an HQ or a Branch
export interface Location {
  type: "HQ" | "Branch";
  location: string;
  coordinates: Coordinates;
}

// Phone number type. Note the optional _id field which appears only in responses.
export interface PhoneNumber {
  type: string;
  number: string;
  _id?: string;
}

// Email type with an optional _id for responses.
export interface Email {
  type: string;
  email: string;
  _id?: string;
}

// A contact includes a location, phone numbers, and emails.
export interface Contact {
  location: string;
  phoneNumbers: PhoneNumber[];
  emails: Email[];
}

// Distribution rights for a movie
export interface DistributionRight {
  movieId: string;
  commissionRate: number;
  territories: string[];
  validFrom: string;
  validUntil: string;
}

/**
 * Base interface for a distributor.
 * This interface is used for both requests and responses,
 * so that your request payload (e.g. AddDistributorRequest) doesn’t include
 * extra fields (like _id or timestamps) that you only expect from the server.
 */
export interface DistributorBase {
  name: string;
  logo_URL?: string;
  commissionRate: number;
  isActive: boolean;
  locations: Location[];
  contacts: Contact[];
  distributionRights?: DistributionRight[];
}

// =====================
// Request Interfaces
// =====================

/**
 * Request to add a distributor.
 * It reuses DistributorBase since no extra fields are needed.
 */


// =====================
// Response Interfaces
// =====================

/**
 * Distributor response type.
 * It extends DistributorBase and adds fields that the server attaches,
 * such as the unique identifier and timestamps.
 */
export interface DistributorResponse extends DistributorBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface AddDistributorResponse {
  Distributor: DistributorResponse;
  message: string;
}

export interface GetDistributorResponse {
  distributor: DistributorResponse[];
}

export interface DistributorLogoRequest extends ImageUploadRequest{
  distributorId:string;
}