import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { SCOPE } from "../constant";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/actions/auth";
import { clearLocalStorage, getLocalStorage, setLocalStorage } from "../utils";
import Loader from "./Loader";
import { logout } from "../redux/auth/authSlice";

function Login() {
  const { loading, userInfo, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setLocalStorage("googleAccessToken", codeResponse.access_token);
      dispatch(registerUser(codeResponse.access_token));
    },
    onError: (error) => console.log("Login Failed:", error),
    scope: SCOPE.join(" "),
  });

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    dispatch(logout());
  };

  useEffect(() => {
    if (getLocalStorage("googleAccessToken")) {
      dispatch(registerUser(getLocalStorage("googleAccessToken")));
    }
  }, []);

  return (
    <div>
      {userInfo ? (
        <div className="flex justify-between">
          <div className="flex gap-5">
            <div>
              <img
                src={userInfo.profilePicture}
                alt="user image"
                className="w-[50px] h-[50px] rounded"
              />
            </div>
            <div>
              <p>Name: {userInfo.firstName + " " + userInfo.lastName}</p>
              <p>Email Address: {userInfo.email}</p>
            </div>
          </div>

          <button
            onClick={logOut}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Log out
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {loading ? <Loader size={"small"} /> : "Sign in with Google 🚀"}
        </button>
      )}
    </div>
  );
}
export default Login;
