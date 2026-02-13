import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FieldLabel from "@components/FieldLabel";
import { FormControl, FormField, FormItem, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";

interface Props extends Partial<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string;
}

export default function TextInput({
  name,
  type = "text",
  placeholder,
  label,
  error,
  className,
  required,
  defaultValue,
}: Props) {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
    }
  }, [defaultValue]); // eslint-disable-line

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FieldLabel label={label} required={required} />
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`${className} ${error ? "border-red-600" : ""}`}
            />
          </FormControl>
          {!!error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
}
