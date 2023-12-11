import styles from "./Spinner.module.css";

export default function Spinner({ center = true, style, attr }) {
  let centerStyle;

  if (center)
    centerStyle = {
      width: "4vw",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  else
    centerStyle = {
      ...style,
    };

  return (
    <div
      style={{ ...centerStyle }}
      className={styles.container}
      {...attr}
    ></div>
  );
}
