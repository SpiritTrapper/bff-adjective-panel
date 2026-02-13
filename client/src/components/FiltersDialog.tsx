import type { ReactNode } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";

import { cleanDeepObject } from "@lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FieldValues) => void;
  onDrop: () => void;
  children: ReactNode;
  description?: string;
}

export default function FiltersDialog({ isOpen, onClose, children, onSubmit, onDrop, description }: Props) {
  const { t } = useTranslation("common");
  const form = useForm();

  const onSubmitForm = (values: FieldValues) => {
    const dirtyValues = cleanDeepObject(values);
    onSubmit(dirtyValues);
    onClose();
  };

  const onDropFilters = () => {
    form.reset();
    onDrop();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Form {...form}>
        <SheetContent>
          <SheetHeader className="pb-1">
            <SheetTitle>{t("filters")}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 w-full px-4">{children}</div>
          <SheetFooter className="w-full justify-between">
            <Button
              variant="outline"
              onClick={form.handleSubmit(onSubmitForm)}
              className="border-indigo-500 text-indigo-600 hover:border-indigo-500 hover:text-white hover:bg-indigo-500"
            >
              {t("confirm")}
            </Button>
            <Button variant="outline" onClick={onDropFilters}>
              {t("resetFilters")}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Form>
    </Sheet>
  );
}
