import Preloader from "@components/Preloader";
import { DialogContent, DialogTitle } from "@components/ui/dialog";

export default function DialogPreloadingBlock() {
  return (
    <DialogContent className="lg:min-w-[60vw] md:min-w-[80vw] w-full" aria-describedby={undefined}>
      <DialogTitle className="h-0" />
      <div className="flex flex-col gap-8 p-6 pt-3 min-h-[60vh] overflow-y-auto">
        <Preloader className="h-full" />
      </div>
    </DialogContent>
  );
}
