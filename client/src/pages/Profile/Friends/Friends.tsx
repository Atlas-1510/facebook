import { useState } from "react";
import Tab from "../../../components/common/Tab";
import WhiteBox from "../../../components/common/WhiteBox";
import SearchBar from "../../../components/SearchBar";
import { Outlet } from "react-router-dom";

const Friends = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="col-span-5">
      <WhiteBox>
        <div className="flex justify-between items-start">
          <h2 className=" text-zinc-800 font-medium text-2xl mb-2">Friends</h2>
          <div>
            <SearchBar
              placeholder="Search friends"
              value={searchInput}
              setValue={setSearchInput}
            />
          </div>
        </div>
        <ul className="flex">
          <Tab end={true} title="All Friends" to="" />
          <Tab title="Friend Requests" to="requests" />
          <Tab title="Find Friends" to="new" />
        </ul>
        <Outlet context={searchInput} />
      </WhiteBox>
    </div>
  );
};

export default Friends;
