import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Comment {
  id: string;
  text: string;
  username: string;
  createdAt: Date;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        postId,
        text: newComment,
        username: currentUser.displayName,
        createdAt: new Date(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText primary={comment.username} secondary={comment.text} />
          </ListItem>
        ))}
      </List>
      {currentUser && (
        <form onSubmit={handleAddComment}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Post
          </Button>
        </form>
      )}
      {!currentUser && (
        <Typography variant="body2" color="text.secondary">
          Please log in to comment.
        </Typography>
      )}
    </div>
  );
};

export default CommentSection;
