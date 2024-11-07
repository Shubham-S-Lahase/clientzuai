import React, { useEffect, useState } from "react";
import FollowButton from "../followButton/FollowButton";
import { fetchSuggestedUsers } from "../../services/api"; 
import styles from "./Suggested.module.css"

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuggestedUsers = async () => {
      try {
        const users = await fetchSuggestedUsers();
        setSuggestedUsers(users);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestedUsers();
  }, []);

  const handleFollowToggle = (userId) => {
    setSuggestedUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  if (loading) return <p>Loading suggestions...</p>;

  return (
    <div className={styles.suggestedusers}>
      <h3>Suggested Users to Follow</h3>
      <ul>
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <li key={user._id} className={styles.suggesteduser}>
              <img
                src={user.profilePicture || "/default.jpg"}
                alt={`${user.username}'s profile`}
                className={styles.profilepicture}
              />
              <div className={styles.userinfo}>
                <p className={styles.username}>{user.username}</p>
                <FollowButton
                  userId={user._id}
                  isFollowing={user.isFollowing}
                  onFollowToggle={() => handleFollowToggle(user._id)}
                />
              </div>
            </li>
          ))
        ) : (
          <p>No suggested users at the moment.</p>
        )}
      </ul>
    </div>
  );
};

export default SuggestedUsers;
