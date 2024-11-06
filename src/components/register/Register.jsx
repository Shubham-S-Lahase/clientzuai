import styles from "./Register.module.css";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const RegisterForm = ({ closeModal }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();

  const validateInputs = () => {
    const errors = {};

    if (!username) errors.username = "Username is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Please enter a valid email";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsChecked(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const success = await register(formData);
      if (success) {
        setUserName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setProfilePicture(null);
        setIsChecked(false);
        toast.success("Registration successful!");
        closeModal();
      }
    } catch (error) {
      setErrors({ form: "Registration failed. Please try again." });
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className={styles.registercontainer}>
      <h2 className={styles.registertitle}>Create an Account</h2>
      <form className={styles.registerform} onSubmit={handleSubmit}>
        {errors.form && <p className={styles.error}>{errors.form}</p>}
        <div className={styles.formgroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id={styles.username}
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id={styles.email}
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id={styles.password}
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id={styles.confirmPassword}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>

        <div
          id={styles.buttonwrapper}
          className={`${styles.buttonWrapper} ${
            isChecked ? styles.checked : ""
          }`}
        >
          <button
            type="submit"
            className={`${styles.registerbutton} ${styles.submit}`}
          >
            Register
          </button>
          <div className={styles.loaderWrapper}>
            <span className={`${styles.loader} ${styles.yellow}`}></span>
            <span className={`${styles.loader} ${styles.pink}`}></span>
          </div>
          <span className={`${styles.loader} ${styles.orange}`}></span>

          <div className={styles.checkWrapper}>
            <svg
              version="1.1"
              width="65px"
              height="38px"
              viewBox="0 0 64.5 37.4"
            >
              <polyline
                className={styles.check}
                points="5,13 21.8,32.4 59.5,5 "
              />
            </svg>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
