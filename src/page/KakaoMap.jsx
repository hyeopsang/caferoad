
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/swiper-bundle.css'; // Make sure to include Swiper styles
import "../styles/KakaoMap.css";
import { useDispatch, useSelector } from 'react-redux';
import { setPlaces } from '../redux/placesSlice';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import UserImg from "../images/gomgom.png";
import GPS from "../images/gps.png";
import CafeMarker from "../images/coffee.png";
import update from "../images/update.png";
import SearchForm from '../components/SearchForm';
import CafeSwiper from '../components/CafeSwiper';
import Menu from './Menu';
const { kakao } = window;


function KakaoMap() {
    const dispatch = useDispatch();
    const places = useSelector(state => state.places);
    const [menu, setMenu] = useState(false);
    const [map, setMap] = useState(null);
    const [ps, setPs] = useState(null);
    const [searchTxt, setSearchTxt] = useState("");
    const [showReGps, setShowReGps] = useState(false);
    const swiperRef = useRef(null);
    let markers = [];

    const onMenu = (isOpen) => {
        setMenu(isOpen);
    };

    useEffect(() => {
        var mapContainer = document.getElementById('map');
        var mapOption = {
            center: new kakao.maps.LatLng(37.566826, 126.9786567),
            level: 1,
        };
    
        const newMap = new kakao.maps.Map(mapContainer, mapOption);
        setMap(newMap);
    
        const newPs = new kakao.maps.services.Places();
        setPs(newPs);
        
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var locPosition = new kakao.maps.LatLng(lat, lon);
                newMap.setCenter(locPosition);
    
                var markerImage = new kakao.maps.MarkerImage(
                    UserImg,
                    new kakao.maps.Size(35, 35),
                    { offset: new kakao.maps.Point(20, 40) }
                );
    
                new kakao.maps.Marker({
                    map: newMap,
                    position: locPosition,
                    title: "현재 위치",
                    image: markerImage,
                    zIndex: 999,
                    clickable: true,
                });
                searchCafes(newPs, newMap, locPosition);
            });
        }
    
        kakao.maps.event.addListener(newMap, 'center_changed', () => {
            setShowReGps(true); 
        });
    
        document.getElementById('centerOnMyLocation').addEventListener('click', () => {
            centerMapOnMyLocation(newMap);
        });

    }, []);

    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    resolve(new kakao.maps.LatLng(userLat, userLng));
                }, reject);
            } else {
                alert('GPS를 사용할 수 없습니다.');
            }
        });
    };
    

    function setMarkers(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    const clearMarkers = useCallback(() => {
        setMarkers(null);
        markers = [];
    }, []);

    const getDistanceFromMyLocation = async (targetLocation) => {
        const myLocation = await getCurrentLocation(); // 사용자 위치 가져오기

        if (!myLocation || !targetLocation) return 0; // 위치 정보가 없으면 0 반환

        const distance = getDistanceFromLatLonInKm(
            myLocation.getLat(), myLocation.getLng(),
            targetLocation.getLat(), targetLocation.getLng()
        );

        return distance * 1000; 
    };

    const searchCafes = useCallback(async (ps, map, center) => {
        const myLocation = await getCurrentLocation(); // 현재 사용자 위치 가져오기
        ps.keywordSearch('카페', async (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                clearMarkers();
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
                displayCafeMarkers(placesWithDistance, map);
            }
        }, {
            location: center,
            radius: 1000,
            sort: kakao.maps.services.SortBy.DISTANCE
        });
    }, [dispatch, clearMarkers, getCurrentLocation, getDistanceFromLatLonInKm]);

    const searchCafesInBounds = async () => {
        setSearchTxt("");
        if (!map || !ps) return;
        clearMarkers();
        setShowReGps(false); 
        const bounds = map.getBounds();
        const swLatLng = bounds.getSouthWest();
        const neLatLng = bounds.getNorthEast();

        const myLocation = await getCurrentLocation(); // 현재 사용자 위치 가져오기

        ps.categorySearch('CE7', async (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const cafeData = data.filter(place => {
                    const placePosition = new kakao.maps.LatLng(place.y, place.x);
                    return bounds.contain(placePosition);
                });

                // 각 장소에 대한 거리 계산
                const placesWithDistance = await Promise.all(cafeData.map(async (place) => {
                    const targetLocation = new kakao.maps.LatLng(place.y, place.x);
                    const distance = getDistanceFromLatLonInKm(
                        myLocation.getLat(), myLocation.getLng(),
                        targetLocation.getLat(), targetLocation.getLng()
                    ) * 1000; // km를 m로 변환
                    return { ...place, distance };
                }));

                dispatch(setPlaces(placesWithDistance));
                displayCafeMarkers(placesWithDistance, map);
            }
        }, {
            bounds: new kakao.maps.LatLngBounds(swLatLng, neLatLng),
        });
    };


    const displayCafeMarkers = useCallback((cafeData, map) => {
        clearMarkers();
        const bounds = new kakao.maps.LatLngBounds();
        cafeData.forEach((place, index) => {
            const position = new kakao.maps.LatLng(place.y, place.x);
            const marker = addMarker(position, map, place, index); // place 객체를 전달
            bounds.extend(position);
            markers.push(marker);
        });
        map.setBounds(bounds);
    }, [clearMarkers]);
    
    function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }
        var R = 6371; // 지구의 반경 (km)
        var dLat = deg2rad(lat2-lat1);
        var dLon = deg2rad(lng2-lng1);
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // 거리 (km)
        return d;
    }
    
    
    const addMarker = (position, map, place, placeIndex) => { 
        var cafemarker = new kakao.maps.MarkerImage(
            CafeMarker,
            new kakao.maps.Size(25, 25),
            { offset: new kakao.maps.Point(20, 40) }
        );
    
        const marker = new kakao.maps.Marker({
            position: position,
            map: map,
            image: cafemarker,
            clickable: true,
        });
    
        marker.placeIndex = placeIndex; // 마커에 인덱스 저장
        
        var infowindow = new kakao.maps.InfoWindow({
            content: place.place_name // place 객체에서 이름 가져오기
        });
    
        kakao.maps.event.addListener(marker, 'mouseover', function () {
            infowindow.open(map, marker);
        });
    
        kakao.maps.event.addListener(marker, 'mouseout', function () {
            infowindow.close();
        });
    
        kakao.maps.event.addListener(marker, 'click', async function () {
            const targetLocation = new kakao.maps.LatLng(place.y, place.x);
            const distance = await getDistanceFromMyLocation(targetLocation);        
            infowindow.open(map, marker);
            map.setCenter(marker.getPosition());
            if (swiperRef.current) {
                swiperRef.current.slideTo(marker.placeIndex);
            }
        });
        
        return marker;
    };
    
    

    const centerMapOnMyLocation = (map) => {
        setSearchTxt("");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var locPosition = new kakao.maps.LatLng(lat, lon);
                map.setCenter(locPosition);
                setShowReGps(false);  // Hide the reGps button when centered on the user's location
            });
        } else {
            alert('GPS를 사용할 수 없습니다.');
        }
    };

    const searchPlaces = useCallback(async () => {
        if (!ps || !map) return;
        setMarkers(null);
        const myLocation = await getCurrentLocation(); // 현재 사용자 위치 가져오기
        var keyword = document.getElementById('keyword').value;
        ps.keywordSearch(keyword, async (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const cafeData = data.filter(place =>
                    place.category_group_code === 'CE7' || place.place_name.includes("카페")
                );
                
                // 각 장소에 대한 거리 계산
                const placesWithDistance = await Promise.all(cafeData.map(async (place) => {
                    const targetLocation = new kakao.maps.LatLng(place.y, place.x);
                    const distance = getDistanceFromLatLonInKm(
                        myLocation.getLat(), myLocation.getLng(),
                        targetLocation.getLat(), targetLocation.getLng()
                    ) * 1000; // km를 m로 변환
                    return { ...place, distance };
                }));
                
                dispatch(setPlaces(placesWithDistance));
            displayCafeMarkers(placesWithDistance, map);
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
            } else if (status === kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
            }
        }, {
            location: map.getCenter(),
            sort: kakao.maps.services.SortBy.DISTANCE,
        });
    }, [dispatch, ps, map, displayCafeMarkers, getCurrentLocation, getDistanceFromLatLonInKm]);
    console.log(menu)
    return (
        <div>
            {menu ? <Menu onMenu={onMenu} /> : null}
            <div id="map" style={{ width: '100%', height: '100vh' }}></div>
                    {/* <form id="search_form" onSubmit={(e) => { e.preventDefault(); searchPlaces(); }}>
                        <div className="myMenu">
                            <img src={menu}/>
                        </div>
                        <input type="text" id="keyword" size="15" value={searchTxt} onChange={onChangeTxt} placeholder="검색" />
                        <div className="search_cancel" style={{display: "none"}}>
                            <img src={Cancel} onClick={() => setSearchTxt("")} alt="Cancel" />
                        </div>
                        <button className="search_btn" type="submit" >
                            <img src={Search} alt="Search"/>
                        </button>
                    </form> */}
                    <SearchForm onSearch={searchPlaces} searchTxt={searchTxt} setSearchTxt={setSearchTxt} onMenu={onMenu}/>
                    {/* <div id="cafe_List">
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1.2}
                        centeredSlides={true}
                        loop={false}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onSlideChange={(swiper) => {
                            const activePlace = places[swiper.activeIndex]; 
                            if (activePlace) {
                                const newCenter = new kakao.maps.LatLng(activePlace.y, activePlace.x);
                                map.setCenter(newCenter);
                            }
                        }}
                    >
                        {places.map((place, id) => (
                            <SwiperSlide key={id}>
                                <div className="item" style={{ cursor: "default" }}>
                                    <Link to={`detail/${id}`}>
                                    <div className="info">
                                        <h5 className="placeName" onClick={() => window.open(place.place_url)}>
                                            {place.place_name}
                                        </h5>
                                        <p>{Number(place.distance).toFixed(2)} m</p>                                        {place.road_address_name ? (
                                            <div>
                                                <span>{place.road_address_name}</span>
                                                <span className="jibun gray">{place.address_name}</span>
                                            </div>
                                        ) : (
                                            <span>{place.address_name}</span>
                                        )}
                                    </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    </div> */}
            <CafeSwiper places={places} swiperRef={swiperRef} map={map}/>
            <div id="centerOnMyLocation"><img src={GPS} alt="Center on my location"/></div>
            <div
                className="reGps"
                style={{ display: showReGps ? "block" : "none" }}
                onClick={searchCafesInBounds}
            >
                <p style={{ display: showReGps ? "block" : "none" }} >현재 위치에서 검색</p>
            </div>
        </div>

    );
}

export default KakaoMap;
