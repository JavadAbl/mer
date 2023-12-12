import { useReducer, useEffect } from "react";
import styles from "./Feed.module.css";
import Navbar from "../../components/navBar/Navbar";
import PostFeed from "../../components/postFeed/PostFeed";
import { fetchFeed } from "../../utils/api/postApi";
import Spinner from "../../components/spinner/Spinner";
import Msg from "../../components/Msg";
import ProfileSuggest from "../../components/profileSuggest/ProfileSuggest";
import { IconPlusCircle } from "../../components/Icons";

const ACTIONS = {
  LOADING: "LOADING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  PAGE: "PAGE",
  IS_LAST_PAGE: "ISLASTPAGE",
};
Object.freeze(ACTIONS);

//------------------------------------------
// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTIONS.SUCCESS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case ACTIONS.ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ACTIONS.PAGE:
      return {
        ...state,
        page: action.payload,
      };
    case ACTIONS.IS_LAST_PAGE:
      return {
        ...state,
        isLastPage: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

//------------------------------------------
// Main Function
export default function Feed() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    posts: [],
    page: 1,
    limit: 8,
    isLastPage: false,
    currentPostsCount: function () {
      return this.posts.length;
    },
  });

  useEffect(() => {
    dispatch({
      type: ACTIONS.LOADING,
      payload: true,
    });
    fetchFeed(state.page, state.limit)
      .then((res) => {
        const posts = res.data.posts;
        if (state.currentPostsCount() === posts.length)
          dispatch({ type: ACTIONS.IS_LAST_PAGE, payload: true });
        else
          dispatch({
            type: ACTIONS.SUCCESS,
            payload: posts,
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state.page]);

  if (state.loading && state.page === 1) return <Spinner />;

  if (state.error)
    return (
      <>
        <Navbar />
        <Msg>
          <p>{"An unexpected error happenes..."}</p>
        </Msg>
      </>
    );

  if (!state.posts.length)
    return (
      <div className={`${styles.container}`}>
        <Navbar />

        <div className={`${styles.main_container}`}>
          <Msg
            attr={{
              position: "static",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <p>{"No post to show \n Follow Some one to see their posts."}</p>
          </Msg>
        </div>

        <aside className={`${styles.aside_container}`}>
          <ProfileSuggest />
        </aside>
      </div>
    );
  return (
    <>
      <Navbar />

      <div className={`${styles.container}`}>
        <main className={`${styles.main_container}`}>
          {state.posts.map((post) => {
            return (
              <div key={post._id} className={`${styles.post_container}`}>
                <PostFeed post={post} />
              </div>
            );
          })}

          {!state.isLastPage ? (
            <div
              className={styles.fetch}
              title="Load More.."
              onClick={() => {
                if (state.loading) return;
                dispatch({ type: ACTIONS.PAGE, payload: state.page + 1 });
              }}
            >
              {!state.loading ? (
                <IconPlusCircle />
              ) : (
                <Spinner center={false} style={{ width: "100%" }} />
              )}
            </div>
          ) : null}
        </main>

        <aside className={`${styles.aside_container}`}>
          <ProfileSuggest />
        </aside>
      </div>
    </>
  );
}
