import { useRef } from "react";
import { IconComment, IconLiked } from "../Icons";
import Spacer from "../Spacer";
import styles from "./PostPreview.module.css";

export default function PostPreview({
  atrr,
  image,
  likesCount,
  commentsCount,
}) {
  const infoEl = useRef();

  return (
    <div
      style={{ backgroundImage: `url(${image})` }}
      className={`${styles.container}`}
      onMouseEnter={() => (infoEl.current.style.opacity = "1")}
      onMouseLeave={() => (infoEl.current.style.opacity = "0")}
      {...atrr}
    >
      <div ref={infoEl} className={`${styles.container_info}`}>
        <span>
          <IconLiked style={{ fontSize: "19px" }} />
          <Spacer right="0.5rem" />
          <span>{likesCount}</span>
        </span>

        <span>
          <IconComment />
          <Spacer right="0.5rem" />
          <span>{commentsCount}</span>
        </span>
      </div>
    </div>
  );
}
