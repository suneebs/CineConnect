import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import TalentLink from "./TalentLink";
import MessagesLink from "./MessagesLink"; 
import JobLink from "./JobLink";

const SidebarItems = () => {
  return (
    <>
      <Home />
      {/* <Search /> */}
      <TalentLink />
      <Notifications />
      <CreatePost />
      <JobLink />
      <MessagesLink />
      <ProfileLink />
    </>
  );
};

export default SidebarItems;
