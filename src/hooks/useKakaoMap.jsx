// hooks/useKakaoMap.js
import { useState, useEffect } from 'react';
import UserImg from "../images/gomgom.png";

const { kakao } = window;

export const useKakaoMap = () => {
  const [map, setMap] = useState(null);
  const [ps, setPs] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const mapContainer = document.getElementById('map');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const currentPos = new kakao.maps.LatLng(lat, lng);
          
          newMap.setCenter(currentPos);

          const markerImage = new kakao.maps.MarkerImage(
            UserImg,
            new kakao.maps.Size(35, 35),
            { offset: new kakao.maps.Point(20, 40) }
          );

          new kakao.maps.Marker({
            map: newMap,
            position: currentPos,
            title: "현재 위치",
            image: markerImage,
            zIndex: 999,
            clickable: true,
          });
        }, (error) => {
          console.error('현재 위치를 가져오는 데 실패했습니다:', error);
        });
      } else {
        console.error('이 브라우저에서는 Geolocation이 지원되지 않습니다.');
      }
      const defaultMapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 기본 위치 서울
        level: 6, 
      };

      const newMap = new kakao.maps.Map(mapContainer, defaultMapOption);
      const newPs = new kakao.maps.services.Places();
      setMap(newMap);
      setPs(newPs);

    };

    initializeMap();
  }, []);

  return { map, ps };
};
