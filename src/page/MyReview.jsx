import "../styles/MyReview.css";
import { Link } from "react-router-dom";
import { useUserReviews } from "../api/review";
import { useSelector } from "react-redux";

export default function MyReview() {
  const auth = useSelector((state) => state.auth);
  const userId = auth.user.id;

  const { data: reviews, isLoading, error } = useUserReviews(userId); // userId에 해당하는 리뷰만 가져오기
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reviews: {error.message}</div>;
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  return (
    <div className="min-w-[375px] max-w-[428px]">
      <Link to={"/map"}>
        <img src={"./images/back.png"} />
      </Link>
      <h2>내가 쓴 리뷰</h2>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id}>
            <p className="placeName">{review.content.placeName}</p>
            <p>{formatTimestamp(review.createdAt)}</p>
            <p>{review.content.text || "No text"}</p>
          </div>
        ))
      ) : (
        <div>작성된 리뷰가 없어요ㅠ</div>
      )}
    </div>
  );
}
