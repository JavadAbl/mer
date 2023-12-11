import styles from "./Comment.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spacer from "../Spacer";
import Moment from "react-moment";
import { updateComment, deleteComment } from "../../redux/slices/comment.slice";
import { IconDelete } from "../Icons";

export default function Comment({ comment }) {
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store.users);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(null);

  const isCommentOwner = userStore.user._id === comment.user._id;
  const isPostOwner = userStore.user._id === comment.post;
  //----------------------------------------------------------
  const handleEdit = () => {
    setEditMode(true);
    setEditText(comment.content);
  };

  const handleUpdate = () => {
    setEditMode(false);
    dispatch(
      updateComment({
        postId: comment.post,
        commentId: comment._id,
        content: editText,
        token: userStore.token,
      }),
    );
  };

  const handleDeleteLink = () => {
    dispatch(
      deleteComment({
        postId: comment.post,
        commentId: comment._id,
        token: userStore.token,
      }),
    );
  };

  //----------------------------------------------------------
  if (!comment) return null;

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.user_container}`}>
        {isCommentOwner || isPostOwner ? (
          <span onClick={handleDeleteLink} className={styles.user_btn_delete}>
            <IconDelete />
          </span>
        ) : null}

        <span>
          <img
            className={`${styles.image}`}
            src={comment.user.profilePicture}
            alt={comment.user.userName}
          />
        </span>
        <Spacer horizontal="0.1rem" />
        <div>
          <h2 className={`${styles.userName}`}>{comment.user.userName}: </h2>
          <Moment className={styles.date} fromNow date={comment.createdAt} />
          <Spacer horizontal="0.2rem" />
          {isCommentOwner ? (
            <a onClick={handleEdit} className={`${styles.user_btn_edit}`}>
              Edit
            </a>
          ) : null}
        </div>
      </div>

      {/* //---------------------------------------------------------------- */}
      {!editMode ? (
        <p className={`${styles.content}`}> {comment.content}</p>
      ) : (
        <>
          <textarea
            rows={7}
            value={editText}
            onChange={(v) => setEditText(v.target.value)}
            className={`${styles.edit_text}`}
          />

          <Spacer display="block" vertical="0.3rem" />

          <div className={`${styles.edit_btn_container}`}>
            <span
              onClick={() => setEditMode(false)}
              className={`${styles.edit_btn}`}
            >
              Cancel
            </span>
            <Spacer horizontal="0.3rem" />
            <span onClick={handleUpdate} className={`${styles.edit_btn}`}>
              Update
            </span>
          </div>
        </>
      )}
    </div>
  );
}
