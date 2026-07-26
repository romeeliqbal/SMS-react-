import { Bell, Menu, Search, UserCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getNavigationItemByPath } from '../../data/navigation';
import { useLayout } from '../../hooks/useLayout';
import styles from './Topbar.module.css';

export default function Topbar() {
  const location = useLocation();
  const { toggleSidebar } = useLayout();
  const currentNav = getNavigationItemByPath(location.pathname);
  const pageTitle = currentNav?.label ?? 'Dashboard';

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.subtitle}>
            {currentNav?.description ?? 'Overview of your student management system.'}
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search students, courses..."
            aria-label="Search students and courses"
          />
        </div>

        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.notificationDot} />
        </button>

        <button type="button" className={styles.profileButton} aria-label="User profile">
          <UserCircle size={22} />
          <span className={styles.profileName}>Admin</span>
        </button>
      </div>
    </header>
  );
}
