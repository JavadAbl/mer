let style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  fontWeight: "bold",
  fontStyle: "italic",
  whiteSpace: "pre-line",
  width: "fit-content",
};

export default function Msg({ children, attr }) {
  if (attr) style = null;
  return <div style={{ ...style, ...attr }}>{children}</div>;
}
