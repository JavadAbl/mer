import styles from "./Login.module.css";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { userLoginAction, userLogout } from "../../redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import { LOGIN_SLIDER_1, LOGO } from "../../utils/constants";

//--------------------------------------------------------
const formSchema = yup.object({
  email: yup.string().required("email is required"),
  password: yup.string().required("password is required"),
  remember: yup.boolean().required(),
});
//--------------------------------------------------------

export default function Login() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData.auth) navigate(`/`);
    else dispatch(userLogout());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.auth]);

  const formik = useFormik({
    initialValues: {
      email: "user1@test.com",
      password: "1234",
      remember: false,
    },
    validationSchema: formSchema,
    onSubmit: function (values) {
      dispatch(userLoginAction(values));
    },
  });

  useEffect(() => {
    if (userData.error) formik.resetForm();
  }, [userData.error]);

  // Component-----------------------------------------------
  return (
    <div className={`${styles.container}`}>
      {/* Logo-------------------------------------------------- */}
      <div className={`${styles.logo_container}`}>
        <Link className={`${styles.logo_item}`} to="/">
          <img
            className={styles.logo_image}
            loading="lazy"
            src={LOGO}
            alt="Mern Social Logo"
          />
        </Link>
        <Link className={`${styles.logo_item} ${styles.btn}`} to={"/register"}>
          Register
        </Link>
        <Link className={`${styles.logo_item}`} to={"/about"}>
          About
        </Link>
      </div>

      <hr />

      <div className={`${styles.content_container}`}>
        {/* Slider-------------------------------------------------- */}
        <div className={`${styles.slider_container}`}>
          <img
            className={`${styles.slider_image}`}
            loading="lazy"
            src={LOGIN_SLIDER_1}
            alt="Mern Social Login"
          />
        </div>

        {/* Form-------------------------------------------------- */}
        <div className={`${styles.form_container}`}>
          <p className={`${styles.title}`}>
            {" Login to see what others share to you.."}
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className={styles.field_container}>
              {userData.error ? (
                <>
                  <p style={{ color: "red" }}>{userData.error}</p>
                </>
              ) : null}

              <label>Email:</label>
              <br />
              <input
                className={styles.input}
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                type="text"
                placeholder="Email"
              />
              <p>{formik.errors.email}</p>
            </div>

            <div className={styles.field_container}>
              <label>password:</label>
              <br />
              <input
                className={styles.input}
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                type="password"
                placeholder="password"
              />
              <p>{formik.touched.password && formik.errors.password}</p>
            </div>

            <div
              className={`${styles.field_container} ${styles.submit_container}`}
            >
              <button
                className={`${styles.btn} ${styles.btn_login}`}
                type="submit"
                disabled={formik.isSubmitting}
              >
                {userData.loading ? (
                  <Spinner center={false} style={{ height: "100%" }} />
                ) : (
                  "Login"
                )}
              </button>

              <label
                style={{ fontSize: "max(0.8rem,0.8vw)", marginRight: "0.4rem" }}
              >
                Remember Login
              </label>
              <input
                checked={formik.values.remember}
                onChange={formik.handleChange("remember")}
                type="checkbox"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
