// CafeSwiper.js
import "../styles/CafeSwiper.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
const { kakao } = window;

const CafeSwiper = ({ places, swiperRef, map, markers }) => {
  const handleSlideChange = (swiper) => {
    const activePlace = places[swiper.activeIndex];

    if (activePlace) {
      const newCenter = new kakao.maps.LatLng(activePlace.y, activePlace.x);
      map.panTo(newCenter);

      const marker = markers[activePlace.placeIndex];
      if (marker) {
        kakao.maps.event.trigger(marker, "click");
      }
    }
  };
  return (
    <div className="fixed bottom-[15px] z-10 min-w-[375px] max-w-[428px] text-[#212121]">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        loop={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
      >
        {places.map((place, id) => (
          <SwiperSlide key={id}>
            <Link to={`detail/${id}`}>
              <div
                className="mx-auto w-[calc(100%-60px)] rounded-[15px] bg-white p-[15px] shadow-md"
                style={{ cursor: "default" }}
              >
                <div className="flex flex-col gap-[10px] text-[16px] font-medium">
                  <h5 className="text-[18px] font-bold">{place.place_name}</h5>
                  <p className="distance">
                    {Number(place.distance).toFixed(2)} m
                  </p>
                  <p className="address">{place.address_name}</p>
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
