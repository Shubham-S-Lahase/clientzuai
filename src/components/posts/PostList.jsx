import styles from "./PostList.module.css";
import { usePosts } from "../../hooks/usePosts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import moment from "moment";

const PostList = () => {
  const { posts } = usePosts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // console.log(posts);

  const handlePostClick = (postId) => {
    if (isAuthenticated) {
      navigate(`/post/${postId}`);
    } else {
      alert("You must log in to view this post.");
    }
  };

  return (
    <div className={styles.container}>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className={styles.post}
            onClick={() => handlePostClick(post._id)}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className={styles.postImage}
            />
            <div className={styles.ctnCont}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postAuthor}>
                {post.author?.username} - {moment(post.createdAt).fromNow()}
              </p>
              <p className={styles.postContent}>
                {post.content.length > 500
                  ? `${post.content.substring(0, 500)}...`
                  : post.content}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
