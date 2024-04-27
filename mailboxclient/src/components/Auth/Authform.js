
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../Store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Authform = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  const loginHandler = (event) => {
    event.preventDefault();
    console.log("user-loggedin");
    console.log(emailRef.current.value);
    console.log(passwordRef.current.value);

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCIc0998d2u1MdXXsPgeav0ErwHODUd0pY",
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
      .then((res) => {
        if (res.ok) {
          navigate('/');
          return res.json();
          
        } else {
          return res.json().then((data) => {
            let errorMessage = "Incorrect Email or Password!";
            console.log(data);

            //alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        //authCtx.login(data.idToken);
        dispatch(
          authActions.login({ token: data.idToken, useruuid: data.email }),
        );
        console.log(data);
        toast.success("User Logged in");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message);
      });

    //dispatch(authActions.login());
  };
  const signupHandler = () => {
    navigate("/signup");
  };

  return (
    <form>
      <fieldset>
        <div>
          <label for="exampleInputEmail1" class="form-label mt-4">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            ref={emailRef}
          />
        </div>
        <div>
          <label for="exampleInputPassword1" class="form-label mt-4">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            autocomplete="off"
            ref={passwordRef}
          />
        </div>
        <button type="submit"  style={{marginTop:"15px", marginRight:"10px"}} onClick={loginHandler} class="btn btn-outline-primary">
          Submit
        </button>
        <button type="submit"  style={{marginTop:"15px", marginLeft:"10px"}} onClick={signupHandler} class="btn btn-outline-info">
          New User Signup
        </button>
      </fieldset>
    </form>
  );
};
export default Authform;
