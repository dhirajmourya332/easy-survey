import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPsswordError] = useState(null);
  const [formError, setFormError] = useState(null);
  const submitButton = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("auth-token")}`;
      console.log(axios.defaults.headers.common["Authorization"]);
      axios
        .get("/authenticate-token")
        .then((response) => {
          if (response.data["success"]) {
            window.location.href = "/dashboard";
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            localStorage.removeItem("auth-token");
          }
        });
    }
  });

  function handelUserNameChange(e) {
    const newUserName = e.target.value;
    setUserName(newUserName);
    formError ? setFormError(null) : null;
    if (newUserName === "") {
      setUserNameError("Username can't be empty.");
    } else {
      const pattern = /^[a-zA-Z0-9_]+$/;
      //   console.log(pattern.test(newUserName));
      if (!pattern.test(newUserName)) {
        setUserNameError("Invalid username.");
      } else {
        setUserNameError(null);
      }
    }
  }
  function handlePasswordChange(e) {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword === "") {
      setPsswordError("Password can't be empty.");
    } else if (newPassword.length < 6) {
      setPsswordError("Password must be more than 6 characters");
    } else {
      setPsswordError(null);
    }
  }

  async function handleFormSubmission(e) {
    e.preventDefault();
    if (userName === "") {
      setUserNameError("Username can't be empty.");
      return;
    }
    if (password === "") {
      setPsswordError("Password can't be empty.");
      return;
    }

    submitButton.current.innerText = "Loging in...";
    submitButton.current.disabled = true;
    axios
      .post(
        "/login",
        {
          username: userName,
          password: password,
        },
        {
          headers: {
            "Content-Type": "Application/json",
          },
        }
      )
      .then((response) => {
        if (response.data["success"]) {
          console.log(response.data);
          localStorage.setItem("auth-token", response.data["authToken"]);
          window.location.href = "/dashboard";
        } else {
          if (response["data"]["error"] === "INVALID_USERNAME_OR_PASSWORD") {
            submitButton.current.innerText = "Login";
            submitButton.current.disabled = false;
            setFormError("Invalid username or password.");
          }
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="flex items-center justify-center w-full p-3 min-h-screen">
      <div className="p-3 py-5 w-full sm:max-w-md  mx-auto bg-slate-50 border border-slate-500 rounded-lg">
        <form
          action="#"
          method="POST"
          className="flex flex-col gap-6 pb-3"
          onSubmit={handleFormSubmission}
        >
          <h1 className="w-full text-center font-bold text-2xl py-2">Login</h1>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Username</label>
            <input
              type="text"
              className={`p-3 w-full border rounded-md focus:outline-none focus:border-teal-500 ${
                userNameError ? "border-red-500" : "border-slate-500"
              }`}
              placeholder="Username..."
              onChange={handelUserNameChange}
            />
            {userNameError && (
              <span className="w-full p-2 rounded-md bg-red-50 text-red-700">
                {userNameError}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-800">Password</label>
            <input
              type="password"
              className={`p-3 w-full border rounded-md focus:outline-none focus:border-teal-500 ${
                passwordError ? "border-red-500" : "border-slate-500"
              }`}
              placeholder="Password..."
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <span className="w-full p-2 rounded-md bg-red-50 text-red-700">
                {passwordError}
              </span>
            )}
          </div>

          {formError && (
            <span className="w-full p-2 rounded-md bg-red-50 text-red-700">
              {formError}
            </span>
          )}
          <button
            ref={submitButton}
            type="submit"
            className={`font-bold p-2 px-5 rounded-md border border-teal-500 text-teal-800 hover:bg-teal-500 hover:text-slate-50 mx-auto disabled:hover:cursor-not-allowed disabled:text-slate-600 disabled:border-slate-600 disabled:hover:bg-slate-50`}
            disabled={userNameError || passwordError ? true : false}
          >
            Login
          </button>
        </form>
        <div className="flex items-center justify-center p-2">
          Not signed up yet?&nbsp;
          <Link to={"/signup"} className="text-teal-800">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
