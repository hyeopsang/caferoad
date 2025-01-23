import "../styles/Login.css";
import { KAKAO_AUTH_URL } from "../config";

export default function Login() {
  return (
    <div className="relative flex h-screen min-w-[375px] max-w-[428px] flex-col items-center justify-center gap-[15px] overflow-hidden bg-white">
      <div className="px-[120px]">
        <img src={"./images/logingomgom.jpg"} />
      </div>
      <h2 className="text-center text-[32px] font-bold text-[#212121]">
        Cafe Road
      </h2>
      <div className="absolute bottom-[30px] px-[30px]">
        <a href={KAKAO_AUTH_URL}>
          <img src={"./images/kakaologin.png"} />
        </a>
      </div>
    </div>
  );
}
