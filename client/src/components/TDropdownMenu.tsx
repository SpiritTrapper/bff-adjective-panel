import { Fragment } from "react";

import { EllipsisVertical } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

interface Props {
  label: string;
  items: {
    title: string;
    action: () => void;
    isDelete?: boolean;
  }[];
}

export default function TDropdownMenu({ label, items }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <EllipsisVertical />
          <span className="sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {items.map((item) =>
          item.isDelete ? (
            <Fragment key={item.title}>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={item.action}
              >
                {item.title}
              </DropdownMenuItem>
            </Fragment>
          ) : (
            <DropdownMenuItem key={item.title} className="cursor-pointer" onClick={item.action}>
              {item.title}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
