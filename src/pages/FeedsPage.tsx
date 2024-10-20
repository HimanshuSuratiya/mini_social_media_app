import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";
import InfiniteScroll from "react-infinite-scroll-component";

interface Post {
  id: string;
  imageUrl: string;
  username: string;
  likes: number;
  comments: number;
}

const FeedsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(postsQuery);
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetchedPosts);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchMorePosts = async () => {
    if (!lastVisible) return;
    try {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(10)
      );
      const snapshot = await getDocs(postsQuery);
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts([...posts, ...fetchedPosts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      if (snapshot.empty) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Feeds
      </Typography>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You have seen all posts</b>
          </p>
        }
      >
        {[
          {
            id: "123",
            imageUrl:
              "https://images.pexels.com/photos/28824456/pexels-photo-28824456/free-photo-of-woman-in-white-shirt-looking-out-from-glass-door.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            username: "Beautiful Girl",
            likes: [1, 2, 3, 87, 3, 3, 2, 2, 1, 8, 4, 2, 3],
            comments: 25,
          },
          {
            id: "124",
            imageUrl:
              "https://images.pexels.com/photos/26898886/pexels-photo-26898886/free-photo-of-people-sitting-outdoors.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
            username: "Beautiful Home",
            likes: [1, 2, 3, 87, 3, 3, 2, 2, 1],
            comments: 51,
          },
        ].map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {/* {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))} */}
      </InfiniteScroll>
    </Container>
  );
};

export default FeedsPage;
