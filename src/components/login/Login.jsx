import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Login.module.css";
import { toast } from "react-toastify";

const LoginForm = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await login({ email, password });

      if (success) {
        toast.success("Login successful!");
        closeModal();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={styles.logincontainer}>
      <h2 className={styles.logintitle}>Login to Your Account</h2>
      <form onSubmit={handleSubmit} className={styles.loginform}>
        <div className={styles.formgroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your username or email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formgroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.loginbutton}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
