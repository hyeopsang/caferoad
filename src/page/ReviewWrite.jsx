import "../styles/ReviewWrite.css"
import soso from "../images/soso.png";
import good from "../images/good.png";
import bad from "../images/bad.png";
import back from "../images/back.png";
import { useState } from "react";
import { addReview } from "../components/ReviewFunction";
import { useSelector } from "react-redux";

export default function ReviewWrite({setWriteModal, placeId, placeName}){
    const [submitStatus, setSubmitStatus] = useState(null); 
    const [reviewText, setReviewText] = useState("");
    const auth = useSelector(state => state.auth);
    const userId = auth.user.id;

    const rating = {
        "bad": 1,
        "soso": 2,
        "good": 3
    };
    
    const [reviews, setReviews] = useState({
        taste: 0,
        mood: 0,
        kind: 0,
        comfort: 0,
        wifi: 0,
        parking: 0,
        text: "",
        placeName: placeName
    });
    const onChangeText = (e) => {
        setReviewText(e.target.value);
        handleRatingChange('text', e.target.value);
    }
    const handleRatingChange = (category, value) => {
        setReviews(prevReviews => ({
            ...prevReviews,
            [category]: value
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
        <div className="Review_Write">
            <div className="Write_t">
                <button className="close_Modal" onClick={() => setWriteModal(false)}>
                    <img src={back}/>
                </button>
                <h2>리뷰 작성</h2> 
            </div>
            <div>
                <h5>맛</h5>
                <div className="emoji" >
                    <div>
                        <div className="bad" onClick={() => handleRatingChange('taste', rating.bad)} style={reviews.taste === 1 ? {backgroundColor: "#fccbc7"} : {backgroundColor : "#fff"}}><img src={bad}/></div>
                        <p>별로에요</p>
                    </div>
                    <div>
                        <div className="soso" onClick={() => handleRatingChange('taste', rating.soso)} style={reviews.taste === 2 ? {backgroundColor: "#deefc6"} : {backgroundColor : "#fff"}}><img src={soso}/></div>
                        <p>보통이에요</p>
                    </div>
                    <div>
                        <div className="good" onClick={() => handleRatingChange('taste', rating.good)} style={reviews.taste === 3 ? {backgroundColor: "#bdf3f3"} : {backgroundColor : "#fff"}}><img src={good}/></div>
                        <p>맛있어요</p>
                    </div>
                </div>
                <h5>분위기</h5>
                <div className="emoji">
                    <div>
                        <div className="bad" onClick={() => handleRatingChange('mood', rating.bad)} style={reviews.mood === 1 ? {backgroundColor: "#fccbc7"} : {backgroundColor : "#fff"}}><img src={bad}/></div>
                        <p>별로에요</p>
                    </div>
                    <div>
                        <div className="soso" onClick={() => handleRatingChange('mood', rating.soso)} style={reviews.mood === 2 ? {backgroundColor: "#deefc6"} : {backgroundColor : "#fff"}}><img src={soso}/></div>
                        <p>보통이에요</p>
                    </div>
                    <div>
                        <div className="good" onClick={() => handleRatingChange('mood', rating.good)} style={reviews.mood === 3 ? {backgroundColor: "#bdf3f3"} : {backgroundColor : "#fff"}}><img src={good}/></div>
                        <p>좋아요</p>
                    </div>
                </div>
                <h5>친절도</h5>
                <div className="emoji">
                    <div>
                        <div className="bad" onClick={() => handleRatingChange('kind', rating.bad)} style={reviews.kind === 1 ? {backgroundColor: "#fccbc7"} : {backgroundColor : "#fff"}}><img src={bad}/></div>
                        <p>불친절해요</p>
                    </div>
                    <div>
                        <div className="soso" onClick={() => handleRatingChange('kind', rating.soso)} style={reviews.kind === 2 ? {backgroundColor: "#deefc6"} : {backgroundColor : "#fff"}}><img src={soso}/></div>
                        <p>보통이에요</p>
                    </div>
                    <div>
                        <div className="good" onClick={() => handleRatingChange('kind', rating.good)} style={reviews.kind === 3 ? {backgroundColor: "#bdf3f3"} : {backgroundColor : "#fff"}}><img src={good}/></div>
                        <p>친절해요</p>
                    </div>
                </div>
                <h5>좌석 편안함</h5>
                <div className="emoji">
                    <div>
                        <div className="bad" onClick={() => handleRatingChange('comfort', rating.bad)} style={reviews.comfort === 1 ? {backgroundColor: "#fccbc7"} : {backgroundColor : "#fff"}}><img src={bad}/></div>
                        <p>불편해요</p>
                    </div>
                    <div>
                        <div className="soso" onClick={() => handleRatingChange('comfort', rating.soso)} style={reviews.comfort === 2 ? {backgroundColor: "#deefc6"} : {backgroundColor : "#fff"}}><img src={soso}/></div>
                        <p>보통이에요</p>
                    </div>
                    <div>
                        <div className="good" onClick={() => handleRatingChange('comfort', rating.good)} style={reviews.comfort === 3 ? {backgroundColor: "#bdf3f3"} : {backgroundColor : "#fff"}}><img src={good}/></div>
                        <p>편안해요</p>
                    </div>
                </div>
                <h5>와이파이</h5>
                <div className="emoji">
                    <div>
                        <div className="bad" onClick={() => handleRatingChange('wifi', rating.bad)} style={reviews.wifi === 1 ? {backgroundColor: "#fccbc7"} : {backgroundColor : "#fff"}}><img src={bad}/></div>
                        <p>느려요</p>
                    </div>
                    <div>
                        <div className="soso" onClick={() => handleRatingChange('wifi', rating.soso)} style={reviews.wifi === 2 ? {backgroundColor: "#deefc6"} : {backgroundColor : "#fff"}}><img src={soso}/></div>
                        <p>적당해요</p>
                    </div>
                    <div>
                        <div className="good" onClick={() => handleRatingChange('wifi', rating.good)} style={reviews.wifi === 3 ? {backgroundColor: "#bdf3f3"} : {backgroundColor : "#fff"}}><img src={good}/></div>
                        <p>빵빵해요</p>
                    </div>
                </div>
                <h5>주차공간</h5>
                <div className="emoji">
                    <div>
                        <div className="bad" onClick={() => handleRatingChange('parking', rating.bad)} style={reviews.parking === 1 ? {backgroundColor: "#fccbc7"} : {backgroundColor : "#fff"}}><img src={bad}/></div>
                        <p>좁아요</p>
                    </div>
                    <div>
                        <div className="soso" onClick={() => handleRatingChange('parking', rating.soso)} style={reviews.parking === 2 ? {backgroundColor: "#deefc6"} : {backgroundColor : "#fff"}}><img src={soso}/></div>
                        <p>적당해요</p>
                    </div>
                    <div>
                        <div className="good" onClick={() => handleRatingChange('parking', rating.good)} style={reviews.parking === 3 ? {backgroundColor: "#bdf3f3"} : {backgroundColor : "#fff"}}><img src={good}/></div>
                        <p>여유로워요</p>
                    </div>
                </div>
                <div className="text_review">
                    <input type="text" value={reviewText} onChange={(e) => onChangeText(e)} minLength={3} maxLength={25} placeholder="한줄 리뷰"/>
                </div>
            </div>
            <button className="onSubmit" onClick={() => onSubmit()}>완료</button>
        </div>
    )
}
