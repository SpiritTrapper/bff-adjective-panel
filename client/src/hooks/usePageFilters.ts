import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useElementOpen } from "@hooks/useElementOpen";

export const usePageFilters = (initialFilters?: FieldValues) => {
  const {
    isOpen: areFiltersOpen,
    open: openFilters,
    close: onCloseFilters,
  } = useElementOpen(false);
  const [filters, setFilters] = useState<FieldValues | undefined>(initialFilters);

  const onSubmitFilters = (values: FieldValues) => {
    setFilters(values);
    onCloseFilters();
  };

  const onDropFilters = () => {
    setFilters(undefined);
  };

  return { filters, onSubmitFilters, onDropFilters, areFiltersOpen, openFilters, onCloseFilters };
};
