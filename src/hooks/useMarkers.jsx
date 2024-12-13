import { useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getReview } from "../components/ReviewFunction";
import { useRefContext } from '../context/RefContext'; 
// 리뷰 상태에 따른 마커 이미지 설정
const MARKER_CONFIG = {
  WITH_REVIEW: {
    imageSrc: `${process.env.PUBLIC_URL}/images/coffee.png`,    // 리뷰 있는 카페 마커
    size: { width: 25, height: 25 },
  },
  NO_REVIEW: {
    imageSrc: `${process.env.PUBLIC_URL}/images/coffeeb.png`,   // 리뷰 없는 카페 마커
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
        
        const hasReview = Array.isArray(reviews) && reviews.length > 0;
        
        const markerImage = createMarkerImage(hasReview);
        
        const markerOptions = {
            position,
            image: markerImage,
            clickable: true,
        };

        const marker = new window.kakao.maps.Marker(markerOptions);
        marker.setMap(map);
        marker.placeIndex = placeIndex;

        window.kakao.maps.event.addListener(marker, 'click', () => {
            map.panTo(marker.getPosition());
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
}, [map, createMarkerImage, swiperRef]);

  

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

  useEffect(() => {
    if (places.length > 0) {
      updateMarkers();
    } else {
      clearMarkers();
    }
  }, [places, updateMarkers, clearMarkers]);

  return {
    markers: markersRef.current,
    clearMarkers,
    addMarker,
    updateMarkers
  };
};
