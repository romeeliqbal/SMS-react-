import { useMemo, useState } from 'react';
import { Bell, ChevronDown, Menu, Search, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getNavigationItemByPath } from '../../data/navigation';
import { ROLE_DEFINITIONS } from '../../data/roleConfigs';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLayout } from '../../hooks/useLayout';
import Avatar from '../common/Avatar';
import GlobalSearchModal from '../common/GlobalSearchModal';
import AiAssistantModal from '../common/AiAssistantModal';
import styles from './Topbar.module.css';

export default function Topbar() {
  const location = useLocation();
  const { toggleSidebar } = useLayout();
  const { activeRole, authProfile, roleDefinition, switchRole } = useAuth();
  const { notifications, setNotifications } = useData();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiOpen, setAiOpen] = useState(false);

  const currentNav = getNavigationItemByPath(location.pathname);
  const pageTitle = currentNav?.label ?? 'Dashboard';

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleSearchClick() {
    setSearchOpen(true);
  }

  return (
    <>
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
              {currentNav?.description ?? 'EduPulse School & College Management System'}
            </p>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.searchWrapper} onClick={handleSearchClick}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search students, teachers, classes..."
              aria-label="Global search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              readOnly
            />
          </div>

          <button
            type="button"
            className={styles.iconButton}
            title="EduPulse AI Assistant"
            onClick={() => setAiOpen(true)}
          >
            <Sparkles size={18} />
          </button>

          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className={styles.notificationDot} />}
            </button>
            {notifOpen && (
              <div className={styles.dropdownPanel}>
                <div className={styles.panelHeader}>
                  <span>Notifications</span>
                  <button type="button" className={styles.linkBtn} onClick={markAllRead}>
                    Mark all read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className={styles.emptyPanel}>No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className={[styles.notifItem, !n.read ? styles.unread : ''].join(' ')}>
                      <strong>{n.title}</strong>
                      <span>{n.message}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className={styles.dropdown}>
            <button
              type="button"
              className={styles.roleButton}
              onClick={() => setRoleMenuOpen((v) => !v)}
              aria-label="Switch role"
            >
              <Avatar initials={authProfile?.initials || 'AD'} color={authProfile?.avatarColor} size="sm" />
              <span className={styles.roleInfo}>
                <span className={styles.roleName}>{authProfile?.name || 'Admin'}</span>
                <span className={styles.roleBadge}>{roleDefinition?.badge || 'Admin'}</span>
              </span>
              <ChevronDown size={16} />
            </button>
            {roleMenuOpen && (
              <div className={styles.dropdownPanel}>
                <div className={styles.panelHeader}>Switch Role (Demo)</div>
                {ROLE_DEFINITIONS.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={[styles.roleOption, activeRole === role.id ? styles.roleActive : ''].join(' ')}
                    onClick={() => {
                      switchRole(role.id);
                      setRoleMenuOpen(false);
                    }}
                  >
                    <span className={styles.roleOptionBadge}>{role.badge}</span>
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      <AiAssistantModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />
    </>
  );
}

