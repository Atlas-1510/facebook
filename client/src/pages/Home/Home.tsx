import React from "react";
import { useMediaQuery } from "react-responsive";
import Mobile from "./Mobile";
import Desktop from "./Desktop";

const Home = () => {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 768px)" });
  if (isMobileScreen) {
    return <Mobile />;
  } else {
    return <Desktop />;
  }
};

export default Home;
