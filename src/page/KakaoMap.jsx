import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefContext } from "../context/RefContext";
import { useCallback } from "react";
import { useKakaoMap } from "../hooks/useKakaoMap";
import { useMarkers } from "../hooks/useMarkers";
import {
  getCurrentLocation,
  getDistanceFromLatLonInKm,
} from "../utils/locationUtils";
import { setPlaces } from "../redux/placesSlice";
import SearchForm from "../components/SearchForm";
import CafeSwiper from "../components/CafeSwiper";
import Menu from "./Menu";
import "../styles/KakaoMap.css";

const { kakao } = window;

function KakaoMap() {
  const dispatch = useDispatch();
  const places = useSelector((state) => state.places);
  const imgs = useSelector((state) => state.imgs);
  const [menu, setMenu] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const [showReGps, setShowReGps] = useState(false);
  const { swiperRef } = useRefContext();
  const { map, ps } = useKakaoMap();
  const { markers, clearMarkers, addMarker } = useMarkers(map, swiperRef);

  useEffect(() => {
    if (map) {
      kakao.maps.event.addListener(map, "center_changed", () => {
        setShowReGps(true);
      });
      map.setLevel(1);
    }
  }, [map]);

  const displayCafeMarkers = async (cafeData) => {
    if (!map) return;

    const bounds = new kakao.maps.LatLngBounds();

    cafeData.forEach((place, index) => {
      const position = new kakao.maps.LatLng(place.y, place.x);
      bounds.extend(position);
      addMarker(position, place, index);
    });

    if (cafeData.length > 0) {
      map.setBounds(bounds);
    }
  };

  const performSearch = useCallback(async () => {
    if (!ps || !map) return;
    try {
      const myLocation = await getCurrentLocation();
      const keyword = searchTxt.trim();

      ps.keywordSearch(
        keyword,
        async (data, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const cafeData = data.filter(
              (place) =>
                place.category_group_code === "CE7" ||
                place.place_name.includes("카페"),
            );

            const placesWithDistance = await Promise.all(
              cafeData.map(async (place) => {
                const targetLocation = new kakao.maps.LatLng(place.y, place.x);
                const distance =
                  getDistanceFromLatLonInKm(
                    myLocation.getLat(),
                    myLocation.getLng(),
                    targetLocation.getLat(),
                    targetLocation.getLng(),
                  ) * 1000;
                return { ...place, distance };
              }),
            );

            dispatch(setPlaces(placesWithDistance));
            displayCafeMarkers(placesWithDistance);
          } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
          } else if (status === kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
          }
        },
        {
          location: map.getCenter(),
          sort: kakao.maps.services.SortBy.DISTANCE,
        },
      );
    } catch (error) {
      console.error("Search error:", error);
      alert("검색 중 오류가 발생했습니다.");
    }
  }, [
    dispatch,
    ps,
    map,
    displayCafeMarkers,
    getCurrentLocation,
    getDistanceFromLatLonInKm,
  ]);

  const handleSearch = async () => {
    await performSearch();
  };
  const searchCafesInBounds = async () => {
    setSearchTxt("");
    if (!map || !ps) return;
    clearMarkers();
    setShowReGps(false);
    const bounds = map.getBounds();
    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();

    const center = map.getCenter(); // 현재 지도의 중심 좌표를 사용

    ps.categorySearch(
      "CE7",
      async (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const cafeData = data.filter((place) => {
            const placePosition = new kakao.maps.LatLng(place.y, place.x);
            return bounds.contain(placePosition);
          });

          const placesWithDistance = await Promise.all(
            cafeData.map(async (place) => {
              const targetLocation = new kakao.maps.LatLng(place.y, place.x);
              const distance =
                getDistanceFromLatLonInKm(
                  center.getLat(),
                  center.getLng(),
                  targetLocation.getLat(),
                  targetLocation.getLng(),
                ) * 1000;
              return { ...place, distance };
            }),
          );
          dispatch(setPlaces(placesWithDistance));
          displayCafeMarkers(placesWithDistance);
        }
      },
      {
        bounds: new kakao.maps.LatLngBounds(swLatLng, neLatLng),
      },
    );
  };

  const handleReGpsSearch = () => {
    searchCafesInBounds();
    setShowReGps(false);
  };

  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const currentPos = new kakao.maps.LatLng(lat, lng);
          map.panTo(currentPos);
        },
        () => {
          alert("현재 위치를 가져오는 데 실패했습니다.");
        },
      );
    } else {
      alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
    }
  };

  return (
    <div className="relative mx-auto min-w-[375px] max-w-[428px] overflow-hidden">
      {menu && <Menu onMenu={setMenu} />}
      <div id="map" style={{ width: "100%", height: "100vh" }} />
      <SearchForm
        onSearch={handleSearch}
        searchTxt={searchTxt}
        setSearchTxt={setSearchTxt}
        onMenu={setMenu}
        dispatch={dispatch}
      />
      <CafeSwiper
        places={places}
        swiperRef={swiperRef}
        map={map}
        markers={markers}
      />
      <div
        className="absolute right-[30px] top-[180px] z-30 aspect-square w-[40px] rounded-[30px] bg-white shadow-md"
        id="centerOnMyLocation"
        onClick={moveToCurrentLocation}
      >
        <img src={"./images/gps.png"} alt="Center on my location" />
      </div>
      {showReGps && (
        <div className="reGps" onClick={handleReGpsSearch}>
          <p>현재 위치에서 검색</p>
        </div>
      )}
    </div>
  );
}

export default KakaoMap;
