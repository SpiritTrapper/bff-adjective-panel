import { useTranslation } from "react-i18next";

import { Button } from "@components/ui/button";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "ru" ? "en" : "ru";
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button variant="outline" size="sm" className="text-xs px-2" onClick={toggleLanguage}>
      {i18n.language === "ru" ? "EN" : "RU"}
    </Button>
  );
}
