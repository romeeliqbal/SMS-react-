import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLayout } from '../../hooks/useLayout';
import styles from './Layout.module.css';

export default function Layout() {
  const { sidebarCollapsed, isMobile, sidebarOpen } = useLayout();

  const layoutClassName = [
    styles.layout,
    sidebarCollapsed && !isMobile ? styles.sidebarCollapsed : '',
    isMobile ? styles.mobile : '',
    isMobile && sidebarOpen ? styles.sidebarOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={layoutClassName}>
      <Sidebar />

      <div className={styles.main}>
        <Topbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
