import { useState } from "react";
import { useTranslation } from "react-i18next";

import { toast } from "sonner";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { useElementOpen } from "@hooks/useElementOpen";

import { swrDeleter } from "@lib/utils";

interface ReturnType {
  isDeletionOpen: boolean;
  onCloseDeletion: () => void;
  onOpenDeletion: (id: number) => void;
  onDeletePromo: (id?: number) => void;
  isLoading?: boolean;
}

export const usePromoDeletion = (url: string): ReturnType => {
  const { t } = useTranslation(["promo", "common"]);
  const { mutate } = useSWRConfig();
  const [currentId, setCurrentId] = useState<number>();
  const {
    isOpen: isDeletionOpen,
    open: openDeletion,
    close: closeDeletion,
  } = useElementOpen(false);
  const { trigger: deletePromo, isMutating: isDeletionLoading } = useSWRMutation(
    `/delete-promo?id=${currentId}`,
    swrDeleter,
  );

  const onDeletePromo = async () => {
    try {
      await deletePromo();
      await mutate(url, undefined, { revalidate: true });
      toast.success(t("promo:promoDeletedSuccess"));
    } catch (e) {
      console.error(e);
      toast.error(t("common:serverError"));
    }
  };

  const onOpenDeletion = (id: number) => {
    setCurrentId(id);
    openDeletion();
  };

  const onCloseDeletion = () => {
    closeDeletion();
  };

  return {
    isDeletionOpen,
    onCloseDeletion,
    onOpenDeletion,
    onDeletePromo,
    isLoading: isDeletionLoading,
  };
};
