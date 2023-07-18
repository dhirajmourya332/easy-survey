import axios from "axios";

const RouteGuard = (props) => {
  function hasAuthToken() {
    let flag = false;
    //check user has JWT token
    localStorage.getItem("auth-token") ? (flag = true) : (flag = false);
    if (flag) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("auth-token")}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    return flag;
  }

  const { component: Component } = { ...props };

  if (hasAuthToken()) {
    return <Component />;
  } else {
    window.location.href = "/login";
  }
};

export default RouteGuard;
