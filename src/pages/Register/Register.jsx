import styles from "./Register.module.css";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { userLogout, userRegisterAction } from "../../redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LOGO, REGISTER_SLIDER_1 } from "../../utils/constants";
import Spinner from "../../components/spinner/Spinner";

//--------------------------------------------------------
const formSchema = yup.object({
  userName: yup.string().required("Username is required"),
  name: yup.string(),
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});
//--------------------------------------------------------
export default function Register() {
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.users);
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (userStore.auth) navigate(`/profile/${userStore.user._id}`);
    else dispatch(userLogout());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.auth]);

  const formik = useFormik({
    initialValues: {
      name: "",
      userName: "",
      email: "user@test.com",
      password: "1234",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      dispatch(userRegisterAction({ user: values, remember }));
    },
  });

  useEffect(() => {
    if (userStore.error) formik.resetForm();
  }, [userStore.error]);

  //Component--------------------------------------------------
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
        <Link className={`${styles.logo_item} ${styles.btn}`} to={"/Login"}>
          Login
        </Link>
        <Link className={`${styles.logo_item}`} to={"/about"}>
          About
        </Link>
      </div>

      <hr />

      <div className={styles.content_container}>
        <div className={`${styles.slider_container}`}>
          <img
            className={`${styles.slider_image}`}
            loading="lazy"
            src={REGISTER_SLIDER_1}
            alt="Mern Social Login"
          />
        </div>

        <div className={styles.form_container}>
          <p className={`${styles.title}`}>{" Register your account now.."}</p>

          <form onSubmit={formik.handleSubmit} action="">
            <div className={styles.field_container}>
              {userStore.error ? (
                <p style={{ color: "red" }}>{userStore.error}</p>
              ) : null}

              <label>Username:</label>
              <br />
              <input
                className={styles.input}
                value={formik.values.userName}
                onChange={formik.handleChange("userName")}
                onBlur={formik.handleBlur("userName")}
                type="text"
                placeholder="Username"
              />
              <p>{formik.touched.userName && formik.errors.userName}</p>
            </div>

            <div className={styles.field_container}>
              <label>Name(optional):</label>
              <br />
              <input
                className={styles.input}
                value={formik.values.name}
                onChange={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                type="text"
                placeholder="Name"
              />
              <p>{formik.touched.name && formik.errors.name}</p>
            </div>

            <div className={styles.field_container}>
              <label>Email:</label>
              <br />
              <input
                className={styles.input}
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                type="email"
                placeholder="Email"
                autoComplete="off"
              />
              <p>{formik.touched.email && formik.errors.email}</p>
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
                autoComplete="off"
              />
              <p>{formik.touched.password && formik.errors.password}</p>
            </div>

            <div
              className={`${styles.field_container} ${styles.btn_container}`}
            >
              <input
                checked={remember}
                onChange={() => setRemember((value) => !value)}
                type="checkbox"
              />
              <label style={{ fontSize: "max(0.8rem,0.8vw)" }}>
                Remember Login
              </label>

              <br />

              <button
                className={styles.btn}
                disabled={userStore.loading ? true : false}
                type="submit"
                value="Register"
              >
                {userStore.loading ? (
                  <Spinner center={false} style={{ height: "100%" }} />
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
