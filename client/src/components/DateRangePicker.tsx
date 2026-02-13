import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { FormItem, FormLabel } from "@components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";

interface Props {
  label?: string;
}

export default function DateRangePicker({ label }: Props) {
  const { t, i18n } = useTranslation("validation");
  const [range, setRange] = useState<DateRange>();
  const { setValue } = useFormContext();

  const locale = i18n.language === "ru" ? "ru" : "en-US";

  const currentRange =
    range?.from && range?.to
      ? `${range.from.toLocaleDateString(locale)} - ${range.to.toLocaleDateString(locale)}`
      : t("selectDates");

  const onSelectRange = (newRange?: DateRange) => {
    setRange(newRange);
    setValue("dateFrom", newRange?.from);
    setValue("dateTo", newRange?.to);
  };

  return (
    <FormItem>
      {!!label && <FormLabel className="px-1">{label}</FormLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" id="dates" className="w-full justify-between font-normal">
            {currentRange}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            captionLayout="dropdown"
            onSelect={onSelectRange}
          />
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
