const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontWeight: "bold",
  fontStyle: "italic",
  whiteSpace: "pre-line",
};

export default function Msg({ children, attr }) {
  return <div style={{ ...style, ...attr }}>{children}</div>;
}
