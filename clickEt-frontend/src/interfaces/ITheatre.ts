// Define interfaces for the theatre data structure

// Interface for a single contact point within a theatre
interface TheatreContact {
  location: string;
  phoneNumbers: {
    type: string;
    number: string;
  }[];
  emails: {
    type: string;
    email: string;
  }[];
}

// Interface for a single location within a theatre
interface TheatreLocation {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Interface for the commission rate within a theatre
interface TheatreCommissionRate {
  address: string;
  rate: number;
}

// Interface for a theatre entity
export interface Theatre {
  _id: string;
  name: string;
  locations: TheatreLocation[];
  commissionRate: TheatreCommissionRate[];
  contacts: TheatreContact[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface for the API response containing an array of theatres
export interface TheatresResponse {
  theatres: Theatre[];
}