// KakaoMap.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useKakaoMap } from '../hooks/useKakaoMap';
import { useMarkers } from '../hooks/useMarkers';
import { searchCafesInArea } from '../services/cafeService';
import SearchForm from '../components/SearchForm';
import CafeSwiper from '../components/CafeSwiper';
import Menu from './Menu';
import GPS from "../images/gps.png";
import '../styles/KakaoMap.css';

const { kakao } = window;

function KakaoMap() {
    const dispatch = useDispatch();
    const places = useSelector(state => state.places);
    const [menu, setMenu] = useState(false);
    const [searchTxt, setSearchTxt] = useState("");
    const [showReGps, setShowReGps] = useState(false);
    const swiperRef = useRef(null);
  
    const { map, ps } = useKakaoMap();
    const { markers, clearMarkers, addMarker, updateMarkers } = useMarkers(map, swiperRef);
  
    useEffect(() => {
        handleSearch();
        if (map) {
            kakao.maps.event.addListener(map, 'center_changed', () => {
                setShowReGps(true);
            });
        }
    }, [map]);

    const displayCafeMarkers = async (cafeData) => {
        if (!map) return;
    
        clearMarkers(); 
        const bounds = new kakao.maps.LatLngBounds();
    
        const newMarkers = cafeData.map((place, index) => {
            const position = new kakao.maps.LatLng(place.y, place.x);
            bounds.extend(position);
            return addMarker(position, place, index);
        });
    
        if (newMarkers.length > 0) {
            map.setBounds(bounds);
        }
    };
    

    const handleSearch = async () => {
        if (!ps || !map) return;
        
        try {
            const cafes = await searchCafesInArea(ps, map, map.getCenter(), dispatch);
            await displayCafeMarkers(cafes);
        } catch (error) {
            console.error('Search error:', error);
            alert('검색 중 오류가 발생했습니다.');
        }
    };

    const handleReGpsSearch = async () => {
        if (!ps || !map) return;
        
        try {
            const cafes = await searchCafesInArea(ps, map, map.getCenter(), dispatch);
            await displayCafeMarkers(cafes);
            setShowReGps(false);
        } catch (error) {
            console.error('ReGps search error:', error);
            alert('검색 중 오류가 발생했습니다.');
        }
    };

    const moveToCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const currentPos = new kakao.maps.LatLng(lat, lng);
                map.panTo(currentPos);
            }, () => {
                alert('현재 위치를 가져오는 데 실패했습니다.');
            });
        } else {
            alert('이 브라우저에서는 Geolocation이 지원되지 않습니다.');
        }
    };

    return (
        <div>
            {menu && <Menu onMenu={setMenu} />}
            <div id="map" style={{ width: '100%', height: '100vh' }} />
            <SearchForm 
                onSearch={handleSearch} 
                searchTxt={searchTxt} 
                setSearchTxt={setSearchTxt} 
                onMenu={setMenu}
            />
            <CafeSwiper places={places} swiperRef={swiperRef} map={map} markers={markers} /> {/* markers 전달 */}
            <div 
                id="centerOnMyLocation" 
                onClick={moveToCurrentLocation} // 클릭 시 내 위치로 이동
            >
                <img src={GPS} alt="Center on my location" />
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
