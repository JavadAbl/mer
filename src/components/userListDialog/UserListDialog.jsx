import { useEffect, useState } from "react";
import styles from "./UserListDialog.module.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { followUser, getUsersByIds } from "../../utils/api/userApi";
import Spacer from "../Spacer";
import { IconCross } from "../Icons";
import Msg from "../Msg";

export default function UserListDialog({ attr, title, userIds, hancleClose }) {
  const [ids, setIds] = useState(userIds);
  const userStore = useSelector((store) => store.users);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  // Get data-------------------------------------------
  useEffect(() => {
    function getData() {
      getUsersByIds(ids)
        .then((res) => setUsers(res.data.users))
        .catch(() => setError("An unexpected error happens.."));
    }

    getData();
  }, [ids]);

  // handles-------------------------------------------
  const handleFollow = (user) => {
    let type;
    if (userStore.user.following.includes(user._id)) type = "unfollow";
    else type = "follow";

    followUser({ followId: user._id, type })
      .then(() => {
        setIds((ids) => ids.filter((val) => val !== user._id));
      })
      .catch((err) => console.log(err));
  };

  // Sub components-------------------------------------------
  const closeCross = () => {
    return (
      <span className={styles.close_btn} onClick={() => hancleClose()}>
        <IconCross />
      </span>
    );
  };

  // Case error or empty------------------------------------
  if (!users || !users.length)
    return (
      <div className={styles.container} {...attr}>
        {closeCross()}
        {error ? (
          <Msg>{error}</Msg>
        ) : (
          <Msg>{`No ${title ? title : "Data"}!`}</Msg>
        )}
      </div>
    );

  // Component-------------------------------------------
  return (
    <div className={styles.container} {...attr}>
      {closeCross()}

      <h1 className={styles.title}>{title}</h1>
      <Spacer display="block" vertical={"1rem"} />
      <hr />
      <Spacer display="block" vertical={"1rem"} />

      {users.map((user) => {
        return (
          <div key={user._id} className={styles.user_container}>
            <img
              className={styles.image}
              src={user.profilePicture}
              alt={user.userName}
            />

            <Spacer right={"0.5rem"} />

            <Link to={`/profile/${user._id}`} className={styles.userName}>{user.userName}</Link>

            <div className={styles.dummy}></div>

            <span className={styles.btn} onClick={() => handleFollow(user)}>
              {userStore.user.following.includes(user._id)
                ? "Unfollow"
                : "Follow"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
