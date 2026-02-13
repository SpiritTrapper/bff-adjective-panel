import { useFormContext } from "react-hook-form";

import { FormItem, FormLabel } from "@components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";

interface TabsItem {
  label: string;
  value: string;
}

interface Props {
  name: string;
  items: TabsItem[] | readonly TabsItem[];
  label?: string;
  defaultValue?: string;
}

export default function CustomTabs({ name, items, label, defaultValue }: Props) {
  const { setValue } = useFormContext();

  const onFieldChange = (value: string) => {
    setValue(name, value, { shouldDirty: true });
  };

  return (
    <FormItem>
      {!!label && <FormLabel>{label}</FormLabel>}
      <Tabs
        defaultValue={defaultValue ?? items[0].value}
        onValueChange={onFieldChange}
        className="w-full"
      >
        <TabsList>
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="cursor-pointer">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </FormItem>
  );
}
