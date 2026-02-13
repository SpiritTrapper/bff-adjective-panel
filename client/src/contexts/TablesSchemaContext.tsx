import { type FC, type ReactNode, createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@components/StatusBadge";
import { Badge } from "@components/ui/badge";

import { EventData, NewsData, Promo, PromoStory } from "@lib/types";
import { formatDate, sanitizeTags, setPromoLocationLayout, setPromoStatusLayout } from "@lib/utils";

interface Props {
  children: ReactNode;
}

interface TablesSchemaContextValues {
  eventsTableSchema: ColumnDef<EventData>[];
  newsTableSchema: ColumnDef<NewsData>[];
  addsTableSchema: ColumnDef<PromoStory>[];
  promoTableSchema: ColumnDef<Promo>[];
}

const defaultValues: TablesSchemaContextValues = {
  eventsTableSchema: [],
  newsTableSchema: [],
  addsTableSchema: [],
  promoTableSchema: [],
};

const TablesSchemaContext = createContext(defaultValues);

export const useTablesSchemaContext = () => useContext(TablesSchemaContext);

export const TablesSchemaContextProvider: FC<Props> = ({ children }) => {
  const { t } = useTranslation(["tables", "common"]);

  const contextValues = useMemo<TablesSchemaContextValues>(
    () => ({
      eventsTableSchema: [
        {
          accessorKey: "id",
          header: t("tables:id"),
        },
        {
          accessorKey: "name",
          header: t("tables:name"),
          cell: ({ row }) => (
            <p className="flex gap-2">
              <span>{row.original?.name}</span>
              {row.original.promoState?.isPromoted ? (
                <span className="border border-amber-700 rounded-sm px-2 text-amber-700">
                  {t("tables:promo")}
                </span>
              ) : null}
            </p>
          ),
        },
        {
          accessorKey: "eventDate",
          header: t("tables:eventStartDate"),
          cell: ({ row }) => (
            <p>{formatDate(row.original.eventDate?.showStart ?? row.original?.date, 3)}</p>
          ),
        },
        {
          accessorKey: "eventStatus",
          header: t("tables:eventStatus"),
          cell: ({ row }) => <StatusBadge status={row.original.eventStatus} />,
        },
        {
          accessorKey: "active",
          header: t("tables:active"),
          cell: ({ row }) => (
            <Badge
              variant="outline"
              className={`ml-3.5 font-normal px-1.5 ${row.original.active ? "fill-green-500 border-green-500 text-green-500" : "fill-red-500 border-red-500 text-red-500"}`}
            >
              {row.original.active ? t("common:yes") : t("common:no")}
            </Badge>
          ),
        },
      ] as ColumnDef<EventData>[],
      newsTableSchema: [
        {
          accessorKey: "id",
          header: t("tables:id"),
        },
        {
          accessorKey: "name",
          header: t("tables:name"),
        },
        {
          accessorKey: "newsStatus",
          header: t("tables:newsType"),
          cell: ({ row }) => (
            <Badge
              variant="outline"
              className={`font-normal px-1.5 ${
                row.original.newsStatus.name === "article"
                  ? "fill-amber-600 border-amber-600 text-amber-600"
                  : "fill-indigo-600 border-indigo-600 text-indigo-600"
              }`}
            >
              {row.original.newsStatus.name}
            </Badge>
          ),
        },
        {
          accessorKey: "createdAt",
          header: t("tables:publishDate"),
          cell: ({ row }) => <p>{formatDate(row.original.createdAt, 3)}</p>,
        },
        {
          accessorKey: "newsStatus.name",
          header: t("tables:statusLabel"),
          cell: ({ row }) => <StatusBadge status={row.original.newsStatus} />,
        },
      ] as ColumnDef<NewsData>[],
      addsTableSchema: [
        {
          accessorKey: "id",
          header: t("tables:id"),
        },
        {
          accessorKey: "promotedContent.name",
          header: t("tables:name"),
          cell: ({ row }) => {
            return row.original.promotedContent?.name;
          },
        },
        {
          accessorKey: "promotedContent.description",
          header: t("tables:descriptionLabel"),
          cell: ({ row }) => {
            return sanitizeTags(row.original.promotedContent?.description);
          },
        },
        {
          accessorKey: "priority",
          header: t("tables:priorityLabel"),
          cell: ({ row }) => (
            <div className="w-6 h-6 rounded-full bg-gray-500 text-amber-50 ml-6 text-center p-0 leading-6">
              {row.original.priority}
            </div>
          ),
        },
        {
          accessorKey: "status",
          header: t("tables:statusLabel"),
          cell: ({ row }) => (
            <Badge
              variant="outline"
              className={`font-normal px-1.5 ${setPromoStatusLayout(row.original.status)}`}
            >
              {row.original.status}
            </Badge>
          ),
        },
      ] as ColumnDef<PromoStory>[],
      promoTableSchema: [
        {
          accessorKey: "id",
          header: t("tables:id"),
        },
        {
          accessorKey: "name",
          header: t("tables:name"),
        },
        {
          accessorKey: "priority",
          header: t("tables:priorityLabel"),
          cell: ({ row }) => (
            <div className="w-6 h-6 rounded-full bg-gray-500 text-amber-50 ml-6 text-center p-0 leading-6">
              {row.original.priority}
            </div>
          ),
        },
        {
          accessorKey: "status",
          header: t("tables:statusLabel"),
          cell: ({ row }) => (
            <Badge
              variant="outline"
              className={`font-normal px-1.5 ${setPromoStatusLayout(row.original.status)}`}
            >
              {row.original.status}
            </Badge>
          ),
        },
        {
          accessorKey: "location",
          header: t("tables:locationLabel"),
          cell: ({ row }) => (
            <Badge
              variant="outline"
              className={`font-normal px-1.5 ${setPromoLocationLayout(row.original.location)}`}
            >
              {row.original.location}
            </Badge>
          ),
        },
      ] as ColumnDef<Promo>[],
    }),
    [t],
  );

  return (
    <TablesSchemaContext.Provider value={contextValues}>{children}</TablesSchemaContext.Provider>
  );
};
