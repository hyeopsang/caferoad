import { useUserReviews } from "../components/ReviewFunction";
import { useSelector } from "react-redux";

export default function MyReview() {
    const auth = useSelector(state => state.auth);
    const userId = auth.user.id; // Redux에서 userId 가져오기
  
    console.log("Current userId:", userId);

    const { data: reviews, isLoading, error } = useUserReviews(userId); // userId에 해당하는 리뷰만 가져오기
    
    console.log("useUserReviews result:", { reviews, isLoading, error });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading reviews: {error.message}</div>;
    if (!reviews || reviews.length === 0) return <div>No reviews available</div>;

    return (
      <div className="My_Review">
        <h2>내가 쓴 리뷰</h2>
        {reviews.map((review) => (
          <div key={review.id}>
            <p>Place ID: {review.placeId}</p>
            <p>Comfort: {review.content.comfort || 'No data'}</p>
            <p>Wifi: {review.content.wifi || 'No data'}</p>
            <p>Kind: {review.content.kind || 'No data'}</p>
            <p>Taste: {review.content.taste || 'No data'}</p>
            <p>Mood: {review.content.mood || 'No data'}</p>
            <p>Parking: {review.content.parking || 'No data'}</p>
            <p>Review Text: {review.content.text || 'No text'}</p>
            <p>{review.rating ? `Rating: ${review.rating}` : 'No rating'}</p>
          </div>
        ))}
      </div>
    );
}
