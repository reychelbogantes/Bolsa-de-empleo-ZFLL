import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react'; 
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, footer }) => (
  <AnimatePresence>
    {isOpen && (
      <div className={styles.overlay}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={styles.backdrop}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={styles.container}
        >
          <div className={styles.header}>
            <h3>{title}</h3>
            <button onClick={onClose} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.body}>{children}</div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default Modal;
