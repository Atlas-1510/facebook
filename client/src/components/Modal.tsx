import React, { FC, ReactNode, MouseEvent } from "react";
import { IconContext } from "react-icons";
import { IoMdClose } from "react-icons/io";

type Props = {
  children?: ReactNode;
  open: boolean;
  title?: string;
  subtext?: string;
  onClose: () => void;
};

const Modal: FC<Props> = ({ children, open, onClose, title, subtext }) => {
  const closeModal = (e: MouseEvent<HTMLElement>): void => {
    e.stopPropagation();
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-stone-200/60 z-50"
      onClick={closeModal}
    >
      <div className=" w-full h-full grid place-items-center">
        <section
          role="dialog"
          aria-labelledby="title"
          className="bg-white rounded-lg w-full max-w-sm md:max-w-md drop-shadow-2xl flex flex-col items-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex w-full justify-between">
            <div>
              {title && (
                <h1 id="title" className=" text-3xl font-roboto">
                  {title}
                </h1>
              )}
              {subtext && (
                <p className=" text-sm text-zinc-500 font-roboto mt-1">
                  {subtext}
                </p>
              )}
            </div>
            <button onClick={closeModal}>
              <IconContext.Provider value={{ color: "#71717a", size: "2rem" }}>
                <IoMdClose />
              </IconContext.Provider>
            </button>
          </div>
          <div className="w-full my-3 h-px bg-gray-300 box-border"></div>
          {children}
        </section>
      </div>
    </div>
  );
};

export default Modal;
