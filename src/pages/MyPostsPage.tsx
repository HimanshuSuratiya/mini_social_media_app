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

const MyPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!currentUser) return;
      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(postsQuery);
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      }
    };

    fetchMyPosts();
  }, [currentUser]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        My Posts
      </Typography>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Container>
  );
};

export default MyPostsPage;
