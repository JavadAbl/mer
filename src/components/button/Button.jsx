import styles from "./Button.module.css";

export default function Button({ varient, type, style, attr, children }) {
  if (!varient || !type) return null;

  return (
    <button
      style={{ ...style }}
      type={type}
      className={`${styles.btn} ${styles[varient]}`}
      {...attr}
    >
      {children}
    </button>
  );
}
