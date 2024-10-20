import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import CommentSection from "./CommentSection";

interface Post {
  id: string;
  imageUrl: string;
  username: string;
  likes: string[];
  comments: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  console.log(post, "ab post");
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(
    post.likes.includes(currentUser?.uid || "")
  );
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (!currentUser) return;
    const postRef = doc(db, "posts", post.id);
    if (liked) {
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid),
      });
    }
    setLiked(!liked);
  };

  const handleSave = () => {
    if (!currentUser) return;
    setSaved(!saved);
    // Implement save functionality
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  return (
    <Card sx={{ maxWidth: 500, mb: 2 }}>
      <CardHeader
        avatar={<Avatar>{post.username[0]}</Avatar>}
        title={post.username}
      />
      <CardMedia
        component="img"
        height="300"
        image={post.imageUrl}
        alt="Post image"
      />
      <CardActions disableSpacing>
        <IconButton
          aria-label="like"
          onClick={handleLike}
          disabled={!currentUser}
        >
          {liked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography>{post.likes.length}</Typography>
        <IconButton
          aria-label="comment"
          onClick={handleCommentClick}
          disabled={!currentUser}
        >
          <ChatBubbleOutline />
        </IconButton>
        <Typography>{post.comments}</Typography>
        <IconButton
          aria-label="save"
          onClick={handleSave}
          disabled={!currentUser}
        >
          {saved ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </CardActions>
      {showComments && <CommentSection postId={post.id} />}
    </Card>
  );
};

export default PostCard;
