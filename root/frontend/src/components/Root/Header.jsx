import { Link } from "react-router-dom";
export default function Header() {
  return (
    <div className="flex justify-end items-center w-full p-1 py-2">
      <div className="flex flex-row gap-2 px-3">
        <Link
          to={"/login"}
          className="py-1 px-4 border border-teal-700 text-teal-800 hover:bg-teal-800 hover:text-white rounded-full"
        >
          Login
        </Link>
        <Link
          to={"/signup"}
          className="py-1 px-4 border border-teal-700 text-teal-800 hover:bg-teal-800 hover:text-white rounded-full"
        >
          SignUp
        </Link>
      </div>
    </div>
  );
}
