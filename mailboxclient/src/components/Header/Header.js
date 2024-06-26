//header.js
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/auth";
import "../../App.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const islogin = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const count= useSelector((state)=>state.auth.count);
  const navigate= useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate('/');
    toast.error("logged out");
  };

  return (
    <nav class="navbar navbar-expand-lg bg-light" data-bs-theme="light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          Mail Box Client
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor03"
          aria-controls="navbarColor03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarColor03">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <NavLink className="nav-link" to="/">
                Home
                <span class="visually-hidden">(current)</span>
              </NavLink>
            </li>
            {islogin &&<li class="nav-item">
              <NavLink className="nav-link" to="/compose">
                Compose Mail
              </NavLink>
            </li>}
            {islogin &&<li class="nav-item">
              <NavLink className="nav-link" to="/inbox">
                Inbox ({count})
              </NavLink>
            </li>}
            {islogin && <li class="nav-item">
              <NavLink className="nav-link" to="/sentbox">
                SentBox
              </NavLink>
            </li>}

            <li className="nav-item">
              {!islogin && (
                <NavLink
                  className="nav-link"
                  to="/login"
                  style={{ position: "fixed", right: "20px" }}
                >
                  Login
                </NavLink>
              )}
            </li>
            <li className="nav-item">
              {islogin && (
                <button
                  className="nav-link"
                  onClick={logoutHandler}
                  style={{ position: "fixed", right: "3px" }}
                >
                  Logout
                </button>
              )}
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
