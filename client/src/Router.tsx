import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Preloader from "@components/Preloader";

import { useAuthContext } from "@contexts/AuthContext";

import { PromoType } from "@lib/types";

const DashboardPage = lazy(() => import("./pages/Dashboard"));
const EventsPage = lazy(() => import("./pages/Events"));
const NewsPage = lazy(() => import("./pages/News"));
const AddPage = lazy(() => import("./pages/Add"));
const PromoPage = lazy(() => import("./pages/Promo"));
const LogInPage = lazy(() => import("./pages/LogIn"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function Router() {
  const { isAuthenticated, isAdmin } = useAuthContext();
  const { t } = useTranslation("promo");

  return (
    <Suspense fallback={<Preloader />}>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        {isAuthenticated && isAdmin && (
          <>
            <Route
              path="/dashboard"
              element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
            />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route
              path="/promo/events"
              element={<PromoPage promoType={PromoType.EVENT} title={t("promoEvents")} />}
            />
            <Route
              path="/promo/news"
              element={<PromoPage promoType={PromoType.NEWS} title={t("promoNews")} />}
            />
          </>
        )}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LogInPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
