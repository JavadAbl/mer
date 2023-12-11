// import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./src/index.css";
import App from "./src/App";
import store from "./src/redux/store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
