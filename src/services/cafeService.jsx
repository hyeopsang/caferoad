// services/cafeService.js
import { getCurrentLocation, getDistanceFromLatLonInKm } from '../utils/locationUtils';
import { setPlaces } from '../redux/placesSlice';
const { kakao } = window

export const searchCafesInArea = async (ps, map, center, dispatch) => {
  const myLocation = await getCurrentLocation();
  
  return new Promise((resolve, reject) => {
    ps.keywordSearch('카페', async (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const cafeData = data.filter(place =>
          place.category_group_code === 'CE7' || place.category_name.includes('카페')
        );
        
        const placesWithDistance = await Promise.all(cafeData.map(async (place) => {
          const targetLocation = new kakao.maps.LatLng(place.y, place.x);
          const distance = getDistanceFromLatLonInKm(
            myLocation.getLat(), myLocation.getLng(),
            targetLocation.getLat(), targetLocation.getLng()
          ) * 1000;
          return { ...place, distance };
        }));

        dispatch(setPlaces(placesWithDistance));
        resolve(placesWithDistance);
      } else {
        reject(new Error('카페 검색 실패'));
      }
    }, {
      location: center,
      radius: 1000,
      sort: kakao.maps.services.SortBy.DISTANCE
    });
  });
};
