import React, { useState } from "react";
import { followUser, unfollowUser } from "../../services/api";

const FollowButton = ({ userId, isFollowing, onFollowToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      onFollowToggle();
    } catch (error) {
      console.error("Error following/unfollowing user:", error); // Full error object

      if (error.response) {
        console.error("Response error data:", error.response.data);
        alert(error.response.data.message || "Server responded with an error.");
      } else if (error.request) {
        console.error("Request error - no response:", error.request);
        alert("No response received. Please check your network connection.");
      } else {
        console.error("Client error:", error.message);
        alert(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <button onClick={handleFollowToggle} disabled={loading}>
      {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
