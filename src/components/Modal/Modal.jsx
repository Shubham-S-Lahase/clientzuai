import { motion } from "framer-motion";
import styles from "./Modal.module.css";

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: "-50%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "-50%" }}
        transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1], delay: 0.1 }}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
