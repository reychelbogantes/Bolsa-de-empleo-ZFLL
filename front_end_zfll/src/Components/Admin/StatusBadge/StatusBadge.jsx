import styles from './StatusBadge.module.css';

const StatusBadge = ({ status }) => {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const cls = styles[status] || styles.pendiente;
  return <span className={`${styles.badge} ${cls}`}>{label}</span>;
};

export default StatusBadge;
