import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPsswordError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const submitButton = useRef(null);

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
  function handleConfirmPasswordChange(e) {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setConfirmPasswordError("Password did not match.");
    } else {
      setConfirmPasswordError(null);
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

    submitButton.current.innerText = "Signing up...";
    submitButton.current.disabled = true;
    axios
      .post(
        "https://easy-survey-back.onrender.com/register-user",
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
          window.location.href = "/login";
        } else {
          if (response["data"]["error"] === "USERNAME_ALREADY_EXISTS") {
            submitButton.current.innerText = "Signup";
            submitButton.current.disabled = false;
            setFormError("Username already exists, try another one.");
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
          <h1 className="w-full text-center font-bold text-2xl py-2">Signup</h1>
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
          {!passwordError && password !== "" ? (
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-800">
                Confirm password
              </label>
              <input
                type="password"
                className={`p-3 w-full border rounded-md focus:outline-none focus:border-teal-500 ${
                  passwordError ? "border-red-500" : "border-slate-500"
                }`}
                placeholder="Confirm password..."
                onChange={handleConfirmPasswordChange}
              />
              {confirmPasswordError && (
                <span className="w-full p-2 rounded-md bg-red-50 text-red-700">
                  {confirmPasswordError}
                </span>
              )}
            </div>
          ) : null}
          {formError && (
            <span className="w-full p-2 rounded-md bg-red-50 text-red-700">
              {formError}
            </span>
          )}
          <button
            ref={submitButton}
            type="submit"
            className={`font-bold p-2 px-5 rounded-md border border-teal-500 text-teal-800 hover:bg-teal-500 hover:text-slate-50 mx-auto disabled:hover:cursor-not-allowed disabled:text-slate-600 disabled:border-slate-600 disabled:hover:bg-slate-50`}
            disabled={
              userNameError || passwordError || confirmPasswordError
                ? true
                : false
            }
          >
            Signup
          </button>
        </form>
        <div className="flex items-center justify-center p-2">
          Already signed up?&nbsp;
          <Link to={"/login"} className="text-teal-800">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
