import { FC, useContext } from "react";
import SignIn from "./pages/SignIn";

import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/Auth";

const App: FC = () => {
  const { user } = useContext(AuthContext);
  if (user) {
    return (
      <>
        <NavBar />
        <Outlet />
      </>
    );
  } else {
    return <SignIn />;
  }
};

export default App;
