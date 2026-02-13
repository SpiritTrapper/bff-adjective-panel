import { useTranslation } from "react-i18next";

import CustomTabs from "@components/CustomTabs";
import FiltersDialog from "@components/FiltersDialog";
import PageTitle from "@components/PageTitle";
import PrimaryTable from "@components/PrimaryTable";
import { PromoEditModal } from "@components/PromoEditModal";
import TextInput from "@components/TextInput";

import { useTablesSchemaContext } from "@contexts/TablesSchemaContext";

import { usePageFilters } from "@hooks/usePageFilters";
import { usePromoModal } from "@hooks/usePromoModal";

import { PromoType } from "@lib/types";

const QUERY_URL = "/get-news";

export default function NewsPage() {
  const { t } = useTranslation(["news", "common"]);
  const { newsTableSchema } = useTablesSchemaContext();
  const { isOpen, promoState, close, onMakePromo } = usePromoModal(PromoType.NEWS);
  const { filters, onSubmitFilters, onDropFilters, areFiltersOpen, openFilters, onCloseFilters } =
    usePageFilters();
  const revalidationUrl = `/promo-list?take=10&skip=0&type=${PromoType.NEWS}`;

  const ACTIVE_ITEMS = [
    { label: t("common:yes"), value: "true" },
    { label: t("common:no"), value: "false" },
  ];

  return (
    <>
      <PageTitle title={t("news:title")} onFilter={openFilters} />
      <PrimaryTable
        url={QUERY_URL}
        filters={filters}
        columns={newsTableSchema}
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
        description={t("news:filterDescription")}
      >
        <TextInput name="name" label={t("news:newsName")} placeholder={t("news:newsNamePlaceholder")} />
        <CustomTabs name="active" label={t("news:newsActive")} items={ACTIVE_ITEMS} />
      </FiltersDialog>
    </>
  );
}
