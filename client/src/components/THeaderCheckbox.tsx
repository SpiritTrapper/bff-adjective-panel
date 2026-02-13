import type { Table } from "@tanstack/react-table";

import { Checkbox } from "@components/ui/checkbox";

interface Props<TData> {
  table: Table<TData>;
}

export default function THeaderCheckbox<TData>({ table }: Props<TData>) {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}
