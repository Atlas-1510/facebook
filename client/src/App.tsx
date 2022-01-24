import { useEffect, useState, FC } from "react";
import axios from "axios";
import SignIn from "./pages/SignIn";
import { UserContext, User } from "./contexts/User";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";

const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getAuthStatus() {
      const response = await axios.get("/auth/getAuthStatus");
      console.log(response.data);
      setUser(response.data);
    }
    getAuthStatus();
  }, []);

  if (user) {
    return (
      <UserContext.Provider value={user}>
        <div>
          <NavBar />
          <Outlet />
        </div>
      </UserContext.Provider>
    );
  } else {
    return <SignIn />;
  }
};

export default App;
