import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import * as yup from "yup";

import ColorPicker from "@components/ColorPicker";
import CustomSelect from "@components/CustomSelect";
import CustomTabs from "@components/CustomTabs";
import { DatePicker } from "@components/DatePicker";
import DialogPreloadingBlock from "@components/DialogPreloadingBlock";
import FileUpload from "@components/FileUpload";
import TextArea from "@components/TextArea";
import TextInput from "@components/TextInput";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Form } from "@components/ui/form";

import { useMutation } from "@hooks/useMutation";

import { getLocationItems, getStatusItems } from "@lib/constants";
import { PromoStory, PromoType } from "@lib/types";
import { createFormData, sendSWRMultipart, sendSWRMutation, setPromoTitle } from "@lib/utils";

interface CbResponse {
  id: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  revalidationUrl: string;
  id?: number;
  type?: PromoType;
  name?: string;
  initialPromo?: Partial<PromoStory>;
}

export function PromoEditModal({
  id,
  type,
  name,
  isOpen,
  onClose,
  revalidationUrl,
  initialPromo,
}: Props) {
  const { t } = useTranslation(["promo", "common", "validation"]);
  const { mutate } = useSWRConfig();

  const requiredMsg = t("validation:required");

  const formSchema = yup.object().shape({
    name: yup.string().required(requiredMsg),
    description: yup.string().required(requiredMsg),
    priority: yup.number().required(requiredMsg),
    publishBefore: yup.date().required(requiredMsg),
    publishAfter: yup.date().required(requiredMsg),
    externalUrl: yup.string().required(requiredMsg),
    location: yup.string().required(requiredMsg),
    status: yup.string().required(requiredMsg),
    type: yup.string().required(requiredMsg),
    backgroundColor: yup.string(),
    image: yup.mixed(),
    imageRotate: yup.string(),
  });

  const IMAGE_ROTATE_ITEMS = [
    { label: t("promo:normal"), value: "false" },
    { label: t("promo:reversed"), value: "true" },
  ];

  const { trigger: uploadPromoImage, isMutating: isImageMutating } = useMutation(
    "/api/upload-promo-image",
    sendSWRMultipart,
  );
  const { trigger: createNewPromo, isMutating: isPromoCreating } = useMutation<CbResponse, object>(
    "/create-promo",
    sendSWRMutation,
  );
  const { trigger: updatePromo, isMutating: isPromoUpdating } = useMutation(
    "/update-promo",
    (url, opts) => sendSWRMutation(url, opts, true),
  );

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: -1,
      externalUrl: "",
      imageRotate: "false",
      location: "",
      type: "",
      status: "",
    },
    progressive: true,
  });

  const {
    watch,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  const startDate = watch("publishBefore");
  const isLoading = isImageMutating || isPromoCreating || isPromoUpdating;

  const onSubmit = async ({ image, ...values }: FieldValues) => {
    if (!id) {
      return;
    }

    try {
      const queryArgs = {
        ...values,
        promotedId: +id,
        publishBefore: values.publishBefore
          ? new Date(values.publishBefore as string).toJSON()
          : undefined,
        publishAfter: values.publishAfter
          ? new Date(values.publishAfter as string).toJSON()
          : undefined,
        imageRotate: values.imageRotate === "true",
      };

      if (initialPromo) {
        await updatePromo(queryArgs);

        if (id && image) {
          const fd = createFormData(image, id.toString());
          await uploadPromoImage(fd);
        }

        toast.success(t("promo:promoUpdatedSuccess"));
      } else {
        const { id: promoId } = await createNewPromo(queryArgs);

        if (promoId && image) {
          const fd = createFormData(image, promoId);
          await uploadPromoImage(fd);
        }

        toast.success(t("promo:promoCreatedSuccess"));
      }

      await mutate(revalidationUrl, undefined, { revalidate: true });
    } catch (e) {
      console.error(e);
      toast.error(t("common:serverError"));
    } finally {
      reset();
      onClose();
    }
  };

  const onCloseModal = () => {
    onClose();
    reset();
  };

  const publishBeforeDefault = initialPromo?.publishBefore
    ? new Date(initialPromo.publishBefore)
    : undefined;

  const publishAfterDefault = initialPromo?.publishAfter
    ? new Date(initialPromo.publishAfter)
    : undefined;

  useEffect(() => {
    if (!initialPromo) {
      if (name?.length) {
        setValue("name", name);
      }
    }

    if (type?.length) {
      setValue("type", type);
    }

    clearErrors();
  }, [name, type, initialPromo]); // eslint-disable-line

  if (!id || !type) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      {isLoading ? (
        <DialogPreloadingBlock />
      ) : (
        <Form {...form}>
          <DialogContent className="lg:min-w-[60vw] md:min-w-[80vw] w-full">
            <DialogHeader className="p-6 border-b border-b-gray-300 gap-0">
              <DialogTitle>{setPromoTitle(type, !!initialPromo, t)}</DialogTitle>
              <DialogDescription className="h-0" />
            </DialogHeader>
            <div className="flex flex-col gap-8 p-6 pt-3 max-h-[60vh] overflow-y-auto">
              <TextInput
                name="name"
                label={t("promo:name")}
                placeholder={t("promo:promoNamePlaceholder")}
                error={errors.name?.message}
                defaultValue={initialPromo?.name}
                required
              />
              <TextArea
                name="description"
                label={t("promo:description")}
                placeholder={t("promo:descriptionPlaceholder")}
                className="min-h-32"
                error={errors.description?.message}
                defaultValue={initialPromo?.description}
                rows={6}
                required
              />
              <TextInput
                name="externalUrl"
                label={t("promo:pageLink")}
                placeholder={t("promo:pageLinkPlaceholder")}
                error={errors.externalUrl?.message}
                defaultValue={initialPromo?.externalUrl}
                required
              />
              <div className="flex flex-row gap-6 flex-wrap">
                <TextInput
                  type="number"
                  name="priority"
                  label={t("promo:priority")}
                  error={errors.priority?.message}
                  className="max-w-20"
                  required
                />
                <DatePicker
                  name="publishBefore"
                  label={t("promo:showStartDate")}
                  error={errors.publishBefore?.message}
                  defaultValue={publishBeforeDefault}
                  required
                />
                <DatePicker
                  name="publishAfter"
                  label={t("promo:showEndDate")}
                  error={errors.publishAfter?.message}
                  defaultValue={publishAfterDefault}
                  startDate={startDate}
                  required
                />
              </div>
              <div className="flex flex-row gap-8 items-start flex-wrap lg:flex-nowrap">
                <ColorPicker
                  name="backgroundColor"
                  defaultValue={initialPromo?.backgroundColor}
                  label={t("promo:backgroundColor")}
                />
                <FileUpload
                  name="image"
                  label={t("promo:promoImage")}
                  defaultValue={initialPromo?.image}
                />
              </div>
              <div className="flex flex-row gap-8 items-start flex-wrap">
                <CustomTabs
                  name="imageRotate"
                  defaultValue={initialPromo?.imageRotate?.toString()}
                  label={t("promo:contentLayoutType")}
                  items={IMAGE_ROTATE_ITEMS}
                />
                <CustomSelect
                  name="location"
                  label={t("promo:location")}
                  items={getLocationItems()}
                  className="w-65"
                  error={errors.location?.message}
                  defaultValue={initialPromo?.location}
                  required
                />
                <CustomSelect
                  name="status"
                  label={t("promo:promoStatus")}
                  items={getStatusItems()}
                  className="w-65"
                  defaultValue={initialPromo?.status}
                  error={errors.status?.message}
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex lg:flex-row lg:gap-4 lg:justify-end md:flex-col sm:flex-col flex-col gap-3 justify-start p-6 border-t border-t-gray-300">
              <Button
                variant="secondary"
                className="lg:w-48 sm:w-full w-full"
                onClick={onCloseModal}
              >
                {t("common:back")}
              </Button>
              <Button className="lg:w-48 sm:w-full w-full" onClick={handleSubmit(onSubmit)}>
                {t("common:save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Form>
      )}
    </Dialog>
  );
}
