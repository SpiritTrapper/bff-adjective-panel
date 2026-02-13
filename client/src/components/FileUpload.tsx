import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ImageUp, Paperclip, Trash } from "lucide-react";

import { Button } from "@components/ui/button";
import { FormLabel } from "@components/ui/form";

import { PromoImage } from "@lib/types";

interface Props {
  label: string;
  name: string;
  description?: string;
  errorMessage?: string;
  className?: string;
  defaultValue?: PromoImage;
}

export default function FileUpload({
  label,
  name,
  description,
  errorMessage,
  className,
  defaultValue,
}: Props) {
  const { t } = useTranslation("validation");
  const { control, setValue } = useFormContext();
  const [fileName, setFileName] = useState<string>();
  const [image, setImage] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  const clearFiles = () => {
    setFileName("");
    setValue(name, "");
  };

  const setFormData = (file?: File) => {
    if (file) {
      const formData = new FormData();
      const imageUrl = URL.createObjectURL(file);
      formData.append("file", file);
      setFileName(file.name);
      setImage(imageUrl);
      setValue(name, formData);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    setFormData(file);
  };

  useEffect(() => {
    if (defaultValue) {
      setFileName(defaultValue.originalName);
      setImage(defaultValue.url);
    }
  }, [defaultValue]);

  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  if (fileName) {
    return (
      <div className={`relative flex flex-col gap-2 duration-200 ease-linear ${className}`}>
        {!!label && <FormLabel>{label}</FormLabel>}
        <div className="flex items-center gap-2">
          <div className="flex gap-2 mt-1" onClick={handleInputClick}>
            <Paperclip />
            <span>{fileName}</span>
          </div>
          <Button variant="link" type="button" className="text-gray-900" onClick={clearFiles}>
            <Trash />
          </Button>
        </div>
        {!!image && (
          <img
            src={image}
            width={155}
            height={155}
            className="rounded-sm"
            alt="promo image"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col gap-2 duration-200 ease-linear ${className}`}>
      {!!label && <FormLabel>{label}</FormLabel>}
      <div
        className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
        onClick={handleInputClick}
        onDrop={handleDrop}
      >
        <div className="flex items-center gap-1 py-3 px-6 border-none rounded-[4px]">
          <ImageUp />
          <span>{t("uploadFile")}</span>
        </div>
        <p>{t("uploadDescription")}</p>
        <p>{description || t("uploadHint")}</p>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              hidden
            />
          )}
        />
      </div>
      {!!errorMessage && <p className="text-red-600 my-2">{errorMessage}</p>}
    </div>
  );
}
