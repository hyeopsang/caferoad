// CafeSwiper.js
import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from 'react-router-dom';
import { MapMarker } from 'react-kakao-maps-sdk';
const { kakao } = window;

const CafeSwiper = ({ places, swiperRef, map, lastClickedMarker, setLastClickedMarker }) => {
    
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
