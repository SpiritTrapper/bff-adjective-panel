import i18n from "@i18n/index";

import { PromoLocation, PromoStatus, PromoType } from "@lib/types";

export const TABLE_PAGE_SIZE = 10;

export function getServerErrorMessage() {
  return i18n.t("common:serverError");
}

export function getRequiredFieldMessage() {
  return i18n.t("validation:required");
}

export const SERVER_ERROR_MESSAGE = "Something went wrong on the server. Please try again";

export const REQUIRED_FIELD_MESSAGE = "This field is required";

export function getLocationItems() {
  return [
    {
      title: i18n.t("promo:locationList"),
      value: PromoLocation.LIST,
    },
    {
      title: i18n.t("promo:locationStory"),
      value: PromoLocation.STORY,
    },
    {
      title: i18n.t("promo:locationAll"),
      value: PromoLocation.ALL,
    },
  ];
}

export function getTypeItems() {
  return [
    {
      title: i18n.t("promo:typeEvent"),
      value: PromoType.EVENT,
    },
    {
      title: i18n.t("promo:typeNews"),
      value: PromoType.NEWS,
    },
    {
      title: i18n.t("promo:typeAd"),
      value: PromoType.ADD,
    },
  ];
}

export function getStatusItems() {
  return [
    {
      title: i18n.t("promo:statusDraft"),
      value: PromoStatus.DRAFT,
    },
    {
      title: i18n.t("promo:statusActive"),
      value: PromoStatus.ACTIVE,
    },
    {
      title: i18n.t("promo:statusFinished"),
      value: PromoStatus.FINISHED,
    },
    {
      title: i18n.t("promo:statusDeleted"),
      value: PromoStatus.DELETED,
    },
    {
      title: i18n.t("promo:statusDelayed"),
      value: PromoStatus.DELAYED,
    },
  ];
}
