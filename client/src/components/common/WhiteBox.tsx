import { ReactNode, FC } from "react";

type Props = {
  children: ReactNode;
};

const WhiteBox: FC<Props> = ({ children }) => {
  return (
    <section className="bg-zinc-100 shadow-md overflow-auto md:rounded-lg p-3">
      {children}
    </section>
  );
};

export default WhiteBox;
