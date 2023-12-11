import styles from "./CommentList.module.css";
import { IconZero } from "../Icons";
import Comment from "./Comment";
import Msg from "../Msg";

export default function CommentList({ comments }) {
  if (!comments)
    return (
      <div className={`${styles.container}`}>
        <IconZero /> Comments are loading..
      </div>
    );

  if (comments.length === 0)
    return (
      <div className={`${styles.container}`}>
        <Msg>
          <IconZero /> No Comments
        </Msg>
      </div>
    );

  return (
    <div className={`${styles.container}`}>
      {comments.map((comment) => {
        return <Comment key={comment._id} comment={comment} />;
      })}
    </div>
  );
}
