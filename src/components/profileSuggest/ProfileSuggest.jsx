import styles from "./ProfileSuggest.module.css";
import { useState, useEffect } from "react";
import { getSuggestUsers, followUser } from "../../utils/api/userApi";
import { Link } from "react-router-dom";
import { IconCross } from "../Icons";

export default function ProfileSuggest() {
  const [suggests, setSuggests] = useState(null);
  const [error, setError] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [crossBtn, setCrossBtn] = useState(false);

  // Handle follow------------------------------------
  const handleFollow = (followId) => {
    followUser({ followId, type: "follow" }).then(() => setLoadData(true));
  };

  // Get data-----------------------------------------
  useEffect(() => {
    const getData = () => {
      getSuggestUsers(5)
        .then((res) => {
          setSuggests(res.data.users);
          console.log(res.data.users);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          console.log(err);
        })
        .finally(() => {
          setLoadData(false);
        });
    };

    if (loadData) getData();
  }, [loadData]);

  // Component----------------------------------------
  if (error)
    return (
      <p className={styles.msg}>An error occurred when loading content..</p>
    );

  return (
    <div
      style={crossBtn ? { display: "none" } : {}}
      className={styles.container}
    >
      <span className={styles.cross} onClick={() => setCrossBtn(true)}>
        <IconCross style={{ color: "red" }} />
      </span>

      <p className={styles.title}>Peapole you may know:</p>
      <div className={styles.user_container}>
        {suggests && suggests.length ? (
          suggests.map((suggest) => {
            return (
              <div key={suggest._id} className={styles.item}>
                <Link
                  to={`/profile/${suggest._id}`}
                  className={styles.userName}
                >
                  {suggest.userName}
                </Link>

                <span className={styles.item_detail}>
                  <img
                    className={styles.image}
                    src={suggest.profilePicture}
                    alt={suggest.userName}
                  />

                  <span
                    className={styles.btn}
                    onClick={() => handleFollow(suggest._id)}
                  >
                    Follow
                  </span>
                </span>
              </div>
            );
          })
        ) : (
          <p>No Suggestion</p>
        )}
      </div>
    </div>
  );
}
