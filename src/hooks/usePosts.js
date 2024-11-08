import { useState, useEffect, useCallback } from "react";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://serverzuai.onrender.com/api/posts");
      // const response = await fetch("http://localhost:5000/api/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refreshPosts };
};
