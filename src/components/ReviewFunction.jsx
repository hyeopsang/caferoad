import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocs, addDoc, deleteDoc, collection, doc, collectionGroup, query, where } from "firebase/firestore"; // Firestore 메서드 불러오기
import { db } from "../firebase-config"; // Firebase 설정에서 Firestore 가져오기

export const useReviews = (placeId) => {
  return useQuery({
    queryKey: ['reviews', placeId],
    queryFn: () => getReview(placeId),
    enabled: !!placeId, // placeId가 존재할 때만 쿼리 실행
  });
};

export const getReview = async (placeId) => {
  const querySnapshot = await getDocs(collection(db, 'reviews', placeId, 'userReviews'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addReview = async ({ placeId, content, userId }) => {
  await addDoc(collection(db, 'reviews', placeId, 'userReviews'), {
    content,
    createdAt: new Date(),
    userId,
  });
};

export const deleteReview = async ({ placeId, id }) => {
  await deleteDoc(doc(db, 'reviews', placeId, 'userReviews', id));
};

export const getUserReviews = async (userId) => {
  try {
    if (!userId) {
      console.error("No userId provided");
      return [];
    }

    // 특정 userId에 대한 리뷰만 가져오는 쿼리
    const reviewsQuery = query(
      collectionGroup(db, 'userReviews'),
      where('userId', '==', userId) // userId 필터링
    );
    
    // 쿼리 실행
    const querySnapshot = await getDocs(reviewsQuery);
    
    // 각 문서에서 데이터 추출
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id, // 리뷰 문서의 ID
      placeId: doc.ref.parent.parent.id, // 부모 문서의 placeId
      ...doc.data(), // 리뷰 데이터
    }));

    console.log("Total reviews found for userId:", reviews.length);
    return reviews; // 해당 userId에 대한 모든 리뷰 반환
  } catch (error) {
    console.error("Error fetching user reviews: ", error);
    throw error; // 에러 발생 시 상위 컴포넌트에서 처리
  }
};
export const useUserReviews = (userId) => {
  return useQuery({
    queryKey: ['userReviews', userId], // userId별로 캐싱
    queryFn: () => getUserReviews(userId), // userId에 해당하는 리뷰만 가져오기
    enabled: !!userId, // userId가 존재할 때만 쿼리 실행
  });
};
export const useMutationAddReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ placeId, content, userId }) => addReview({ placeId, content, userId }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.placeId] });
      queryClient.invalidateQueries({ queryKey: ['userReviews', variables.userId] });
    },
    onError: (error) => {
      console.log(`Add Review Error: ${error}`);
    },
  });
};

export const useMutationDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placeId, id, userId }) => deleteReview({ placeId, id }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.placeId] });
      queryClient.invalidateQueries({ queryKey: ['userReviews', variables.userId] });
    },
    onError: (error) => {
      console.log(`Delete Review Error: ${error}`);
    },
  });
};
