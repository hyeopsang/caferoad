import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import KakaoMap from './page/KakaoMap';
import MyPage from "./page/MyPage";
import PlaceReviewPage from './page/PlaceReview';
import ReviewWrite from './page/ReviewWrite';
import Auth from './page/Auth';
import Login from './page/Login';
import MyReview from './page/MyReview';
const RouterInfo = [
    {
      path: '/',
      children: [
        {
          index: true,
          element: <Login/>
        },
        {
          path: '/map',
          element: <KakaoMap />
        },
        {
          path: "/myreview",
          element: <MyReview/>
        },
        {
          path: "/auth/kakao/callback",
          element: <Auth/>
        },
        {
          path: 'mypage',
          element: <ProtectedRoute><MyPage /></ProtectedRoute>
        },
        {
          path: "/map/detail/:id" ,
          element: <PlaceReviewPage/>
        },
        {
          path: "/map/review-write",
          element: <ReviewWrite/>
        }
      ]
    }
  ];
  
  export const AppRouter = createBrowserRouter(RouterInfo);
