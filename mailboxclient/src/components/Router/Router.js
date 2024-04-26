
import { Route, Routes } from "react-router-dom";
import Authform from "../Auth/Authform";
import Index from "../Index/Index";
import Signup from "../Auth/Signup";
import ComposeMail from "../Compose/Compose";
import Sentbox from "../Sentbox/Sentbox";
import Inbox from "../Inbox/Inbox";

const routePath = {
  Home: "/",
  Login: "/login",
  Signup: "/signup",
  Compose: "/compose",
  Inbox: "/inbox",
  Sentbox: "/sentbox",
};
const Routers = () => {
  return (
    <Routes>
      <Route path={routePath.Home} element={<Index />} />
      <Route path={routePath.Login} element={<Authform />} />
      <Route path={routePath.Signup} element={<Signup />} />
      <Route path={routePath.Compose} element={<ComposeMail />} />
      <Route path={routePath.Inbox} element={<Inbox />} />
      <Route path={routePath.Sentbox} element={<Sentbox />} />
    </Routes>
  );
};

export default Routers;
