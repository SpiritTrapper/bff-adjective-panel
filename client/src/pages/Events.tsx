import { useTranslation } from "react-i18next";

import useSWR from "swr";

import CustomSelect from "@components/CustomSelect";
import CustomTabs from "@components/CustomTabs";
import DateRangePicker from "@components/DateRangePicker";
import FiltersDialog from "@components/FiltersDialog";
import PageTitle from "@components/PageTitle";
import PrimaryTable from "@components/PrimaryTable";
import { PromoEditModal } from "@components/PromoEditModal";
import TextInput from "@components/TextInput";

import { useTablesSchemaContext } from "@contexts/TablesSchemaContext";

import { usePageFilters } from "@hooks/usePageFilters";
import { usePromoModal } from "@hooks/usePromoModal";

import { NewEventType, PromoType } from "@lib/types";
import { parseEventsTypes, swrFetcher } from "@lib/utils";

const QUERY_URL = "/get-events";

export default function EventsPage() {
  const { t } = useTranslation(["events", "common"]);
  const { eventsTableSchema } = useTablesSchemaContext();
  const { filters, onSubmitFilters, onDropFilters, areFiltersOpen, openFilters, onCloseFilters } =
    usePageFilters();
  const { isOpen, promoState, close, onMakePromo } = usePromoModal(PromoType.EVENT);
  const { data: complexity } = useSWR<NewEventType[]>("/get-complexity", swrFetcher);
  const { data: themes } = useSWR<NewEventType[]>("/get-themes", swrFetcher);
  const { data: types } = useSWR<Record<string, NewEventType[]>>("/get-types", swrFetcher);

  const FORMAT_ITEMS = [
    { label: t("events:online"), value: "online" },
    { label: t("events:offline"), value: "offline" },
  ];

  const ACTIVE_ITEMS = [
    { label: t("common:yes"), value: "true" },
    { label: t("common:no"), value: "false" },
  ];

  const complexityFilters = complexity
    ? complexity.map((item: NewEventType) => ({
        title: item.name,
        value: item.name,
      }))
    : [];
  const themesFilters = themes
    ? themes.map((item) => ({ title: item.description, value: item.name }))
    : [];
  const typesFilters = parseEventsTypes(types, t);
  const revalidationUrl = `/promo-list?take=10&skip=0&type=${PromoType.EVENT}`;

  return (
    <>
      <PageTitle title={t("events:title")} onFilter={openFilters} />
      <PrimaryTable
        url={QUERY_URL}
        filters={filters}
        columns={eventsTableSchema}
        onMakePromo={onMakePromo}
      />
      <PromoEditModal
        {...promoState}
        isOpen={isOpen}
        onClose={close}
        revalidationUrl={revalidationUrl}
      />
      <FiltersDialog
        isOpen={areFiltersOpen}
        onSubmit={onSubmitFilters}
        onClose={onCloseFilters}
        onDrop={onDropFilters}
        description={t("events:filterDescription")}
      >
        <TextInput name="name" label={t("events:eventName")} placeholder={t("events:eventNamePlaceholder")} />
        <CustomTabs name="format" label={t("events:eventFormat")} items={FORMAT_ITEMS} />
        <CustomTabs name="active" label={t("events:eventActive")} items={ACTIVE_ITEMS} />
        <TextInput name="place" label={t("events:eventLocation")} placeholder={t("events:eventLocationPlaceholder")} />
        <TextInput name="organizer" label={t("events:eventOrganizer")} placeholder={t("events:eventOrganizerPlaceholder")} />
        <CustomSelect name="complexity" label={t("events:participantLevel")} items={complexityFilters} />
        <CustomSelect name="theme" label={t("events:eventTheme")} items={themesFilters} />
        <CustomSelect name="type" label={t("events:eventType")} items={typesFilters} />
        <DateRangePicker label={t("events:dateRange")} />
      </FiltersDialog>
    </>
  );
}
