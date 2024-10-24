import { useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getReview } from "../components/ReviewFunction";
import { useRefContext } from '../context/RefContext'; 
import blackMarker from "../images/coffeeb.png";
import colorMarker from "../images/coffee.png";
// 리뷰 상태에 따른 마커 이미지 설정
const MARKER_CONFIG = {
  WITH_REVIEW: {
    imageSrc: colorMarker,    // 리뷰 있는 카페 마커
    size: { width: 25, height: 25 },
  },
  NO_REVIEW: {
    imageSrc: blackMarker,   // 리뷰 없는 카페 마커
    size: { width: 25, height: 25 },
  }
};

export const useMarkers = (map) => {
  const markersRef = useRef([]);
  const places = useSelector(state => state.places);
  const { swiperRef } = useRefContext();

  const createMarkerImage = useCallback((hasReview) => {
    const config = hasReview ? MARKER_CONFIG.WITH_REVIEW : MARKER_CONFIG.NO_REVIEW;
    
    return new window.kakao.maps.MarkerImage(
      config.imageSrc,
      new window.kakao.maps.Size(config.size.width, config.size.height),
      {
        offset: new window.kakao.maps.Point(
          config.size.width / 2,
          config.size.height / 2
        )
      }
    );
  }, []);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  const addMarker = useCallback(async (position, place, placeIndex) => {
    if (!map) return null;
  
    try {
      const reviews = await getReview(place.id);
      console.log(`Fetched reviews for place ${place.id}:`, reviews);
      
      const hasReview = Array.isArray(reviews) && reviews.length > 0;
  
      const markerImage = createMarkerImage(hasReview);
  
      const marker = new window.kakao.maps.Marker({
        position,
        image: markerImage,
        clickable: true,
      });
  
      marker.setMap(map);
      marker.placeIndex = placeIndex;
  
      window.kakao.maps.event.addListener(marker, 'click', () => {
        map.panTo(marker.getPosition());
        console.log(`Clicked marker for place ${place.id} - Has reviews: ${hasReview}`);
        if (swiperRef.current) {
          swiperRef.current.slideTo(marker.placeIndex);
        }
      });
  
      markersRef.current.push(marker);
      return marker;
    } catch (error) {
      console.error(`Error creating marker for place ${place.id}:`, error);
      return null;
    }
  }, [map, createMarkerImage]);
  

  const updateMarkers = useCallback(async () => {
    try {
      clearMarkers();

      const markerPromises = places.map(async (place, index) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x);
        return addMarker(position, place, index);
      });

      await Promise.all(markerPromises);
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [clearMarkers, addMarker, places]);

  return {
    markers: markersRef.current,
    clearMarkers,
    addMarker,
    updateMarkers
  };
};
