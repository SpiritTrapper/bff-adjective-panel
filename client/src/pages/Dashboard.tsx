import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import useSWR from "swr";

import { Card, CardFooter, CardHeader, CardTitle } from "@components/ui/card";

import { EventData, ListResponse, NewsData, PromoStory } from "@lib/types";
import { swrFetcher } from "@lib/utils";

export default function DashboardPage() {
  const { t } = useTranslation("dashboard");
  const { data: news } = useSWR<ListResponse<NewsData>>("/get-news", swrFetcher);
  const { data: events } = useSWR<ListResponse<EventData>>("/get-events", swrFetcher);
  const { data: promos } = useSWR<ListResponse<PromoStory>>("/promo-list", swrFetcher);

  return (
    <div className="@container/main">
      <h1 className="text-sm">{t("title")}</h1>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card flex flex-col justify-between h-full relative">
          <NavLink to="/events" className="absolute top-0 left-0 w-full h-full" />
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {events?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">{t("events")}</div>
          </CardFooter>
        </Card>
        <Card className="@container/card flex flex-col justify-between h-full relative">
          <NavLink to="/news" className="absolute top-0 left-0 w-full h-full" />
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {news?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">{t("news")}</div>
          </CardFooter>
        </Card>
        <Card className="@container/card flex flex-col justify-between h-full relative">
          <NavLink to="/promo/events" className="absolute top-0 left-0 w-full h-full" />
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {promos?.total ?? 0}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">{t("promosInList")}</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
