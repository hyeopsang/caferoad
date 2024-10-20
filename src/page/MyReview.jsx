import "../styles/MyReview.css";
import back from "../images/back.png";
import { Link } from "react-router-dom";
import { useUserReviews } from "../components/ReviewFunction";
import { useSelector } from "react-redux";

export default function MyReview() {
    const auth = useSelector(state => state.auth);
    const userId = auth.user.id; // Redux에서 userId 가져오기
  
    console.log("Current userId:", userId);

    const { data: reviews, isLoading, error } = useUserReviews(userId); // userId에 해당하는 리뷰만 가져오기
    console.log(reviews.Timestamp)

    //const formattedDate = new Date(timestamp * 1000).toLocaleString();
    console.log("useUserReviews result:", { reviews, isLoading, error });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading reviews: {error.message}</div>;

    return (
      <div className="MyReview">
        <Link to={"/map"}>
          <img src={back}/>
        </Link>
          <h2>내가 쓴 리뷰</h2>
        {
          reviews.length > 0 
          ? reviews.map((review) => (
            <div key={review.id}>
              <p className="placeName">{review.content.placeName}</p>
              <p>{review.content.text || 'No text'}</p>
            </div>
            ))
          : <div>작성된 리뷰가 없어요ㅠ</div>
        }
        
        
      </div>
    );
}
