import { FC, useContext } from "react";
import SignIn from "./pages/SignIn";

import NavBar from "./components/common/NavBar";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/Auth";

const App: FC = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return (
      <div className="bg-zinc-200 h-screen min-w-[100vw] font-roboto">
        <NavBar />
        <Outlet />
      </div>
    );
  } else {
    return <SignIn />;
  }
};

export default App;
