import { FC } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import Posts from "./pages/Profile/Posts";
import Settings from "./pages/Settings";
import Friends from "./pages/Profile/Friends/Friends";
import Photos from "./pages/Profile/Photos";
import AllFriends from "./pages/Profile/Friends/AllFriends";
import Requests from "./pages/Profile/Friends/Requests";
import FindFriends from "./pages/Profile/Friends/FindFriends";
import ForeignProfile from "./pages/ForeignProfile/ForeignProfile";
import ForeignPosts from "./pages/ForeignProfile/ForeignPosts";
import ForeignFriends from "./pages/ForeignProfile/ForeignFriends";
import Entry from "./Entry";
import axios from "axios";
import { useQueryClient, useQuery } from "react-query";
import { User } from "./types/User";
import { AuthContext } from "./contexts/Auth";

const App: FC = () => {
  const fetchUserState = async () => {
    try {
      const response = await axios.get("/auth/getAuthStatus");
      return response.data;
    } catch (err: any) {
      console.log(err.response.data);
      throw err;
    }
  };

  const queryClient = useQueryClient();
  const { data: user, refetch: getUserState } = useQuery(
    "userState",
    fetchUserState
  );

  return (
    <AuthContext.Provider value={{ user, getUserState }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Entry />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />}>
              <Route index element={<Posts />} />
              <Route path="friends" element={<Friends />}>
                <Route index element={<AllFriends />} />
                <Route path="requests" element={<Requests />} />
                <Route path="new" element={<FindFriends />} />
              </Route>
              <Route path="photos" element={<Photos />} />
            </Route>
            <Route path="users/:uid" element={<ForeignProfile />}>
              <Route index element={<ForeignPosts />} />
              <Route path="friends" element={<ForeignFriends />} />
              <Route path="photos" element={<Photos />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
