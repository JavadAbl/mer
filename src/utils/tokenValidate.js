import { BASE_URL } from "./constants";
import axios from "axios";
import { userSession } from "../redux/slices/user.slice";

export default function tokenValidate(dispatcher, token) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("post", `${BASE_URL}/api/users/auth`, false);
  xhttp.setRequestHeader("Authorization", "Bearer " + token);

  xhttp.onload = function () {
    if (this.status === 401) {
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      return;
    }
    if (this.status === 200) {
      const user = JSON.parse(this.response).user;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      sessionStorage.setItem("user", JSON.stringify({ token, user }));

      dispatcher(userSession({ user, token }));
    }
  };

  xhttp.send();
}
