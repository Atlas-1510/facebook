import FriendTile from "../../../components/common/FriendTile";
import Tab from "../../../components/common/Tab";
import WhiteBox from "../../../components/common/WhiteBox";
import SearchBar from "../../../components/SearchBar";
import { Outlet } from "react-router-dom";

const Friends = () => {
  return (
    <div className="col-span-5">
      <WhiteBox>
        <div className="flex justify-between items-start">
          <h2 className=" text-zinc-800 font-medium text-2xl mb-2">Friends</h2>
          <div>
            <SearchBar placeholder="Search friends" />
          </div>
        </div>
        <ul className="flex">
          <Tab end={true} title="All Friends" to="" />
          <Tab title="Friend Requests" to="requests" />
          <Tab title="Find Friends" to="new" />
        </ul>
        <Outlet />
      </WhiteBox>
    </div>
  );
};

export default Friends;
