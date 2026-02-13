import { useEffect, useState } from "react";

import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

import { useElementOpen } from "@hooks/useElementOpen";

import { SERVER_ERROR_MESSAGE } from "@lib/constants";
import { Promo, PromoStory, PromoType } from "@lib/types";
import { fetchPromo } from "@lib/utils";

type PromoState = Pick<Promo, "id" | "type" | "name">;

interface ReturnType {
  isOpen: boolean;
  close: () => void;
  onMakePromo: (id: number, name: string) => void;
  onEditPromo: (id: number) => void;
  promoState: Partial<PromoState>;
  initialPromo?: PromoStory;
  isLoading?: boolean;
}

export const usePromoModal = (type: PromoType): ReturnType => {
  const [promoState, setPromoState] = useState<Partial<PromoState>>({});
  const [initialPromo, setInitialPromo] = useState<PromoStory>();
  const { isOpen, open, close } = useElementOpen(false);
  const {
    trigger: getCurrentPromo,
    data: currentPromo,
    isMutating: isReadLoading,
  } = useSWRMutation("/api/get-promo", fetchPromo);

  const onMakePromo = (id: number, name: string) => {
    setPromoState({ id, type, name });
    open();
  };

  const onEditPromo = async (id: number) => {
    setPromoState({ id, type });

    try {
      await getCurrentPromo(id);
      open();
    } catch (e) {
      console.error(e);
      toast.error(SERVER_ERROR_MESSAGE);
    }
  };

  useEffect(() => {
    if (currentPromo && Object.keys(currentPromo)?.length) {
      setInitialPromo(currentPromo);
    }
  }, [currentPromo]);

  return {
    isOpen,
    close,
    onMakePromo,
    onEditPromo,
    promoState,
    isLoading: isReadLoading,
    initialPromo,
  };
};
