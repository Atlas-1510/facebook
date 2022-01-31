import { FC, useContext } from "react";
import SignIn from "./pages/SignIn";

import NavBar from "./components/common/NavBar";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/Auth";

const App: FC = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return (
      <div className="bg-zinc-200 font-roboto min-w-[20rem]">
        <NavBar />
        {/* Div below sits behind fixed NavBar to prevent overlap at top of scroll */}
        <div className="h-14 w-full bg-transparent mb-3"></div>
        <Outlet />
      </div>
    );
  } else {
    return <SignIn />;
  }
};

export default App;
