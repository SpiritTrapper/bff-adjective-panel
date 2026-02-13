import { useTranslation } from "react-i18next";

import { BadgeX } from "lucide-react";

import DialogPreloadingBlock from "@components/DialogPreloadingBlock";
import { Button } from "@components/ui/button";
import { Dialog, DialogDescription, DialogFooter, DialogTitle } from "@components/ui/dialog";
import { DialogContent } from "@components/ui/dialog";

interface Props {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function DeletionModal({
  title,
  description,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: Props) {
  const { t } = useTranslation("common");

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      {isLoading ? (
        <DialogPreloadingBlock />
      ) : (
        <DialogContent className="flex flex-col items-center justify-between">
          <DialogTitle className="pt-6 text-center">{title}</DialogTitle>
          <DialogDescription className="h-0" />
          <BadgeX size={72} className="stroke-red-500" />
          <p className="text-center px-6 leading-6">{description}</p>
          <DialogFooter className="flex lg:flex-row lg:gap-4 lg:justify-center md:flex-col sm:flex-col flex-col gap-3 justify-center w-full p-6">
            <Button variant="secondary" className="lg:w-48 sm:w-full w-full" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              className="lg:w-48 sm:w-full w-full"
              onClick={() => {
                onSubmit();
                onClose();
              }}
            >
              {t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
