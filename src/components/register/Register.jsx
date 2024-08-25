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
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const success = await register({ username, email, password });

      if (success) {
        setIsChecked(true);
        setTimeout(() => {
          setUserName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setIsChecked(false);
          toast.success("Registration successful!")
          closeModal();
        }, 8000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className={styles.registercontainer}>
      <h2 className={styles.registertitle}>Create an Account</h2>
      <form className={styles.registerform} onSubmit={handleSubmit}>
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
