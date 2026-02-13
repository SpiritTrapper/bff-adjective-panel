import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";

interface Props {
  title: string;
  onCreate?: () => void;
  onFilter?: () => void;
}

export default function PageTitle({ title, onCreate, onFilter }: Props) {
  const { t } = useTranslation("common");

  return (
    <div className="flex justify-between items-center w-full mb-4">
      <h1 className="text-2xl m-0!">{title}</h1>
      <div className="flex justify-end gap-4">
        {!!onCreate && (
          <Button
            variant="outline"
            className="border-red-400 text-red-400 font-normal hover:border-red-400 hover:text-white hover:bg-red-400"
            onClick={onCreate}
          >
            <Plus />
            {t("create")}
          </Button>
        )}
        {!!onFilter && (
          <Button
            variant="outline"
            className="border-indigo-500 text-indigo-600 font-normal hover:border-indigo-500 hover:text-white hover:bg-indigo-500"
            onClick={onFilter}
          >
            {t("filters")}
          </Button>
        )}
      </div>
    </div>
  );
}
