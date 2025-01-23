import "../styles/ReviewWrite.css";
import { useState } from "react";
import { addReview } from "../api/review";
import { useSelector } from "react-redux";

export default function ReviewWrite({ setWriteModal, placeId, placeName }) {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const auth = useSelector((state) => state.auth);
  const userId = auth.user.id;

  const rating = {
    bad: 1,
    soso: 2,
    good: 3,
  };

  const [reviews, setReviews] = useState({
    taste: 0,
    mood: 0,
    kind: 0,
    comfort: 0,
    wifi: 0,
    parking: 0,
    text: "",
    placeName: placeName,
  });
  const onChangeText = (e) => {
    setReviewText(e.target.value);
    handleRatingChange("text", e.target.value);
  };
  const handleRatingChange = (category, value) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [category]: value,
    }));
  };
  const onSubmit = async () => {
    try {
      await addReview({ placeId, content: reviews, userId: userId });
      setSubmitStatus("success");
      alert("리뷰 작성이 완료되었습니다.");
      setWriteModal(false);
    } catch (error) {
      setSubmitStatus("error");
      alert("리뷰 작성에 실패하였습니다.");
      console.error("리뷰 작성에 실패했습니다:", error);
    }
  };
  return (
    <div className="absolute left-1/2 top-[15px] flex w-[320px] -translate-x-1/2 flex-col rounded-[15px] bg-white/90 pb-[15px] text-center shadow-md h-svh">
      <div className="flex w-full justify-end">
        <button className="p-[15px]" onClick={() => setWriteModal(false)}>
          <img className="w-[20px]" src={"/images/close.png"} />
        </button>
      </div>
      <div className="flex flex-col gap-[10px] px-[15px]">
        <h5>맛</h5>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("taste", rating.bad)}
              style={
                reviews.taste === 1
                  ? { backgroundColor: "#fccbc7" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/bad.png"} />
            </div>
            <p>별로에요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("taste", rating.soso)}
              style={
                reviews.taste === 2
                  ? { backgroundColor: "#deefc6" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/soso.png"} />
            </div>
            <p>보통이에요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("taste", rating.good)}
              style={
                reviews.taste === 3
                  ? { backgroundColor: "#bdf3f3" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/good.png"} />
            </div>
            <p>맛있어요</p>
          </div>
        </div>
        <h5>분위기</h5>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("mood", rating.bad)}
              style={
                reviews.mood === 1
                  ? { backgroundColor: "#fccbc7" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/bad.png"} />
            </div>
            <p>별로에요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("mood", rating.soso)}
              style={
                reviews.mood === 2
                  ? { backgroundColor: "#deefc6" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/soso.png"} />
            </div>
            <p>보통이에요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("mood", rating.good)}
              style={
                reviews.mood === 3
                  ? { backgroundColor: "#bdf3f3" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/good.png"} />
            </div>
            <p>좋아요</p>
          </div>
        </div>
        <h5>친절도</h5>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("kind", rating.bad)}
              style={
                reviews.kind === 1
                  ? { backgroundColor: "#fccbc7" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/bad.png"} />
            </div>
            <p>불친절해요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("kind", rating.soso)}
              style={
                reviews.kind === 2
                  ? { backgroundColor: "#deefc6" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/soso.png"} />
            </div>
            <p>보통이에요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("kind", rating.good)}
              style={
                reviews.kind === 3
                  ? { backgroundColor: "#bdf3f3" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/good.png"} />
            </div>
            <p>친절해요</p>
          </div>
        </div>
        <h5>좌석 편안함</h5>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("comfort", rating.bad)}
              style={
                reviews.comfort === 1
                  ? { backgroundColor: "#fccbc7" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/bad.png"} />
            </div>
            <p>불편해요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("comfort", rating.soso)}
              style={
                reviews.comfort === 2
                  ? { backgroundColor: "#deefc6" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/soso.png"} />
            </div>
            <p>보통이에요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("comfort", rating.good)}
              style={
                reviews.comfort === 3
                  ? { backgroundColor: "#bdf3f3" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/good.png"} />
            </div>
            <p>편안해요</p>
          </div>
        </div>
        <h5>와이파이</h5>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("wifi", rating.bad)}
              style={
                reviews.wifi === 1
                  ? { backgroundColor: "#fccbc7" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/bad.png"} />
            </div>
            <p>느려요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("wifi", rating.soso)}
              style={
                reviews.wifi === 2
                  ? { backgroundColor: "#deefc6" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/soso.png"} />
            </div>
            <p>적당해요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("wifi", rating.good)}
              style={
                reviews.wifi === 3
                  ? { backgroundColor: "#bdf3f3" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/good.png"} />
            </div>
            <p>빵빵해요</p>
          </div>
        </div>
        <h5>주차공간</h5>
        <div className="grid grid-cols-3">
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("parking", rating.bad)}
              style={
                reviews.parking === 1
                  ? { backgroundColor: "#fccbc7" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/bad.png"} />
            </div>
            <p>좁아요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("parking", rating.soso)}
              style={
                reviews.parking === 2
                  ? { backgroundColor: "#deefc6" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/soso.png"} />
            </div>
            <p>적당해요</p>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <div
              className="aspect-square w-[40px] overflow-hidden rounded-[50px]"
              onClick={() => handleRatingChange("parking", rating.good)}
              style={
                reviews.parking === 3
                  ? { backgroundColor: "#bdf3f3" }
                  : { backgroundColor: "#fff" }
              }
            >
              <img src={"/images/good.png"} />
            </div>
            <p>여유로워요</p>
          </div>
        </div>
        <div className="text_review">
          <input
            type="text"
            value={reviewText}
            onChange={(e) => onChangeText(e)}
            minLength={3}
            maxLength={25}
            placeholder="한줄 리뷰"
          />
        </div>
      </div>
      <button className="text-[18px] text-[#212121]" onClick={() => onSubmit()}>
        완료
      </button>
    </div>
  );
}
