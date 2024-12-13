import "../styles/PlaceReview.css";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ReviewWrite from "./ReviewWrite";
import { getReview } from "../components/ReviewFunction";

export default function PlaceReviewPage() {
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
    }, [id, places, writeModal]);
    
    if (!places || places.length === 0) {
        return <div>장소 데이터를 불러오는 중입니다...</div>;
    }

    const userReviews = myReview.filter(review => review.userId === userId);
    const otherReviews = myReview.filter(review => review.userId !== userId);

    const place = places[id];
    
    const averageReview = (category) => {
        const total = myReview.reduce((acc, review) => acc + review.content[category], 0);
        return myReview.length > 0 ? total / myReview.length : 0;
    };

    const changeColor = (category) => {
        const avg = averageReview(category);  
        if (avg > 1 && avg <= 1.66) {
            return '#fccbc7'; 
        } else if (avg > 1.66 && avg <= 2.33) {
            return '#deefc6';
        } else if (avg > 2.33 && avg <= 3) {
            return '#bdf3f3'; 
        }
        return '#ffffff'; 
    };

    return (
        <div className="PlaceReview">
            <div className="review_t">
                <Link to={"/map"}>
                    <button onClick={() => setWriteModal(false)}>
                        <img src={"./images/back.png"} alt="Back" />
                    </button>
                </Link>
                <h1>{place.place_name}</h1>
            </div>
            <p className="address">{place.address_name}</p>
            <div className="link">
               <a href={place.place_url}><div className="link"><img src={"./images/link.png"}/></div></a>
               {
                place.phone.length === 0 
                ? null
                : <a href={`tel:${place.phone}`}><div><img src={"./images/tel.png"} alt="전화 아이콘" /></div></a>
               }
                 
            </div>
            <div className="review_bar">
               <div className="taste" style={{backgroundColor:`${changeColor("taste")}`}}>맛</div>
               <div className="mood" style={{backgroundColor:`${changeColor("mood")}`}}>분위기</div>
               <div className="kind" style={{backgroundColor:`${changeColor("kind")}`}}>친절도</div>
               <div className="comfort" style={{backgroundColor:`${changeColor("comfort")}`}}>편안함</div>
               <div className="wifi" style={{backgroundColor:`${changeColor("wifi")}`}}>와이파이</div>
               <div className="parking" style={{backgroundColor:`${changeColor("parking")}`}}>주차공간</div>
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
