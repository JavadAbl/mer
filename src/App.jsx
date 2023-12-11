import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import HomePage from "./pages/HomePage/HomePage";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import CreatePost from "./pages/createPost/CreatePost";
import Post from "./pages/post/Post";
import tokenValidate from "./utils/tokenValidate";
import EditProfile from "./pages/editProfile/EditProfile";
import Explore from "./pages/explore/Explore";
import About from "./pages/about/About";

export default function App() {
  // const navigate = useNavigate();

  const dispatch = useDispatch();
  const session = sessionStorage.getItem("user");
  const localToken = localStorage.getItem("token");

  if (session) {
    const sessionObj = JSON.parse(session);
    const token = sessionObj.token;
    tokenValidate(dispatch, token);
  } else if (localToken) {
    tokenValidate(dispatch, localToken);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
