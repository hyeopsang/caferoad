import "../styles/Menu.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Menu({ onMenu }) {
  const auth = useSelector((state) => state.auth);
  const userInfo = auth.user?.properties || {};
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };
  const profileImageUrl = userInfo.profile_image
    ? userInfo.profile_image.replace("http://", "https://")
    : "/default-profile.png";
  return (
    <div className="keyframe-[fadeIn] h-svh absolute left-0 z-20 h-full w-[350px] animate-fadeIn bg-white">
      <div className="flex h-[50px] w-full items-center justify-end px-[15px]">
        <img
          className="w-[20px]"
          src={"./images/close.png"}
          alt="닫기"
          onClick={() => onMenu(false)}
        />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center gap-[15px]">
          <div className="aspect-square w-[200px] overflow-hidden rounded-[200px] border-[3px] border-[#212121] bg-white">
            <img src={profileImageUrl} alt="Profile" />
          </div>
          <h2 className="text-[24px] text-[#212121]">
            {userInfo.nickname || "Anonymous"}
          </h2>
        </div>
        <div className="flex flex-col items-center gap-[15px] pt-[15px] text-[24px]">
          <Link to={"/myreview"}>
            <p>내가 쓴 리뷰</p>
          </Link>
          <p onClick={handleLogout}>로그 아웃</p>
        </div>
      </div>
    </div>
  );
}
