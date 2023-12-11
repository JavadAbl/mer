export default function Spacer({
  vertical = 0,
  horizontal = 0,
  top = 0,
  left = 0,
  right = 0,
  bottom = 0,
  display = "inline-block",
}) {
  let style;
  if (vertical)
    style = {
      display,
      marginTop: vertical,
      marginBottom: vertical,
    };
  else if (horizontal)
    style = {
      display,
      marginLeft: horizontal,
      marginRight: horizontal,
    };
  else
    style = {
      display,
      marginTop: top,
      marginRight: right,
      marginBottom: bottom,
      marginLeft: left,
    };
  return <div style={style}></div>;
}
