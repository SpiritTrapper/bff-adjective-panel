import type { FieldValues } from "react-hook-form";

import { type ClassValue, clsx } from "clsx";
import type { TFunction } from "i18next";
import { twMerge } from "tailwind-merge";

import { proxyAPIGateway } from "@api/gateway";

import { ListResponse, NewEventType, PromoLocation, PromoStatus, PromoType } from "@lib/types";

import i18n from "@i18n/index";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function swrFetcher<T>(url: string): Promise<T> {
  const res = await proxyAPIGateway.get<T>(url);
  return res.data;
}

export async function fetchPromo(url: string, { arg }: { arg: number }) {
  const res = await proxyAPIGateway.get(`${url}?id=${arg}`);
  return res.data;
}

type MutationArg<T> = { arg: T };

export async function sendSWRMutation<TArg, TRes>(
  url: string,
  { arg }: MutationArg<TArg>,
  isUpdate = false,
) {
  const cb = isUpdate ? proxyAPIGateway.patch : proxyAPIGateway.post;
  const res = await cb<TRes>(url, arg);
  return res.data;
}

export async function sendSWRMultipart(url: string, { arg }: { arg: FormData }) {
  const isFD = typeof FormData !== "undefined" && arg instanceof FormData;

  if (!isFD) {
    return;
  }

  const res = await proxyAPIGateway.post(url, arg, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function swrDeleter(url: string) {
  return proxyAPIGateway.delete(url);
}

function shiftTimeByHours(dateString: string, hours: number) {
  const date = new Date(dateString);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

export function formatDate(
  dateString: string,
  hours: number,
  customOptions: Intl.DateTimeFormatOptions = {},
) {
  const shiftedStringDate = shiftTimeByHours(dateString, hours);
  const finalOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: "GMT",
    timeZoneName: "short",
    ...customOptions,
  };
  const date = new Date(shiftedStringDate);
  const locale = i18n.language === "ru" ? "ru-RU" : "en-US";
  return date.toLocaleString(locale, finalOptions).replace("UTC", "GMT+3");
}

export function cleanDeepObject(data: FieldValues): Record<string, unknown> {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== "")
    .reduce<Record<string, unknown>>((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
}

export function parseQueryFilters(filters?: Record<string, string | number | boolean>) {
  if (filters && Object.keys(filters).length) {
    const filtersArr = Object.keys(filters).reduce((acc, item) => {
      acc.push(`${item}=${filters[item]}`);
      return acc;
    }, [] as string[]);

    return `&${filtersArr.join("&")}`;
  }

  return "";
}

export function parseEventsTypes(types?: Record<string, NewEventType[]>, t?: TFunction) {
  return types
    ? Object.keys(types).map((type) => {
        let groupTitle;
        if (t) {
          switch (type) {
            case "tournament":
              groupTitle = t("eventTypes.tournament", { ns: "tables", defaultValue: "Competitive" });
              break;
            case "education":
              groupTitle = t("eventTypes.education", { ns: "tables", defaultValue: "Educational" });
              break;
            case "specialized":
              groupTitle = t("eventTypes.specialized", { ns: "tables", defaultValue: "Specialized" });
              break;
            case "smallOne":
              groupTitle = t("eventTypes.smallOne", { ns: "tables", defaultValue: "Small" });
              break;
            case "bigOne":
              groupTitle = t("eventTypes.bigOne", { ns: "tables", defaultValue: "Big" });
              break;
            default:
              groupTitle = "";
          }
        } else {
          switch (type) {
            case "tournament":
              groupTitle = "Competitive";
              break;
            case "education":
              groupTitle = "Educational";
              break;
            case "specialized":
              groupTitle = "Specialized";
              break;
            case "smallOne":
              groupTitle = "Small";
              break;
            case "bigOne":
              groupTitle = "Big";
              break;
            default:
              groupTitle = "";
          }
        }

        return { title: groupTitle, value: type };
      })
    : [];
}

export function sanitizeTags(description?: string) {
  return description?.replace(/<[^>]*>/g, "");
}

export function setPromoStatusLayout(status: PromoStatus) {
  switch (status) {
    case PromoStatus.ACTIVE:
      return "fill-green-500 border-green-500 text-green-500";
    case PromoStatus.FINISHED:
      return "fill-orange-500 border-orange-500 text-orange-500";
    case PromoStatus.DRAFT:
      return "fill-yellow-600 border-yellow-600 text-yellow-600";
    case PromoStatus.DELAYED:
      return "fill-indigo-500 border-indigo-500 text-indigo-500";
    case PromoStatus.DELETED:
      return "fill-red-500 border-red-500 text-red-500";
    default:
      return "fill-gray-500 border-gray-500 text-gray-500";
  }
}

export function setPromoLocationLayout(location: PromoLocation) {
  switch (location) {
    case PromoLocation.ALL:
      return "fill-indigo-500 border-indigo-500 text-indigo-500";
    case PromoLocation.LIST:
      return "fill-orange-500 border-orange-500 text-orange-500";
    case PromoLocation.STORY:
      return "fill-green-500 border-green-500 text-green-500";
    default:
      return "fill-gray-500 border-gray-500 text-gray-500";
  }
}

export function setPromoTitle(type: PromoType, isEdit?: boolean, t?: TFunction) {
  if (t) {
    const key = isEdit ? "edit" : "create";
    switch (type) {
      case PromoType.NEWS:
        return t(`promo:${key}PromoNews`);
      case PromoType.ADD:
        return t(`promo:${key}PromoAd`);
      case PromoType.EVENT:
        return t(`promo:${key}PromoEvent`);
      default:
        return t(`promo:${key}Promo`);
    }
  }

  const actionType = isEdit ? "Editing" : "Creating";
  const base = `${actionType} promo`;
  switch (type) {
    case PromoType.NEWS:
      return `${base} news:`;
    case PromoType.ADD:
      return `${base} ad`;
    case PromoType.EVENT:
      return `${base} event`;
    default:
      return base;
  }
}

export function checkIfIsFlat<TData>(newList?: TData[] | ListResponse<TData>): {
  total: number;
  data: TData[];
} {
  const isFlat = !!newList && !("data" in newList);
  const data = newList
    ? ((isFlat ? newList : (newList as ListResponse<TData>)?.data) as TData[])
    : [];
  const total = isFlat
    ? (newList as TData[])?.length
    : ((newList as ListResponse<TData>)?.total ?? 0);

  return {
    total,
    data,
  };
}

export function createFormData(image: FormData, promoId: string) {
  const fd = new FormData();
  const file = image.get("file");

  if (file) {
    fd.append("file", file);
    fd.append("promoId", promoId.toString());
  }

  return fd;
}
