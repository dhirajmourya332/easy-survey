import axios from "axios";

export default async function netRequest({ url, data = {}, method = "get" }) {
  return new Promise((resolve, reject) => {
    if (url) {
      switch (method) {
        case "get":
          axios
            .get(url, data)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              if (
                error.response.status === 403 ||
                error.response.status === 401
              ) {
                window.location.href = "/login";
              }
              reject(error);
            });
          break;
        case "post":
          axios
            .post(url, data)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              if (
                error.response.status === 403 ||
                error.response.status === 401
              ) {
                window.location.href = "/login";
              }
              reject(error);
            });
      }
    } else {
      reject(false);
    }
  });
}
