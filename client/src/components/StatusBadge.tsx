import { useTranslation } from "react-i18next";

import { CircleCheck, CircleX, Loader } from "lucide-react";

import { Badge } from "@components/ui/badge";

import type { EventStatusModel } from "@lib/types.ts";

interface Props {
  status: Partial<EventStatusModel>;
}

export default function StatusBadge({ status }: Props) {
  const { t } = useTranslation("tables");

  switch (status?.name) {
    case "published":
      return (
        <Badge variant="outline" className="font-normal text-green-500 px-1.5">
          <CircleCheck className="fill-green-500 border-green-500 stroke-white" />
          {t("published")}
        </Badge>
      );
    case "banned":
      return (
        <Badge variant="outline" className="font-normal text-red-500 px-1.5">
          <CircleX className="fill-red-500 border-red-500 stroke-white" />
          {t("banned")}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground font-normal px-1.5">
          <Loader />
          {t("unknown")}
        </Badge>
      );
  }
}
