import styles from "./Post.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import Spinner from "../../components/spinner/Spinner";
import Spacer from "../../components/Spacer";
import Moment from "react-moment";
import CommentList from "../../components/comments/CommentList";
import Navbar from "../../components/navBar/Navbar";
import {
  createComment,
  getPostComments,
} from "../../redux/slices/comment.slice";
import {
  IconComment,
  IconLike,
  IconLiked,
  IconCross,
  IconDelete,
} from "../../components/Icons";
import { Dialog } from "react-dialog-element";
import Button from "../../components/button/Button";
import { deletePost } from "../../utils/api/postApi";
import { ReadMoreReadLess } from "react-readmore-and-readless";

//-----------------------------------------------------
// Reducer
const ACTIONS = {
  LOADING: "LOADING",
  LOADING_COMMENTS: "LOADING_COMMENTS",
  SUCCESS: "SUCCESS",
  DELETE_LOADING: "DELETE_LOADING",
  DELETE_DIALOG: "DELETE_DIALOG",
  DELETED: "DELETED",
};
Object.freeze(ACTIONS);

const postReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ACTIONS.SUCCESS:
      return {
        ...state,
        post: action.payload,
        loading: false,
      };
    case ACTIONS.ERROR:
      return {
        ...state,
        post: null,
        error: action.payload,
        loading: false,
      };
    case ACTIONS.LOADING_COMMENTS:
      return {
        ...state,
        loadingComments: true,
      };
    case ACTIONS.SUCCESS_COMMENTS:
      return {
        ...state,
        comments: action.payload,
        loading: false,
      };
    case ACTIONS.ERROR_COMMENTS:
      return {
        ...state,
        comments: null,
        errorComments: action.payload,
        loading: false,
      };
    case ACTIONS.RELOAD_COMMENTS:
      return {
        ...state,
        reloadComments: action.payload,
      };

    case ACTIONS.DELETE_LOADING:
      return {
        ...state,
        deleteLoading: action.payload,
      };
    case ACTIONS.DELETE_DIALOG:
      return {
        ...state,
        deleteDialog: action.payload,
      };
    case ACTIONS.DELETED:
      return {
        ...state,
        deleted: action.payload,
      };

    default:
      return state;
  }
};

//-----------------------------------------------------
// Main Component
export default function Post() {
  const dispatchStore = useDispatch();
  const [commentText, setCommentText] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const userStore = useSelector((state) => state.users);
  const commentStore = useSelector((state) => state.comments);
  const [state, dispatch] = useReducer(postReducer, {
    loading: false,
    loadingComments: false,
    post: null,
    comments: null,
    error: null,
    errorComments: null,
    reloadComments: true,

    deleteLoading: false,
    deleteDialog: false,
    deleted: false,
  });
  const post = state.post;
  const comments = commentStore.comments;

  let isOwner = null;
  if (post) isOwner = userStore.user._id === post.user._id;

  //-------------------------------------
  // Handlers
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!commentStore.loading)
      dispatchStore(
        createComment({
          comment: { postId: id, content: commentText },
          token: userStore.token,
        })
      );
  };

  useEffect(() => {
    setCommentText("");
  }, [commentStore.comments]);

  const handleLike = () => {
    axios
      .patch(`${BASE_URL}/api/posts/like/${id}`)

      .then((res) => {
        dispatch({ type: ACTIONS.SUCCESS, payload: res.data.post });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //-------------------------------------
  // Effects
  useEffect(() => {
    if (!userStore.auth) navigate("/login");

    async function fetchPost() {
      try {
        dispatch({ type: "LOADING" });
        const { data } = await axios.get(`${BASE_URL}/api/posts/post/${id}`);

        /* dispatch({
          type: ACTIONS.LIKE,
          payload: data.post.likes.includes(userStore.user._id),
        }); */
        dispatch({ type: ACTIONS.SUCCESS, payload: data.post });
      } catch (err) {
        dispatch({
          type: ACTIONS.ERROR,
          payload: err?.response?.data ? err.response.data : err.message,
        });
        console.log(err);
      }
    }

    function fetchComments() {
      dispatchStore(getPostComments({ postId: id, token: userStore.token }));
    }

    if (!state.post) fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete Handle-----------------------------------------
  const handleDelete = () => {
    dispatch({ type: ACTIONS.DELETE_LOADING, payload: true });
    deletePost(post._id)
      .then(() => dispatch({ type: ACTIONS.DELETED, payload: true }))
      .finally(() =>
        dispatch({ type: ACTIONS.DELETE_LOADING, payload: false })
      );
  };

  // Delete Effect-----------------------------------------
  useEffect(() => {
    if (state.deleted) navigate(-1);
  }, [state.deleted]);

  // -----------------------------------------------------
  // Delete Dialog
  const deleteDialog = () => {
    return (
      <Dialog
        className={styles.dialog_delete}
        isOpen={state.deleteDialog}
        setOpen={(open) =>
          dispatch({ type: ACTIONS.DELETE_DIALOG, payload: open })
        }
      >
        <p
          style={{
            marginBottom: "1rem",
            fontWeight: "600",
            fontSize: "0.9rem",
          }}
        >
          Are you sure to delete post?
        </p>

        <Button
          varient={"pri"}
          type="button"
          attr={{
            onClick: () => handleDelete(),
            disabled: state.deleteLoading,
          }}
        >
          Delete
        </Button>

        <Button
          varient={"sec"}
          type="button"
          attr={{
            onClick: () => {
              dispatch({ type: ACTIONS.DELETE_DIALOG, payload: false });
            },
            disabled: state.deleteLoading,
          }}
        >
          Cancel
        </Button>
      </Dialog>
    );
  };
  // -----------------------------------------------------
  // Components
  if (!post) return <Spinner />;

  return (
    <div className={`${styles.container}`}>
      <Navbar />

      {state.deleteDialog ? deleteDialog() : null}

      <div
        style={{ backgroundImage: `url(${post.image})` }}
        className={`${styles.container_image}`}
      ></div>

      {/* // ----------------------------------------------
       Username */}
      <div className={`${styles.side_container}`}>
        <div className={`${styles.side_user_container}`}>
          <div className={styles.signs_container}>
            <span
              className={styles.signs_cross}
              title="Close"
              onClick={() => navigate(-1)}
            >
              <IconCross />
            </span>

            {isOwner ? (
              <span
                className={styles.signs_delete}
                title="Delete Post"
                onClick={() =>
                  dispatch({ type: ACTIONS.DELETE_DIALOG, payload: true })
                }
              >
                <IconDelete />
              </span>
            ) : null}
          </div>

          <img
            className={`${styles.side_user_image}`}
            src={post.user.profilePicture}
            alt={post.user.userName}
          />

          <Spacer horizontal="0.5rem" />

          <h1 className={`${styles.side_user_name}`}>{post.user.userName}</h1>

          <Spacer horizontal="0.5rem" />

          <Moment
            className={styles.side_user_date}
            fromNow
            date={post.createdAt}
          />
        </div>

        <hr />

        {/* // -----------------------------------------------------
// Caption */}
        <div className={`${styles.side_caption_container}`}>
          <ReadMoreReadLess
            rootClassName={`${styles.side_caption}`}
            text={post.caption}
            readMoreText="show more"
            readLessText="show less"
            readMoreClassName={styles.caption_btn}
            readLessClassName={styles.caption_btn}
            charLimit={80}
          />
        </div>

        <hr />

        {/* //----------------------------------------------------------------
// Comments */}
        <div className={`${styles.side_comments_container}`}>
          <div className={`${styles.side_comments_list_container}`}>
            <CommentList comments={comments} />
          </div>

          <form
            onSubmit={(e) => handleFormSubmit(e)}
            className={`${styles.side_comments_form}`}
            action=""
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              type="text"
              placeholder="Leave a comment..."
            />
            <button type="submit">post</button>
          </form>
        </div>

        <hr />

        {/* //----------------------------------------------------------------
// Likes */}
        <div className={`${styles.side_likes_container}`}>
          <span onClick={handleLike}>
            {state.post.likes.includes(userStore.user._id) ? (
              <>
                <IconLiked width="1.5em" height="1.5em" />
                <Spacer horizontal="0.25rem" />
                {post.likes.length}
              </>
            ) : (
              <>
                <IconLike width="1.5em" height="1.5em" />
                <Spacer horizontal="0.25rem" />
                {post.likes.length}
              </>
            )}
          </span>

          <span>
            <IconComment width="1.4em" height="1.4em" />
            <Spacer horizontal="0.25rem" />
            {comments ? comments.length : 0}
          </span>
        </div>
      </div>
    </div>
  );
}
