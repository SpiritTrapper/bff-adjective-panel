import { useState } from "react";

interface ReturnValue {
  isOpen: boolean;
  toggleOpen: () => void;
  open: () => void;
  close: () => void;
}

export const useElementOpen = (initialOpen: boolean): ReturnValue => {
  const [isOpen, setOpen] = useState(initialOpen);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return { isOpen, toggleOpen, close, open };
};
