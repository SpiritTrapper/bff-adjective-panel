import { RefreshCw } from "lucide-react";

import { cn } from "@lib/utils";

interface Props {
  className?: string;
}

export default function Preloader({ className }: Props) {
  return (
    <div className={cn("flex flex-col h-[100vh] p-3", className)}>
      <RefreshCw className="m-auto h-10 w-10 animate-spin" />
    </div>
  );
}
