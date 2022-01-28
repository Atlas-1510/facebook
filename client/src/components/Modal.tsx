import React, { FC, ReactNode, MouseEvent } from "react";
import ReactDom from "react-dom";

type Props = {
  children?: ReactNode;
  open: boolean;
  onClose: () => void;
};

const Modal: FC<Props> = ({ children, open, onClose }) => {
  const closeModal = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    onClose();
  };

  if (!open) {
    return null;
  }
  const portal: HTMLElement = document.getElementById("portal")!;
  return ReactDom.createPortal(
    <div
      className="absolute top-0 left-0 right-0 bottom-0 bg-white/40 z-50"
      onClick={closeModal}
    >
      <div className=" w-full h-full grid place-items-center">
        <section
          className="bg-white rounded-lg w-full max-w-sm md:max-w-md shadow-lg flex flex-col items-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={closeModal}>Close modal</button>
          {children}
        </section>
      </div>
    </div>,
    portal
  );
};

export default Modal;
