import styles from './Card.module.css';

const Card = ({ children, className = '', dashed = false }) => (
  <div className={`${styles.card} ${dashed ? styles.cardDashed : ''}`}>
    <div className={className}>{children}</div>
  </div>
);

export default Card;
