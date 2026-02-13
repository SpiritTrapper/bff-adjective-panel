import { FormLabel } from "@components/ui/form";

interface Props {
  label?: string;
  required?: boolean;
}

export default function FieldLabel({ label, required }: Props) {
  if (!label) {
    return null;
  }

  return (
    <FormLabel>
      {label}
      {!!required && <span className="text-red-600">*</span>}
    </FormLabel>
  );
}
