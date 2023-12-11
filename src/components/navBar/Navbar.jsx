import { IconExplore, IconOut } from "../Icons";
import styles from "./Navbar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../redux/slices/user.slice";
import { Link } from "react-router-dom";
import { LOGO } from "../../utils/constants";

export default function Navbar() {
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store.users);

  if (!userStore.auth) return null;

  const handleLogout = () => {
    dispatch(userLogout());
  };

  return (
    <nav className={`${styles.container}`}>
      <Link title="Feed" to={"/"} className={styles.icon_container}>
        <img
          style={{ width: "100%", filter: "grayscale(65%)" }}
          src={LOGO}
          alt="Mern Social"
        />
      </Link>

      <Link title="Explore" to={"/explore"} className={styles.icon_container}>
        <IconExplore width="100%" />
      </Link>

      <Link
        className={`${styles.icon_container}`}
        to={`/profile/${userStore.user._id}`}
      >
        <img
          title={`${userStore.user.userName}`}
          className={` ${styles.profile}`}
          src={`${userStore.user.profilePicture}`}
          alt={`${userStore.user.userName}`}
        />
      </Link>

      {/*   //----Logout */}
      <span
        title="Logout"
        style={{ fontSize: "25px" }}
        className={styles.icon_container}
        onClick={handleLogout}
      >
        <IconOut />
      </span>
    </nav>
  );
}
