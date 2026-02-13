"use client";

import * as React from "react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ChevronDownIcon } from "lucide-react";

import FieldLabel from "@components/FieldLabel";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { FormMessage } from "@components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  startDate?: Date;
  defaultValue?: Date;
}

export function DatePicker({ name, label, required, error, startDate, defaultValue }: Props) {
  const { t, i18n } = useTranslation("validation");
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const { setValue, clearErrors } = useFormContext();

  const locale = i18n.language === "ru" ? "ru" : "en-US";

  const onSelectDate = (date?: Date) => {
    if (date) {
      setDate(date);
      setValue(name, date, { shouldDirty: true });
      clearErrors(name);
    }

    setOpen(false);
  };

  const checkIfDisabled = (date: Date) => {
    const currentTime = new Date(date).getTime();

    if (startDate) {
      return currentTime < new Date(startDate).getTime();
    }

    return currentTime < new Date().setHours(0, 0, 0, 0);
  };

  useEffect(() => {
    if (defaultValue) {
      setDate(defaultValue);
      setValue(name, defaultValue);
    }
  }, [defaultValue]); // eslint-disable-line

  return (
    <div className="flex flex-col gap-3">
      <FieldLabel label={label} required={required} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={`w-63 justify-between font-normal ${error ? "border-red-600" : ""}`}
          >
            {date ? date.toLocaleDateString(locale) : t("selectDate")}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={onSelectDate}
            disabled={checkIfDisabled}
          />
        </PopoverContent>
      </Popover>
      {!!error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}
