import { useReducer, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Explore.module.css";
import Navbar from "../../components/navBar/Navbar";
import Spacer from "../../components/Spacer";
import Spinner from "../../components/spinner/Spinner";
import Msg from "../../components/Msg";
import { fetchExplore } from "../../utils/api/postApi";
import PostPreview from "../../components/postPreview/PostPreview";
import { IconPlusCircle } from "../../components/Icons";

export default function Explore() {
  const userStore = useSelector((store) => store.users);
  const navigate = useNavigate();

  if (!userStore.auth) navigate(`/`);

  // Reducer---------------------------------------------
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return {
            ...state,
            loading: action.payload,
          };
        case "error":
          return {
            ...state,
            error: action.payload,
            loading: false,
          };
        case "fulfilled":
          return {
            ...state,
            posts: action.payload,
            error: null,
            loading: false,
          };
        case "page":
          return {
            ...state,
            page: action.payload,
          };
        case "last_page":
          return {
            ...state,
            lastPage: action.payload,
          };
        default:
          return state;
      }
    },
    {
      loading: false,
      error: null,
      posts: [],
      page: 1,
      limit: 8,
      lastPage: false,
      currentPostsCount: function () {
        return this.posts.length;
      },
    }
  );

  // Data effect------------------------------------------------
  useEffect(() => {
    dispatch({ type: "loading", payload: true });
    fetchExplore(state.page, state.limit)
      .then((res) => {
        const posts = res.data.posts;
        if (state.currentPostsCount() === posts.length)
          dispatch({ type: "last_page", payload: true });
        else dispatch({ type: "fulfilled", payload: posts });
      })
      .catch((err) => dispatch({ type: "error", payload: err }))
      .finally(() => dispatch({ type: "loading", payload: false }));
  }, [state.page]);

  // Component--------------------------------------------------
  if (state.loading && state.page === 1) return <Spinner />;

  if (state.error)
    return (
      <div className={styles.container}>
        <Navbar />
        <Msg>
          <p>An unexpected error happens...</p>
        </Msg>
      </div>
    );

  if (state.posts.length === 0)
    return (
      <div className={styles.container}>
        <Navbar />
        <Msg>
          <p>No posts to show.</p>
        </Msg>
      </div>
    );

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.content_container}>
        <hr style={{ width: "85%" }} />
        <h1 className={styles.title}>Explore</h1>
        <Spacer display="block" vertical={"1.5rem"} />

        {/* //Posts------------------- ----------------*/}
        <section className={`${styles.posts_container}`}>
          {state.posts.map((post) => {
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
          })}
        </section>
        {!state.lastPage ? (
          <div
            className={styles.fetch}
            title="Load More.."
            onClick={() => {
              if (state.loading) return;
              dispatch({ type: "page", payload: state.page + 1 });
            }}
          >
            {!state.loading ? (
              <IconPlusCircle />
            ) : (
              <Spinner center={false} style={{ width: "100%" }} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
