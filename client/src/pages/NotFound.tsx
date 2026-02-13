import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation("validation");
  return <div>{t("pageNotFound")}</div>;
}
