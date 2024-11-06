import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { sendOtpToEmail, verifyOtpAndChangePassword } from "../../services/api";
import styles from "./Login.module.css";

const LoginForm = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      if (!isOtpSent) {
        try {
          const data = await sendOtpToEmail(email);
          toast.success(data.message);
          setIsOtpSent(true);
        } catch (error) {
          toast.error(error.message || "Failed to send OTP");
        }
      } else {
        if (newPassword !== confirmPassword) {
          return toast.error("Passwords do not match");
        }
        try {
          const data = await verifyOtpAndChangePassword(
            email,
            otp,
            newPassword
          );
          toast.success(data.message);
          setIsForgotPassword(false);
          setIsOtpSent(false);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
        } catch (error) {
          toast.error(error.message || "Failed to reset password");
        }
      }
    } else {
      try {
        const success = await login({ email, password });
        if (success) {
          closeModal();
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className={styles.logincontainer}>
      <h2 className={styles.logintitle}>
        {isForgotPassword ? "Reset Your Password" : "Login to Your Account"}
      </h2>
      <form onSubmit={handleSubmit} className={styles.loginform}>
        <div className={styles.formgroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {isForgotPassword ? (
          <>
            {isOtpSent && (
              <>
                <div className={styles.formgroup}>
                  <label htmlFor="otp">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formgroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formgroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <button type="submit" className={styles.loginbutton}>
              {isOtpSent ? "Change Password" : "Send OTP"}
            </button>
            <button
              type="button"
              className={styles.togglebutton}
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className={styles.formgroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.loginbutton}>
              Login
            </button>
            <button
              type="button"
              className={styles.forgotPasswordButton}
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
