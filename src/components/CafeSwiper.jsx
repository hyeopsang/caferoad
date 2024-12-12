// CafeSwiper.js
import "../styles/CafeSwiper.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from 'react-router-dom';
const { kakao } = window;

const CafeSwiper = ({ places, swiperRef, map, markers }) => {
    const imgs = useSelector(state => state.imgs);
    const handleSlideChange = (swiper) => {
        const activePlace = places[swiper.activeIndex];

        if (activePlace) {
            const newCenter = new kakao.maps.LatLng(activePlace.y, activePlace.x);
            map.panTo(newCenter); 

            const marker = markers[activePlace.placeIndex]; 
            if (marker) {
                kakao.maps.event.trigger(marker, 'click'); 
            }
        }
    };
    return (
        <div id="cafe_List">
            <Swiper
                spaceBetween={20}
                slidesPerView={1.2}
                centeredSlides={true}
                loop={false}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={handleSlideChange} // 슬라이드 변경 시 이벤트 핸들러
            >
                {places.map((place, id) => (
                    <SwiperSlide key={id}>
                        <Link to={`detail/${id}`}>
                            <div className="item" style={{ cursor: "default" }}>
                                <div className="info">
                                    <h5 className="placeName">{place.place_name}</h5>
                                    <p className='distance'>{Number(place.distance).toFixed(2)} m</p>
                                    <p className='address'>{place.address_name}</p>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CafeSwiper;
