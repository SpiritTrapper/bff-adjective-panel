import type { Row } from "@tanstack/react-table";

import { Checkbox } from "@components/ui/checkbox";

interface Props<RData> {
  row: Row<RData>;
}

export default function TRowCheckbox<RData>({ row }: Props<RData>) {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        className="cursor-pointer"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  );
}
