import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FieldLabel from "@components/FieldLabel";
import { FormControl, FormField, FormItem, FormMessage } from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";

interface Props extends Partial<HTMLTextAreaElement> {
  name: string;
  label?: string;
  className?: string;
  error?: string;
}

export default function TextArea({
  name,
  placeholder,
  label,
  className,
  error,
  defaultValue,
  required,
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
            <Textarea
              {...field}
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
