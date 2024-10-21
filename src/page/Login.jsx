import "../styles/Login.css";
import { KAKAO_AUTH_URL } from '../config';
import Kakaologin from "../images/kakaologin.png";
import gomgom from "../images/logingomgom.jpg";
export default function Login(){
    return (
        <div className='Login'>
            <div className="Logo">
                <div className='Logo_img'><img src={gomgom}/></div>
                <h2 className='Title'>Coffee Road</h2>
            </div>  
            <div className='Login_btn'><a href={KAKAO_AUTH_URL}><img src={Kakaologin}/></a></div>
        </div>
        
    )
}
