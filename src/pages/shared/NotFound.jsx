import { Link } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <GlassCard className={styles.card} padding="large">
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.text}>The page you are looking for does not exist or you may not have permission to access it.</p>
        <Link to="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </GlassCard>
    </div>
  );
}
