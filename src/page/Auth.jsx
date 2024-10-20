import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { loginSuccess } from '../redux/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import qs from 'qs';

import { REST_API_KEY, REDIRECT_URI, CLIENT_SECRET } from '../config';

export default function Auth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const params = new URL(document.URL).searchParams;
    const code = params.get('code');

    const getToken = async () => {
        const payload = qs.stringify({
        grant_type: 'authorization_code',
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: code,
        client_secret: CLIENT_SECRET,
        });

    try {
      const res = await axios.post('https://kauth.kakao.com/oauth/token', payload);

      window.Kakao.init(REST_API_KEY); // Kakao Javascript SDK 초기화
      window.Kakao.Auth.setAccessToken(res.data.access_token); // access token 설정
      // 유저 정보 가져오기
      const userInfo = await window.Kakao.API.request({
        url: '/v2/user/me',
      });
      dispatch(loginSuccess({ id: userInfo.id, ...userInfo }));
      // 유저 정보 확인 후 페이지 이동
      navigate('/map');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return <div>로그인 진행중입니다..</div>;
}
