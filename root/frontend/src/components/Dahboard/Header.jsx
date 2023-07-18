import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("auth-token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  }
  return (
    <div className="flex flex-row gap-3 justify-end items-center w-full p-3">
      <Link
        to={"/create-survey-form"}
        className="py-1 px-4 rounded-md border border-teal-500 text-teal-800 hover:bg-teal-500 hover:text-white text-sm md:text-base"
      >
        Create new survey form
      </Link>
      <button
        className="py-1 p-1 w-10 rounded-md border border-teal-500 text-teal-800 hover:bg-teal-500 hover:text-white"
        type={"button"}
        onClick={logout}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            className="stroke-teal-800"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 12h-9.5m7.5 3l3-3-3-3m-5-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h5a2 2 0 002-2v-1"
          />
        </svg>
      </button>
    </div>
  );
}
