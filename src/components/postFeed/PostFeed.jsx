import styles from "./PostFeed.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useFocus } from "../../utils/customHooks";
import { togglePostLike } from "../../utils/api/postApi";
import { addComment } from "../../utils/api/commentApi";
import { IconComment, IconLike, IconLiked, IconSend } from "../Icons";
import Moment from "react-moment";
import Spacer from "../../components/Spacer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ReadMoreReadLess } from "react-readmore-and-readless";
import { Link } from "react-router-dom";

// Function---------------------------------------
export default function PostFeed({ post }) {
  const userStore = useSelector((store) => store.users);
  const [isLiked, setIsLiked] = useState(
    post?.likes?.includes(userStore.user._id)
  );
  const [likesCount, SetLikesCount] = useState(post?.likes?.length);
  const [commentCount, SetCommentCount] = useState(post?.comments?.length);
  const [comment, setComment] = useState("");
  const [elFocus, setFocus] = useFocus();

  if (!post) return null;

  const iconLike = () => {
    return isLiked ? <IconLiked /> : <IconLike />;
  };

  // Handles------------------------------------
  const handleLike = () => {
    if (isLiked) SetLikesCount((value) => value - 1);
    else SetLikesCount((value) => value + 1);

    setIsLiked((value) => !value);
    togglePostLike(post._id);
  };

  const handleComment = (e) => {
    e.preventDefault();

    if (comment === "") return;

    addComment({
      postId: post._id,
      content: comment,
    })
      .then(() => {
        toast("Comment added to the post.");
        SetCommentCount((value) => {
          value + 1;
        });
      })
      .catch(() => toast("An error happens..."));

    setComment("");
  };

  //-------------------------------------------
  return (
    <div className={styles.container}>
      {/*  //----------------------------------------
    //userName */}
      <div className={styles.user_container}>
        <img
          className={styles.user_image}
          src={post.user.profilePicture}
          alt={post.user.userName}
        />

        <Spacer horizontal="0.2rem" />

        <Link to={`profile/${post.user._id}`} className={styles.user_userName}>
          {post.user.userName}
        </Link>

        <Spacer horizontal="0.5rem" />

        <span className={styles.user_date}>
          <Moment fromNow date={post.createdAt} />
        </span>
      </div>

      <hr />

      {/* //Image--------------------------------*/}
      <div
        style={{ backgroundImage: `url(${post.image})` }}
        className={styles.image}
      />

      <hr />

      {/* //Likes--------------------------------*/}
      <div className={styles.likes_container}>
        <span className={styles.likes_icon} onClick={handleLike}>
          {iconLike()}
          <Spacer horizontal={"0.2rem"} />
          <span>{likesCount}</span>
        </span>

        <span className={styles.likes_icon} onClick={setFocus}>
          <IconComment />
          <Spacer horizontal={"0.2rem"} /> {commentCount}
        </span>
      </div>

      <hr />

      {/* //Caption--------------------------------*/}
      <div className={styles.caption_container}>
        <span className={styles.caption}>Caption:</span>
        <Spacer horizontal="0.25rem" />
        <ReadMoreReadLess
          rootClassName={styles.caption_content}
          text={post.caption}
          readMoreText="show more"
          readLessText="show less"
          readMoreClassName={styles.caption_btn}
          readLessClassName={styles.caption_btn}
          charLimit={80}
        />
      </div>

      <hr />

      {/* //Comment--------------------------------*/}
      <form onSubmit={handleComment} className={styles.comment_container}>
        <input
          className={styles.comment_input}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          type="text"
          ref={elFocus}
        />
        <button className={styles.comment_submit}>
          <IconSend />
        </button>
      </form>

      <ToastContainer position="bottom-center" />
    </div>
  );
}
