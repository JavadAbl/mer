import styles from "./CreatePost.module.css";
import { useEffect, useReducer, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { BASE_URL } from "../../utils/constants";
import Navbar from "../../components/navBar/Navbar";
import Spinner from "../../components/spinner/Spinner";
import { imageResize } from "../../utils/imageTools";
//--------------------------------------------------------
function postReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };
    case "SUCCESS":
      return {
        ...state,
        post: true,
        loading: false,
      };
    case "ERROR":
      return {
        post: false,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

//--------------------------------------------------------
const formSchema = yup.object({
  caption: yup.string().required("Caption is required"),
  image: yup.string().required("Image is required"),
});

//--------------------------------------------------------
export default function CreatePost() {
  const [state, dispatch] = useReducer(postReducer, {
    loading: false,
    post: false,
    error: null,
  });
  const userStore = useSelector((state) => state.users);
  const navigate = useNavigate();
  const [showErrors, setShowErrors] = useState(false);

  //--------------------------------------------------------
  useEffect(() => {
    if (!userStore.auth) {
      navigate("/login");
    }
  });

  useEffect(() => {
    if (state.post) navigate(-1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.post]);

  // Formik-----------------------------------------------
  const formik = useFormik({
    validationSchema: formSchema,
    initialValues: {
      caption: "",
      image: undefined,
    },

    onSubmit: (values) => {
      imageResize(values.image, "post").then((resizedImage) => {
        formik.values.image = new File([resizedImage], "temp.webp", {
          type: "image/webp",
        });
        postForm();
      });

      const postForm = async () => {
        const formData = new FormData();
        formData.set("caption", values.caption);
        formData.set("image", values.image);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        try {
          dispatch({ type: "LOADING" });
          await axios.post(`${BASE_URL}/api/posts`, formData, config);
          dispatch({ type: "SUCCESS" });
        } catch (error) {
          dispatch({
            type: "ERROR",
            payload: error?.response?.data
              ? error.response.data
              : error.message,
          });
          console.log(error.response.data);
        }
      };
    },
  });
  // Component-----------------------------------------------
  return (
    <>
      <Navbar />

      <div className={`${styles.container}`}>
        <div className={`${styles.content_container}`}>
          <h1 className={`${styles.title}`}>Create new post</h1>
          <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
            {formik.errors.caption && showErrors ? (
              <div>
                <b style={{ color: "red" }}>{formik.errors.caption}</b>
              </div>
            ) : null}

            {formik.errors.image && showErrors ? (
              <div>
                <b style={{ color: "red" }}>{formik.errors.image}</b>
              </div>
            ) : null}

            <p className={styles.label}>Caption:</p>
            <textarea
              className={styles.input}
              onBlur={formik.handleBlur("caption")}
              onChange={formik.handleChange("caption")}
              value={formik.values.caption}
              rows={5}
              placeholder="Write a caption.."
            />

            <p className={styles.label}>Image:</p>
            <input
              className={styles.input}
              onBlur={formik.handleBlur("image")}
              onChange={(e) => (formik.values.image = e.target.files[0])}
              type="file"
              accept="image/*"
              size={1}
            />
            <br />

            <button
              className={`${styles.btn} ${styles.btn_pri}`}
              disabled={state.loading}
              type="submit"
              onClick={() => setShowErrors(true)}
            >
              {state.loading ? (
                <Spinner center={false} style={{ height: "90%" }} />
              ) : (
                "Create"
              )}
            </button>
            <button
              className={`${styles.btn} ${styles.btn_sec}`}
              disabled={state.loading}
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
