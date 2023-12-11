import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Feed from "../feed/Feed";
import { LOGO } from "../../utils/constants";
import { IconEmail, IconGithub, IconW } from "../../components/Icons";

export default function HomePage() {
  const userStore = useSelector((store) => store.users);

  if (userStore.auth) return <Feed />;

  return (
    <section className={styles.container}>
      <div className={styles.info_container}>
        <span>by M.J Abolhassani Far</span>

        <div className={styles.info_icons_container}>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/JavadAbl"
          >
            <IconGithub />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="mailto:com.javadabl@gmail.com"
          >
            <IconEmail />
          </a>
          <a target="_blank" rel="noreferrer" href="http://javad-abl.rf.gd">
            <IconW />
          </a>
        </div>
      </div>

      <div className={`${styles.slider}`}>
        <main className={`${styles.main_container}`}>
          <b>Welcome To</b>
          <h1 className={`${styles.main_h1}`}>Merngram</h1>
          <p>{"Share your images and moments with your friends."}</p>
          <Link className={styles.btn} to={"/register"}>
            Register
          </Link>
          <br className={styles.btn_br} />
          <Link className={styles.btn} to={"/login"}>
            Login
          </Link>
        </main>
        <img className={styles.image} src={LOGO} alt="Mern Social Logo" />
      </div>
    </section>
  );
}
