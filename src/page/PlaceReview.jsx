import "../styles/PlaceReview.css";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import tel from "../images/tel.png";
import back from "../images/back.png";
import { useState, useEffect } from "react";
import ReviewWrite from "./ReviewWrite";
import { getReview } from "../components/ReviewFunction";
import link from "../images/link.png";

export default function PlaceReviewPage(props) {
    const [writeModal, setWriteModal] = useState(false);
    const [myReview, setMyReview] = useState([]);
    let { id } = useParams();
    id = parseInt(id, 10);
    const places = useSelector(state => state.places);
    const auth = useSelector(state => state.auth);
    const userId = auth.user.id;
    
    useEffect(() => {
        if (places[id]?.id) {
            getReview(places[id].id).then((reviews) => {
                setMyReview(reviews);
            });
        }
    }, [id, places]);
    
    if (!places || places.length === 0) {
        return <div>장소 데이터를 불러오는 중입니다...</div>;
    }

    const userReviews = myReview.filter(review => review.userId === userId);
    const otherReviews = myReview.filter(review => review.userId !== userId);

    const place = places[id];

    return (
        <div className="PlaceReview">
            <div className="review_t">
                <Link to={"/map"}>
                    <button onClick={() => setWriteModal(false)}>
                        <img src={back} alt="Back" />
                    </button>
                </Link>
                <h1>{place.place_name}</h1>
            </div>
            <p className="address">{place.address_name}</p>
            <div className="link">
               <a href={place.place_url}><div className="link"><img src={link}/></div></a>
               {
                place.phone.length === 0 
                ? null
                : <a href={`tel:${place.phone}`}><div><img src={tel} alt="전화 아이콘" /></div></a>
               }
                 
            </div>
            

            <div className="Review">
                
                    {userReviews.length > 0
                        ? 
                        <div className="My_Review"> 
                            <h5>내가 쓴 리뷰</h5>
                        {userReviews.map((review, id) => (
                        
                            <div key={id}>
                                <p>{review.content.text}</p>
                            </div>
                        
                        ))}
                        </div>
                        : <div className="review_link" onClick={() => setWriteModal(!writeModal)}>
                            <p>리뷰 작성</p>
                        </div>
                    }
                

                <h5>다른 사람이 쓴 리뷰</h5>
                <div className="Review_List">
                    {otherReviews.length > 0
                        ? otherReviews.map((review, index) => (
                            <div key={index}>
                                <p>{review.content.text}</p>
                            </div>
                        ))
                        : <p>등록된 리뷰가 없어요 ㅠ</p>
                    }
                </div>
            </div>
            {writeModal && <ReviewWrite setWriteModal={setWriteModal} placeId={place.id} placeName={place.place_name}/>}
        </div>
    );
}
