import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";

interface Post {
  id: string;
  imageUrl: string;
  username: string;
  likes: string[];
  comments: number;
}

const SavedPostsPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!currentUser) return;
      try {
        const savedPostsQuery = query(
          collection(db, "savedPosts"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(savedPostsQuery);
        const savedPostIds = snapshot.docs.map((doc) => doc.data().postId);

        const postsQuery = query(
          collection(db, "posts"),
          where("id", "in", savedPostIds)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const fetchedPosts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setSavedPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, [currentUser]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Saved Posts
      </Typography>
      {savedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Container>
  );
};

export default SavedPostsPage;
