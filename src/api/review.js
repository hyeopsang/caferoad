import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDocs,
  addDoc,
  deleteDoc,
  collection,
  doc,
  collectionGroup,
  query,
  where,
} from "firebase/firestore"; // Firestore 메서드 불러오기
import { db } from "../firebase-config";

export const useReviews = (placeId) => {
  return useQuery({
    queryKey: ["reviews", placeId],
    queryFn: () => getReview(placeId),
    enabled: !!placeId,
  });
};

export const getReview = async (placeId) => {
  const querySnapshot = await getDocs(
    collection(db, "reviews", placeId, "userReviews"),
  );
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addReview = async ({ placeId, content, userId }) => {
  await addDoc(collection(db, "reviews", placeId, "userReviews"), {
    content,
    createdAt: new Date(),
    userId,
  });
};

export const deleteReview = async ({ placeId, id }) => {
  await deleteDoc(doc(db, "reviews", placeId, "userReviews", id));
};

export const getUserReviews = async (userId) => {
  try {
    if (!userId) {
      console.error("No userId provided");
      return [];
    }

    const reviewsQuery = query(
      collectionGroup(db, "userReviews"),
      where("userId", "==", userId), // userId 필터링
    );

    const querySnapshot = await getDocs(reviewsQuery);

    const reviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      placeId: doc.ref.parent.parent.id,
      ...doc.data(),
    }));

    return reviews; // 해당 userId에 대한 모든 리뷰 반환
  } catch (error) {
    console.error("Error fetching user reviews: ", error);
    throw error;
  }
};
export const useUserReviews = (userId) => {
  return useQuery({
    queryKey: ["userReviews", userId],
    queryFn: () => getUserReviews(userId),
    enabled: !!userId,
  });
};
export const useMutationAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placeId, content, userId }) =>
      addReview({ placeId, content, userId }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.placeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userReviews", variables.userId],
      });
    },
    onError: (error) => {
      console.error(`Add Review Error: ${error}`);
    },
  });
};

export const useMutationDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ placeId, id, userId }) => deleteReview({ placeId, id }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.placeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userReviews", variables.userId],
      });
    },
    onError: (error) => {
      console.error(`Delete Review Error: ${error}`);
    },
  });
};
