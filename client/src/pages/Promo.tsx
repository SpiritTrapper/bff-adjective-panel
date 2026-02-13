import { useTranslation } from "react-i18next";

import type { ColumnDef } from "@tanstack/react-table";

import CustomSelect from "@components/CustomSelect";
import CustomTabs from "@components/CustomTabs";
import DeletionModal from "@components/DeletionModal";
import FiltersDialog from "@components/FiltersDialog";
import PageTitle from "@components/PageTitle";
import PrimaryTable from "@components/PrimaryTable";
import { PromoEditModal } from "@components/PromoEditModal";
import TextInput from "@components/TextInput";

import { useTablesSchemaContext } from "@contexts/TablesSchemaContext";

import { usePageFilters } from "@hooks/usePageFilters";
import { usePromoDeletion } from "@hooks/usePromoDeletion";
import { usePromoModal } from "@hooks/usePromoModal";

import { Promo, PromoType } from "@lib/types";

interface Props {
  promoType: PromoType;
  title: string;
}

const QUERY_URL = "/promo-list";

export default function PromoControlPage({ promoType, title }: Props) {
  const { t } = useTranslation(["promo", "common"]);
  const { promoTableSchema } = useTablesSchemaContext();
  const { filters, onSubmitFilters, onDropFilters, areFiltersOpen, openFilters, onCloseFilters } =
    usePageFilters({ type: promoType });
  const { promoState, isOpen, close, onEditPromo, initialPromo } = usePromoModal(promoType);
  const revalidationUrl = `${QUERY_URL}?take=10&skip=0&type=${promoType}`;
  const { isDeletionOpen, onCloseDeletion, onOpenDeletion, onDeletePromo } =
    usePromoDeletion(revalidationUrl);

  const promoStatusesTabs = [
    { title: t("promo:statusActive"), value: "ACTIVE" },
    { title: t("promo:statusDraft"), value: "DRAFT" },
    { title: t("promo:statusDelayed"), value: "DELAYED" },
    { title: t("promo:statusFinished"), value: "FINISHED" },
    { title: t("promo:statusDeleted"), value: "DELETED" },
  ];

  const promoTypesTabs = [
    { label: t("promo:tabAll"), value: "ALL" },
    { label: t("promo:tabList"), value: "LIST" },
    { label: t("promo:tabStory"), value: "STORY" },
  ];

  return (
    <>
      <PageTitle title={title} onFilter={openFilters} />
      <PrimaryTable
        url={QUERY_URL}
        filters={{ ...filters, type: promoType }}
        columns={promoTableSchema as ColumnDef<Promo>[]}
        onEdit={onEditPromo}
        onDelete={onOpenDeletion}
        isProtected
      />
      <PromoEditModal
        {...promoState}
        isOpen={isOpen}
        onClose={close}
        revalidationUrl={revalidationUrl}
        initialPromo={initialPromo}
      />
      <DeletionModal
        title={t("promo:deletionTitle")}
        description={t("promo:deletionDescription")}
        isOpen={isDeletionOpen}
        onClose={onCloseDeletion}
        onSubmit={onDeletePromo}
      />
      <FiltersDialog
        isOpen={areFiltersOpen}
        onSubmit={onSubmitFilters}
        onClose={onCloseFilters}
        onDrop={onDropFilters}
      >
        <TextInput name="name" label={t("promo:promoName")} placeholder={t("promo:promoNamePlaceholder")} />
        <CustomTabs name="location" label={t("promo:location")} items={promoTypesTabs} />
        <CustomSelect name="status" label={t("promo:status")} items={promoStatusesTabs} />
      </FiltersDialog>
    </>
  );
}
