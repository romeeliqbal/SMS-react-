import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, GraduationCap, X } from 'lucide-react';
import { navigationItems } from '../../data/navigation';
import { useLayout } from '../../hooks/useLayout';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const {
    isMobile,
    sidebarOpen,
    sidebarCollapsed,
    closeSidebar,
    toggleSidebarCollapse,
  } = useLayout();

  const sidebarClassName = [
    styles.sidebar,
    sidebarOpen ? styles.open : '',
    sidebarCollapsed && !isMobile ? styles.collapsed : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {isMobile && sidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      <aside className={sidebarClassName} aria-label="Main navigation">
        <div className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <GraduationCap size={22} strokeWidth={2.2} />
            </div>
            {(!sidebarCollapsed || isMobile) && (
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>EduPulse</span>
                <span className={styles.brandSubtitle}>Student Management</span>
              </div>
            )}
          </div>

          {isMobile && (
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ')
                    }
                    onClick={isMobile ? closeSidebar : undefined}
                    title={sidebarCollapsed && !isMobile ? item.label : undefined}
                  >
                    <span className={styles.navIcon}>
                      <Icon size={20} strokeWidth={2} />
                    </span>
                    {(!sidebarCollapsed || isMobile) && (
                      <span className={styles.navLabel}>{item.label}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {!isMobile && (
          <button
            type="button"
            className={styles.collapseButton}
            onClick={toggleSidebarCollapse}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </aside>
    </>
  );
}
