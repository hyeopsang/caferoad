import "../styles/Menu.css";
import close from "../images/close.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../redux/authSlice';

export default function Menu({ onMenu }) {
  const auth = useSelector(state => state.auth);
  const userInfo = auth.user?.properties || {}; // userInfo를 안전하게 가져옴
  const dispatch = useDispatch();

  const handleLogout = () => {
    window.Kakao.Auth.logout(() => {
      dispatch(logoutAction());
      window.location.href = '/';
    });
  };

  return (
    <div className="Menu_Wrap">
      <div className="Menu_In">
        <div className="close">
          <img src={close} alt="닫기" onClick={() => onMenu(false)} />
        </div>
        <div className="profile">
          <div className="profile_img">
            <img src={userInfo.profile_image || "/default-profile.png"} alt="Profile" />
          </div>
          <h2>{userInfo.nickname || "Anonymous"}</h2>
        </div>
        <div className="Menu_List">
          <Link to={"/myreview"}><p>내가 쓴 리뷰</p></Link>
          <p onClick={handleLogout}>로그 아웃</p>
        </div>
      </div>
    </div>
  );
}
