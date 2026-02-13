import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useFormContext } from "react-hook-form";

import { FormControl, FormItem, FormLabel } from "@components/ui/form";

interface Props {
  name: string;
  label?: string;
  defaultValue?: string;
}

export default function ColorPicker({ name, label, defaultValue }: Props) {
  const { setValue } = useFormContext();
  const [color, setColor] = useState<string>();

  const onFieldChange = (value?: string) => {
    if (value) {
      setColor(value);
      setValue(name, value);
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setColor(defaultValue);
      setValue(name, defaultValue);
    }
  }, [defaultValue]); // eslint-disable-line

  return (
    <FormItem>
      {!!label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <HexColorPicker color={color} onChange={onFieldChange} />
      </FormControl>
    </FormItem>
  );
}
