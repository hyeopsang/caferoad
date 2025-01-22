import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ReviewWrite from "./ReviewWrite";
import { getReview } from "../api/review";

export default function PlaceReviewPage() {
  const [writeModal, setWriteModal] = useState(false);
  const [myReview, setMyReview] = useState([]);
  let { id } = useParams();
  id = parseInt(id, 10);
  const places = useSelector((state) => state.places);
  const auth = useSelector((state) => state.auth);
  const userId = auth.user.id;

  useEffect(() => {
    if (places[id]?.id) {
      getReview(places[id].id).then((reviews) => {
        setMyReview(reviews);
      });
    }
  }, [id, places, writeModal]);

  if (!places || places.length === 0) {
    return <div>장소 데이터를 불러오는 중입니다...</div>;
  }

  const userReviews = myReview.filter((review) => review.userId === userId);
  const otherReviews = myReview.filter((review) => review.userId !== userId);

  const place = places[id];

  const averageReview = (category) => {
    const total = myReview.reduce(
      (acc, review) => acc + review.content[category],
      0,
    );
    return myReview.length > 0 ? total / myReview.length : 0;
  };

  const changeColor = (category) => {
    const avg = averageReview(category);
    if (avg > 1 && avg <= 1.66) {
      return "#fccbc7";
    } else if (avg > 1.66 && avg <= 2.33) {
      return "#deefc6";
    } else if (avg > 2.33 && avg <= 3) {
      return "#bdf3f3";
    }
    return "#ccc9c2";
  };

  return (
    <div className="mx-auto grid min-w-[375px] max-w-[428px] grid-cols-1 gap-[30px] bg-white pb-[60px] text-[#212121]">
      <Link to={"/map"}>
        <button
          className="aspect-square w-[50px] p-[10px]"
          onClick={() => setWriteModal(false)}
        >
          <img
            className="w-full object-cover"
            src={"/images/back.png"}
            alt="Back"
          />
        </button>
      </Link>
      <h1 className="text-center text-[22px] font-bold">{place.place_name}</h1>
      <p className="text-center text-[18px] font-medium">
        {place.address_name}
      </p>
      <div className="mx-auto flex w-fit gap-[15px]">
        <a href={place.place_url}>
          <div className="w-[50px] p-[10px]">
            <img src={"/images/link.png"} />
          </div>
        </a>
        {place.phone.length === 0 ? null : (
          <a href={`tel:${place.phone}`}>
            <div className="w-[50px] p-[10px]">
              <img src={"/images/tel.png"} alt="전화 아이콘" />
            </div>
          </a>
        )}
      </div>
      <div className="mx-auto grid w-full grid-cols-3 gap-[15px] px-[50px] text-[16px] font-bold text-[#212121]">
        <div
          className={`mx-auto flex aspect-square w-[100px] items-center justify-center rounded-taste`}
          style={{ backgroundColor: changeColor("taste") }}
        >
          맛
        </div>
        <div
          className={`mx-auto flex aspect-square w-[100px] items-center justify-center rounded-mood`}
          style={{ backgroundColor: changeColor("mood") }}
        >
          분위기
        </div>
        <div
          className={`mx-auto flex aspect-square w-[100px] items-center justify-center rounded-kind`}
          style={{ backgroundColor: changeColor("kind") }}
        >
          친절도
        </div>
        <div
          className={`mx-auto flex aspect-square w-[100px] items-center justify-center rounded-comfort`}
          style={{ backgroundColor: changeColor("comfort") }}
        >
          편안함
        </div>
        <div
          className={`mx-auto flex aspect-square w-[100px] items-center justify-center rounded-wifi`}
          style={{ backgroundColor: changeColor("wifi") }}
        >
          와이파이
        </div>
        <div
          className={`mx-auto flex aspect-square w-[100px] items-center justify-center rounded-parking`}
          style={{ backgroundColor: changeColor("parking") }}
        >
          주차공간
        </div>
      </div>
      <div className="flex w-full flex-col gap-[30px] px-[50px]">
        {userReviews.length > 0 ? (
          <div className="flex w-full flex-col gap-[15px] text-center">
            <h2 className="w-full text-[18px] font-bold">내가 쓴 리뷰</h2>
            {userReviews.map((review, id) => (
              <div
                className="w-full rounded-[15px] bg-[#fdf4d5] p-[15px] text-[16px] text-[#212121]"
                key={id}
              >
                <p>"{review.content.text}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="mx-auto cursor-pointer rounded-[15px] bg-[#212121] px-[15px] py-[10px] text-[16px] text-white"
            onClick={() => setWriteModal(!writeModal)}
          >
            <p>리뷰 작성</p>
          </div>
        )}

        <h5 className="w-full text-center text-[18px] font-bold">
          다른 사람이 쓴 리뷰
        </h5>
        <div className="w-full flex-col gap-[15px] rounded-[15px] bg-[#fdf4d5] p-[15px] text-center text-[16px] font-medium text-[#212121]">
          {otherReviews.length > 0 ? (
            otherReviews.map((review, index) => (
              <div key={index}>
                <p>"{review.content.text}"</p>
              </div>
            ))
          ) : (
            <p>등록된 리뷰가 없어요 ㅠ</p>
          )}
        </div>
      </div>
      {writeModal && (
        <ReviewWrite
          setWriteModal={setWriteModal}
          placeId={place.id}
          placeName={place.place_name}
        />
      )}
    </div>
  );
}
