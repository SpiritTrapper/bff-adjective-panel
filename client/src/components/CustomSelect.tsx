import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FieldLabel from "@components/FieldLabel";
import { FormItem, FormMessage } from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import type { SelectOption } from "@lib/types";

interface Props {
  name: string;
  items: readonly SelectOption[];
  label?: string;
  className?: string;
  required?: boolean;
  error?: string;
  id?: string;
  defaultValue?: string;
}

export default function CustomSelect({
  name,
  items,
  label,
  className,
  required,
  error,
  defaultValue,
}: Props) {
  const { t } = useTranslation("validation");
  const { setValue, clearErrors } = useFormContext();

  const onSubmit = (value: string) => {
    setValue(name, value);
    clearErrors(name);
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue, { shouldDirty: true });
    }
  }, [defaultValue]); // eslint-disable-line

  return (
    <FormItem>
      <FieldLabel label={label} required={required} />
      <Select onValueChange={onSubmit} defaultValue={defaultValue}>
        <SelectTrigger size="sm" className={`w-full ${className} ${error ? "border-red-600" : ""}`}>
          <SelectValue placeholder={t("selectValue")} />
        </SelectTrigger>
        <SelectContent>
          {items?.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!!error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
