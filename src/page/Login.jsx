import "../styles/Login.css";
import { KAKAO_AUTH_URL } from '../config';

export default function Login(){
    return (
        <div className='Login'>
            <div className="Logo">
                <div className='Logo_img'><img src={"./images/logingomgom.jpg"}/></div>
                <h2 className='Title'>Coffee Road</h2>
            </div>  
            <div className='Login_btn'><a href={KAKAO_AUTH_URL}><img src={"./images/kakaologin.png"}/></a></div>
        </div>
        
    )
}
