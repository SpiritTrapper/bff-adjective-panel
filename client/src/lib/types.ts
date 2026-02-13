import type { IconName } from "lucide-react/dynamic";

export enum AppRoutes {
  EVENTS = "/events",
  NEWS = "/news",
  ADD = "/add",
  PROMO = "/promo",
  SETTINGS = "/settings",
  LOGIN = "/login",
}

export type FormValues = Record<string, FormDataEntryValue>;

export interface UserFromToken {
  id: number;
  email: string;
  role: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatar: string;
    grade: string;
    domain: string;
  };
  organizer?: {
    name: string;
    logo: string;
  };
  iat: string;
  exp: string;
}

export interface TokensRefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface LogInResponse extends TokensRefreshResponse {
  user: UserFromToken;
  authenticated: boolean;
}

export interface MenuItem {
  title: string;
  url: string;
  icon?: IconName;
  items?: MenuItem[];
  isActive?: boolean;
}

export interface EventStatusModel {
  id: number;
  name: string;
  description: string;
  hasChanges: boolean;
}

export interface EventLocation {
  id: number;
  eventGeolocation?: {
    id: number;
    city: string;
    country: string;
    region: string;
    latitude: string;
    longitude: string;
    isExternal: boolean;
  };
  eventPlatform?: {
    id: number;
    title: string;
    address: string;
    latitude: string;
    logitude: string;
    url?: string;
  };
  raw?: string;
}

export interface CurrentEventTheme {
  name: string;
  description: string;
}

export interface EventData {
  id: number;
  slug: string;
  name: string;
  date: string;
  link: string;
  active: boolean;
  isLiked: boolean;
  eventDescription: {
    id?: number;
    short: string;
    full: string;
  };
  eventType: {
    id: number;
    name: string;
  };
  eventComplexity: {
    id: number;
    name: string;
    description: string;
  }[];
  eventFormat: {
    id: number;
    name: string;
  };
  eventImage?: {
    name: string;
    url: string;
  };
  eventDate: {
    id: number;
    showStart: string;
    showEnd: string;
    registrationStart: string;
    registrationEnd: string;
  };
  eventStatus: EventStatusModel;
  eventLocation: EventLocation;
  eventPayment: {
    base: number;
    high?: string;
    low?: string;
    isProgressive?: boolean;
    paymentLink?: string;
  };
  organizer: {
    name: string;
    id: number;
    url: string;
    description?: string;
    image?: string;
    imageL?: string;
    imageS?: string;
  };
  eventThemeTags: CurrentEventTheme[];
  eventSource: {
    id: number;
    name: string;
    url: string;
  };
  priority?: number;
  seats: {
    moderationRequired: boolean;
    total?: number;
    enrolled?: number;
  };
  moderation?: {
    id: number;
    rejectMessage: string;
    rejectReason: string;
  };
  promoState: {
    isPromoted: boolean;
  };
}

export interface NewsData {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  active: boolean;
  newsType: {
    id: number;
    name: string;
  };
  newsImage: {
    id: number;
    url: string;
    name: string;
  };
  newsStatus: {
    id: number;
    name: string;
  };
  promoState: {
    isPromoted: boolean;
  };
}

export interface ListResponse<E> {
  total: number;
  data: E[];
}

export interface NewEventType {
  name: string;
  tooltip: string;
  description: string;
}

export interface SelectOption {
  title: string;
  value: string;
}

export enum PromoLocation {
  ALL = "ALL",
  LIST = "LIST",
  STORY = "STORY",
}

export enum PromoStatus {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  DELETED = "DELETED",
  DRAFT = "DRAFT",
  DELAYED = "DELAYED",
}

export enum PromoType {
  ADD = "ADD",
  EVENT = "EVENT",
  NEWS = "NEWS",
}

export interface PromoContent {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: {
    name: string;
    description: string;
  }[];
}

export interface Promo {
  id: number;
  name: string;
  priority: number;
  location: PromoLocation;
  promotedId: number;
  status: PromoStatus;
  type: PromoType;
}

export interface PromoImage {
  url: string;
  name: string;
  originalName: string;
  size: number;
}

export interface PromoStory {
  id: number;
  name: string;
  description: string;
  externalUrl: string;
  imageRotate: boolean | string;
  backgroundColor: string;
  image: PromoImage;
  priority: number;
  publishAfter: string;
  publishBefore: string;
  location: PromoLocation;
  promotedId: number;
  promotedContent: PromoContent;
  status: PromoStatus;
  type: string;
}
