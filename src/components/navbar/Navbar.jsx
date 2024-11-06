import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import Modal from "../Modal/Modal";
import RegisterForm from "../register/Register";
import LoginForm from "../login/Login";
import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ scrolled }) => {
  const { user, logout } = useAuth();
  // console.log(user);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`${styles.container} ${scrolled ? styles.containerup : ""}`}
    >
      <div className={styles.logoContainer}>
        <img
          src="/logo.svg"
          alt="logo"
          onClick={() => (window.location.href = "/")}
        />
      </div>

      {user ? (
        <div className={styles.menus2}>
          <img
            src={user.profilePicture || "/default.jpg"}
            alt="profile"
            className={styles.profilePic}
            onClick={handleProfileClick}
          />
          <span id={styles.username}>{user.username}</span>
          <img src="/logout.svg" alt="logout" onClick={logout} />
          <button className={styles.themeToggleBtn} onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      ) : (
        <div className={styles.menus}>
          <div id={styles.loginBtn} onClick={() => setIsLoginOpen(true)}>
            Login
          </div>
          <div id={styles.joinBtn} onClick={() => setIsRegisterOpen(true)}>
            Join Now
          </div>
        </div>
      )}

      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm closeModal={() => setIsLoginOpen(false)} />
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <RegisterForm closeModal={() => setIsRegisterOpen(false)} />
      </Modal>
    </div>
  );
};

export default Navbar;
