export interface Address {
  city: string;
  country: string;
  crossStreet: string;
  full: string;
  postalCode: string;
  state: string;
  streetName: string;
  streetNumber: number;
  streetNumberText: string;
  unit: string;
}

export interface Geo {
  lat: number;
  lng: number;
  directions: string;
  marketArea: string;
}

export interface Tax {
  id: string;
  taxYear: number;
  taxAnnualAmount: number;
}

export interface School {
  name: string;
  district: string;
}

export interface Agent {
  firstName: string;
  lastName: string;
  contact: {
    email: string;
    office: string;
    cell: string;
  };
}

export interface Office {
  name: string;
  contact: {
    email: string;
    office: string;
    cell: string;
  };
  servingName: string;
  brokerid: string;
}

export interface MlsInfo {
  status: string;
  area: string;
  daysOnMarket: number;
  originalEntryTimestamp: string;
  originatingSystemName: string;
  statusText: string;
  areaMinor: string;
}

export interface Property {
  mlsId: number;
  address: Address;
  agents: Agent[];
  association: {
    fee: number;
    name: string;
    amenities: string;
  };
  coAgent: Agent | null;
  disclaimer: string;
  geo: Geo;
  leaseTerm: string | null;
  leaseType: string | null;
  listDate: string;
  listPrice: number;
  listingId: string;
  mls: MlsInfo;
  modified: string;
  office: Office;
  photos: string[];
  property: {
    accessibilityFeatures: string | null;
    additionalRooms: string;
    area: number;
    areaSource: string;
    bathsFull: number;
    bathsHalf: number;
    bedrooms: number;
    construction: string;
    cooling: string;
    exteriorFeatures: string;
    fireplaces: number;
    flooring: string;
    foundation: string;
    garageSpaces: number;
    heating: string;
    interiorFeatures: string;
    laundryFeatures: string;
    lotDescription: string;
    lotSize: string;
    lotSizeArea: number;
    lotSizeAreaUnits: string;
    occupantName: string;
    occupantType: string;
    parking: {
      description: string;
      spaces: number;
    };
    pool: string;
    roof: string;
    stories: number;
    style: string;
    subdivision: string;
    type: string;
    view: string;
    water: string;
    yearBuilt: number;
  };
  remarks: string;
  sales: {
    agent: Agent | null;
    closeDate: string | null;
    closePrice: number;
    contractDate: string | null;
    office: Office | null;
  };
  school: School;
  showingInstructions: string;
  specialListingConditions: string;
  tax: Tax;
  virtualTourUrl: string;
}

export interface SearchParams {
  q?: string;
  status?: string;
  type?: string;
  minprice?: number;
  maxprice?: number;
  minbeds?: number;
  maxbeds?: number;
  minbaths?: number;
  maxbaths?: number;
  limit?: number;
  lastId?: number;
  offset?: number;
}

export interface OpenHouse {
  openHouseId: string;
  listing: Property;
  startDatetime: string;
  endDatetime: string;
  description: string;
}
