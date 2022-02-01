import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import Posts from "./pages/Profile/Posts";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { AuthProvider } from "./contexts/Auth";
import Friends from "./pages/Profile/Friends/Friends";
import Photos from "./pages/Profile/Photos";
import AllFriends from "./pages/Profile/Friends/AllFriends";
import Requests from "./pages/Profile/Friends/Requests";
import FindNewFriends from "./pages/Profile/Friends/FindNewFriends";

const rootElement = document.getElementById("root");
render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path=":uid" element={<Profile />}>
            <Route index element={<Posts />} />
            <Route path="friends" element={<Friends />}>
              <Route index element={<AllFriends />} />
              <Route path="requests" element={<Requests />} />
              <Route path="new" element={<FindNewFriends />} />
            </Route>
            <Route path="photos" element={<Photos />} />
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>,
  rootElement
);
