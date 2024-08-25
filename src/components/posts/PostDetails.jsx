import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPostById,
  fetchCommentsForPost,
  addComment,
  editComment,
  deleteComment,
} from "../../services/api";
import styles from "./PostDetails.module.css";
import moment from "moment";
import { useAuth } from "../../hooks/useAuth";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getPostData = async () => {
      try {
        const fetchedPost = await fetchPostById(id);
        const fetchedComments = await fetchCommentsForPost(id);
        setPost(fetchedPost);
        setComments(fetchedComments);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    getPostData();
  }, [id]);

  // console.log(post);

  const handleAddComment = async () => {
    try {
      const addedComment = await addComment(id, { content: newComment });
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const updatedComment = await editComment(commentId, {
        content: editContent,
      });
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
      setEditMode(null);
      setEditContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className={styles.postDetail}>
      <h1 className={styles.postTitle}>{post.title}</h1>
      <img src={post.imageUrl} alt={post.title} className={styles.postImage} />
      <p className={styles.postAuthor}>
        {post.author.username} - {moment(post.createdAt).fromNow()}
      </p>
      <p className={styles.postContent}>{post.content}</p>

      <div className={styles.commentsSection}>
        <h3>Comments</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              {/* {console.log("Comment object:", comment)} */}
              {editMode === comment._id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your comment"
                  ></textarea>
                  <button onClick={() => handleEditComment(comment._id)}>
                    Save
                  </button>
                  <button onClick={() => setEditMode(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{comment.content}</p>
                  {/* {console.log("Comment Author: ", comment.user.username)}
                  {console.log("Current User: ", user.username)} */}
                  {user && comment.user.username === user.userName && (
                    <>
                      <button
                        onClick={() => {
                          setEditMode(comment._id);
                          setEditContent(comment.content);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        ></textarea>
        <button onClick={handleAddComment}>Submit</button>
      </div>
    </div>
  );
};

export default PostDetail;
