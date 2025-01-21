import "../styles/Menu.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/authSlice";

export default function Menu({ onMenu }) {
  const auth = useSelector((state) => state.auth);
  const userInfo = auth.user?.properties || {}; // userInfo를 안전하게 가져옴
  const dispatch = useDispatch();

  const handleLogout = () => {
    window.Kakao.Auth.logout(() => {
      dispatch(logoutAction());
      window.location.href = "/";
    });
  };
  const profileImageUrl = userInfo.profile_image
    ? userInfo.profile_image.replace("http://", "https://")
    : "/default-profile.png";
  return (
    <div className="min-w-[375px] max-w-[428px]">
      <div className="Menu_In">
        <div className="close">
          <img
            src={"./images/close.png"}
            alt="닫기"
            onClick={() => onMenu(false)}
          />
        </div>
        <div className="profile">
          <div className="profile_img">
            <img src={profileImageUrl} alt="Profile" />
          </div>
          <h2>{userInfo.nickname || "Anonymous"}</h2>
        </div>
        <div className="Menu_List">
          <Link to={"/myreview"}>
            <p>내가 쓴 리뷰</p>
          </Link>
          <p onClick={handleLogout}>로그 아웃</p>
        </div>
      </div>
    </div>
  );
}
