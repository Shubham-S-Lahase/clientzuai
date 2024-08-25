import { useState } from "react";
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

  return (
    <div
      className={`${styles.container} ${scrolled ? styles.containerup : ""}`}
    >
      <div className={styles.logoContainer}>
        <img src="/logo.svg" alt="logo" />
      </div>
      {user ? (
        <div className={styles.menus2}>
          <span id={styles.username}>{user.userName}</span>
          <img src="/logout.svg" alt="logout" onClick={logout} />
        </div>
      ) : (
        <div className={styles.menus}>
          <div id={styles.loginBtn} onClick={() => setIsLoginOpen(true)}>Login</div>
          <div id={styles.joinBtn} onClick={() => setIsRegisterOpen(true)}>Join Now</div>
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
