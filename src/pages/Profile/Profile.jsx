import { useEffect, useState, useReducer } from "react";
import styles from "./Profile.module.css";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { IconPen, IconPlus, IconSetting } from "../../components/Icons";
import PostPreview from "../../components/postPreview/PostPreview";
import { followUser, getProfile } from "../../utils/api/userApi";
import Navbar from "../../components/navBar/Navbar";
import Spacer from "../../components/Spacer";
import UserListDialog from "../../components/userListDialog/UserListDialog";
import { Dialog } from "react-dialog-element";
import Spinner from "../../components/spinner/Spinner";
import Msg from "../../components/Msg";

// Main Function-----------------------------------------
export default function Profile() {
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.users);
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [error, setError] = useState();

  if (!userStore.auth) navigate("/");

  const profileOrigin = profile?._id === userStore?.user?._id;
  const isFollow = profile?.followers?.includes(userStore.user._id);

  //Init effect-------------------------------------------------------
  useEffect(() => {
    getProfile(id)
      .then((res) => {
        setProfile(res.data.profile);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  //Dialog reducer-----------------------------------------------
  const dialogReduser = (state, action) => {
    switch (action.type) {
      case "open":
        return {
          ...state,
          open: action.payload,
        };
      case "load":
        return {
          ...state,
          open: action.payload.open,
          title: action.payload.title,
          data: action.payload.data,
        };
      default:
        return state;
    }
  };

  const [dialogState, dispatch] = useReducer(dialogReduser, {
    open: false,
    handleClose,
  });
  function handleClose() {
    dispatch({ type: "open", payload: false });
  }

  //-----------------------------------------------------
  const handleFollow = () => {
    let type;
    if (!isFollow) type = "follow";
    else type = "unfollow";
    console.log(type);
    followUser({ followId: id, type })
      .then((res) => setProfile(res.data.profile))
      .catch((err) => console.log(err));
  };

  //dialog component----------------------------------------------
  const dialog = () => {
    return (
      <Dialog
        isOpen={dialogState.open}
        setOpen={(open) => dispatch({ type: "open", payload: open })}
        onClose={() => {
          dispatch({
            data: null,
            title: undefined,
            open: false,
          });
        }}
      >
        <UserListDialog
          title={dialogState.title}
          userIds={dialogState.data}
          hancleClose={dialogState.handleClose}
        />
      </Dialog>
    );
  };
  // Component------------------------------------------------
  if (error)
    return (
      <>
        <Navbar />
        <Msg>An unexpected error happens..</Msg>
      </>
    );

  if (!profile)
    return (
      <>
        <Navbar />
        <Spinner />
      </>
    );

  return (
    <div className={styles.container}>
      {dialogState.open ? dialog() : null}

      <Navbar />

      {/* Heading------------------------------------------- */}
      <div className={styles.content_container}>
        <main className={`${styles.heading}`}>
          <img
            className={`${styles.heading_img}`}
            src={profile.profilePicture}
            alt=""
          />

          <div className={`${styles.heading_info}`}>
            <h1 className={`${styles.heading_info_username}`}>
              {profile.userName}
            </h1>
            <span
              className={`${styles.heading_info_followers}`}
              onClick={() =>
                dispatch({
                  type: "load",
                  payload: {
                    open: true,
                    title: "Followers",
                    data: profile.followers,
                  },
                })
              }
            >
              Followers: {profile.followers.length}
            </span>
            <span
              className={`${styles.heading_info_followers}`}
              onClick={() =>
                dispatch({
                  type: "load",
                  payload: {
                    open: true,
                    title: "Following",
                    data: profile.following,
                  },
                })
              }
            >
              Following: {profile.following.length}
            </span>

            <p className={`${styles.heading_name}`}>{profile.name}</p>
            <Spacer display="block" vertical={"0.5rem"} />
            <p className={`${styles.heading_bio}`}>{profile.bio}</p>
          </div>

          {/* // Buttons--------------------------------- */}
          {profileOrigin ? (
            <div className={`${styles.btn_container}`}>
              <span
                className={`${styles.heading_btn} ${styles.heading_btn_sec}`}
                onClick={() => navigate(`/profile/edit`)}
              >
                <IconSetting />
                <span>Edit Profile</span>
              </span>
              <span
                className={`${styles.heading_btn} ${styles.heading_btn_primary}`}
                onClick={() => navigate(`/createpost`)}
              >
                <IconPen />
                <span>New Post</span>
              </span>
            </div>
          ) : (
            <>
              {isFollow ? (
                <span
                  className={`${styles.heading_btn_sec} ${styles.heading_btn}`}
                  onClick={handleFollow}
                >
                  Following
                </span>
              ) : (
                <span
                  className={`${styles.heading_btn_primary} ${styles.heading_btn}`}
                  onClick={handleFollow}
                >
                  <IconPlus />
                  Follow
                </span>
              )}
            </>
          )}
        </main>

        <hr style={{ width: "80%" }} />
        <h2 className={styles.posts_title}>Posts</h2>
        <Spacer display="block" vertical={"1.5rem"} />

        {/* //Posts------------------- */}
        <section className={`${styles.container_posts}`}>
          {profile.posts.length === 0 ? (
            <Msg attr={{ fontSize: "max(1.5rem,1.5vw)" }}>No posts!</Msg>
          ) : (
            profile.posts.map((post) => {
              return (
                <Link
                  to={`/post/${post._id}`}
                  className={`${styles.post}`}
                  key={post._id}
                >
                  <PostPreview
                    image={post.image}
                    likesCount={post.likes.length}
                    commentsCount={post.comments.length}
                  />
                </Link>
              );
            })
          )}
        </section>

        <Spacer display="block" vertical={"1.5rem"} />
      </div>
    </div>
  );
}
