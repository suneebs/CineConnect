import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import TalentLink from "./TalentLink";
import MessagesLink from "./MessagesLink"; // ✅ Import MessagesLink

const SidebarItems = () => {
  return (
    <>
      <Home />
      <Search />
      <Notifications />
      <CreatePost />
      <TalentLink />
      <MessagesLink />
      <ProfileLink />
    </>
  );
};

export default SidebarItems;
