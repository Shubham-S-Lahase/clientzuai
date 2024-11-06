import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import {
  sendOtpToEmail,
  verifyOtpAndChangePassword,
  updateProfilePicture,
} from "../../services/api";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const data = await verifyOtpAndChangePassword(user.email, otp, newPassword);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || "An error occurred while updating the password.");
      console.error(error);
    }
  };

  const handleProfilePictureChange = async (e) => {
    if (!profilePicture) {
      return toast.error("Please select a profile picture first.");
    }

    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    formData.append("userId", user._id);

    try {
      const data = await updateProfilePicture(formData);
      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      toast.error(error.message || "An error occurred while updating the profile picture.");
      console.error(error);
    }
  };

  const sendOtp = async () => {
    try {
      const data = await sendOtpToEmail(user.email);
      toast.success(data.message);
      setIsOtpSent(true);
      setResendCooldown(30); // 30 seconds cooldown
    } catch (error) {
      toast.error(error.message || "An error occurred while sending OTP.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="loadercont">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <h2>Profile Page</h2>
      <div className={styles.profileInfo}>
        <img
          src={user.profilePicture || "/default.jpg"}
          alt="Profile"
          className={styles.profilePic}
        />
        <h3>{user.username}</h3>
        <p>{user.email}</p>
      </div>

      <div className={styles.changeProfilePicture}>
        <h4>Change Profile Picture</h4>
        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
        <button onClick={handleProfilePictureChange} disabled={loading}>
          {loading ? "Updating..." : "Update Profile Picture"}
        </button>
      </div>

      <div className={styles.changePassword}>
        <h4>Change Password</h4>
        {!isOtpSent ? (
          <button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP to Email"}
          </button>
        ) : (
          <div className={styles.pwd}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange} disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
            <button
              onClick={sendOtp}
              disabled={resendCooldown > 0 || loading}
              className={styles.resendOtp}
            >
              {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
