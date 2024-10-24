// hooks/useKakaoMap.js
import { useState, useEffect } from 'react';
import { getCurrentLocation } from '../utils/locationUtils';
import UserImg from "../images/gomgom.png";
import useMarkers from "../hooks/useMarkers";
const { kakao } = window;
export const useKakaoMap = () => {
  const [map, setMap] = useState(null);
  const [ps, setPs] = useState(null);

  useEffect(() => {
    const initializeMap = async () => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 1,
      };

      const newMap = new kakao.maps.Map(mapContainer, mapOption);
      const newPs = new kakao.maps.services.Places();
      
      setMap(newMap);
      setPs(newPs);

      try {
        const userLocation = await getCurrentLocation();
        newMap.setCenter(userLocation);
        
        const markerImage = new kakao.maps.MarkerImage(
          UserImg,
          new kakao.maps.Size(35, 35),
          { offset: new kakao.maps.Point(20, 40) }
        );

        new kakao.maps.Marker({
          map: newMap,
          position: userLocation,
          title: "현재 위치",
          image: markerImage,
          zIndex: 999,
          clickable: true,
        });
      } catch (error) {
        console.error('Failed to get user location:', error);
      }
    };
    initializeMap();
  }, []);

  return { map, ps };
};
