import { useTranslation } from "react-i18next";

import DeletionModal from "@components/DeletionModal";
import PageTitle from "@components/PageTitle";
import PrimaryTable from "@components/PrimaryTable";
import { PromoEditModal } from "@components/PromoEditModal";

import { useTablesSchemaContext } from "@contexts/TablesSchemaContext";

import { usePromoDeletion } from "@hooks/usePromoDeletion";
import { usePromoModal } from "@hooks/usePromoModal";

import { PromoType } from "@lib/types";

const QUERY_URL = "/promo-list";

export default function AddPage() {
  const { t } = useTranslation("promo");
  const { addsTableSchema } = useTablesSchemaContext();
  const { promoState, isOpen, close, initialPromo, onEditPromo } = usePromoModal(PromoType.ADD);
  const revalidationUrl = `${QUERY_URL}?take=10&skip=0&type=${PromoType.ADD}`;
  const { isDeletionOpen, onCloseDeletion, onOpenDeletion, onDeletePromo } =
    usePromoDeletion(revalidationUrl);

  return (
    <>
      <PageTitle title={t("ads")} />
      <PrimaryTable
        url={QUERY_URL}
        filters={{ type: PromoType.ADD }}
        columns={addsTableSchema}
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
        title={t("deletionTitle")}
        description={t("deletionDescription")}
        isOpen={isDeletionOpen}
        onClose={onCloseDeletion}
        onSubmit={onDeletePromo}
      />
    </>
  );
}
