import { useState } from 'react';
import { AlertTriangle, Check, Database, Info, Layout as LayoutIcon, Palette, RotateCcw } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useStoredState } from '../hooks/useStoredState';
import { useLayout } from '../hooks/useLayout';
import { STORAGE_KEYS, clearAllStorage } from '../utils/storage';
import { ACCENT_THEMES, applyAccentTheme, applyCompactMode } from '../utils/theme';
import { restoreSampleData } from '../utils/seedInitializer';
import { logActivity } from '../utils/activityLog';
import styles from './Settings.module.css';

const DEFAULT_SETTINGS = {
  accentColor: 'indigo',
  compactMode: false,
  sidebarCollapsedDefault: false,
};

export default function Settings() {
  const [settings, setSettings] = useStoredState(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const { setSidebarCollapsed } = useLayout();

  const [confirmAction, setConfirmAction] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  function flashSaved() {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  }

  function handleAccentChange(themeKey) {
    setSettings((prev) => ({ ...prev, accentColor: themeKey }));
    applyAccentTheme(themeKey);
    flashSaved();
  }

  function handleCompactToggle() {
    setSettings((prev) => {
      const next = { ...prev, compactMode: !prev.compactMode };
      applyCompactMode(next.compactMode);
      return next;
    });
    flashSaved();
  }

  function handleSidebarPreferenceToggle() {
    setSettings((prev) => {
      const next = { ...prev, sidebarCollapsedDefault: !prev.sidebarCollapsedDefault };
      setSidebarCollapsed(next.sidebarCollapsedDefault);
      return next;
    });
    flashSaved();
  }

  function handleResetApplication() {
    clearAllStorage();
    logActivity('Application reset', 'All application data was cleared');
    window.location.reload();
  }

  function handleClearData() {
    clearAllStorage();
    window.location.reload();
  }

  function handleRestoreSample() {
    restoreSampleData();
    logActivity('Sample data restored', 'Sample students, courses, and records were reloaded');
    window.location.reload();
  }

  return (
    <div className={styles.page}>
      {savedFlash && (
        <div className={styles.savedToast}>
          <Check size={15} /> Preference saved
        </div>
      )}

      <GlassCard className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Palette size={18} />
          </div>
          <div>
            <h3 className={styles.sectionTitle}>Accent Color</h3>
            <p className={styles.sectionSubtitle}>Choose the primary accent used across the interface.</p>
          </div>
        </div>

        <div className={styles.colorGrid}>
          {Object.entries(ACCENT_THEMES).map(([key, theme]) => (
            <button
              key={key}
              type="button"
              className={[styles.colorSwatch, settings.accentColor === key ? styles.colorActive : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleAccentChange(key)}
              aria-label={`Set accent color to ${theme.label}`}
              aria-pressed={settings.accentColor === key}
            >
              <span
                className={styles.swatchDot}
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              />
              <span>{theme.label}</span>
              {settings.accentColor === key && <Check size={14} className={styles.swatchCheck} />}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <LayoutIcon size={18} />
          </div>
          <div>
            <h3 className={styles.sectionTitle}>Layout Preferences</h3>
            <p className={styles.sectionSubtitle}>Fine-tune density and default navigation state.</p>
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <p className={styles.toggleLabel}>Compact Mode</p>
            <p className={styles.toggleHint}>Reduce padding and spacing for denser information display.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.compactMode}
            className={[styles.switch, settings.compactMode ? styles.switchOn : ''].filter(Boolean).join(' ')}
            onClick={handleCompactToggle}
          >
            <span className={styles.switchThumb} />
          </button>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <p className={styles.toggleLabel}>Collapse Sidebar by Default</p>
            <p className={styles.toggleHint}>Start with a compact sidebar when you open the app on desktop.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.sidebarCollapsedDefault}
            className={[styles.switch, settings.sidebarCollapsedDefault ? styles.switchOn : '']
              .filter(Boolean)
              .join(' ')}
            onClick={handleSidebarPreferenceToggle}
          >
            <span className={styles.switchThumb} />
          </button>
        </div>
      </GlassCard>

      <GlassCard className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Database size={18} />
          </div>
          <div>
            <h3 className={styles.sectionTitle}>Data Management</h3>
            <p className={styles.sectionSubtitle}>Manage the data stored locally in your browser.</p>
          </div>
        </div>

        <div className={styles.dataActions}>
          <div className={styles.dataAction}>
            <div>
              <p className={styles.toggleLabel}>Restore Sample Data</p>
              <p className={styles.toggleHint}>Reload the original 25 sample students and 6 courses.</p>
            </div>
            <Button
              variant="secondary"
              icon={RotateCcw}
              onClick={() =>
                setConfirmAction({
                  title: 'Restore Sample Data',
                  message:
                    'This replaces all current students, courses, attendance, and grades with the original sample data. This action cannot be undone.',
                  confirmLabel: 'Restore',
                  variant: 'primary',
                  onConfirm: handleRestoreSample,
                })
              }
            >
              Restore
            </Button>
          </div>

          <div className={styles.dataAction}>
            <div>
              <p className={styles.toggleLabel}>Clear All Data</p>
              <p className={styles.toggleHint}>Permanently erase every student, course, and record.</p>
            </div>
            <Button
              variant="danger"
              icon={AlertTriangle}
              onClick={() =>
                setConfirmAction({
                  title: 'Clear All Data',
                  message:
                    'This permanently deletes all students, courses, attendance, and grade records from this browser. This action cannot be undone.',
                  confirmLabel: 'Clear Data',
                  variant: 'danger',
                  onConfirm: handleClearData,
                })
              }
            >
              Clear Data
            </Button>
          </div>

          <div className={styles.dataAction}>
            <div>
              <p className={styles.toggleLabel}>Reset Application</p>
              <p className={styles.toggleHint}>Clear all data and preferences, returning to a fresh install.</p>
            </div>
            <Button
              variant="danger"
              icon={RotateCcw}
              onClick={() =>
                setConfirmAction({
                  title: 'Reset Application',
                  message:
                    'This clears all data and preferences and reloads the app from scratch. This action cannot be undone.',
                  confirmLabel: 'Reset Application',
                  variant: 'danger',
                  onConfirm: handleResetApplication,
                })
              }
            >
              Reset
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Info size={18} />
          </div>
          <div>
            <h3 className={styles.sectionTitle}>About EduPulse</h3>
            <p className={styles.sectionSubtitle}>Student Management System</p>
          </div>
        </div>

        <dl className={styles.aboutList}>
          <div>
            <dt>Version</dt>
            <dd>1.0.0</dd>
          </div>
          <div>
            <dt>Built With</dt>
            <dd>React, React Router, Recharts, Vite</dd>
          </div>
          <div>
            <dt>Data Storage</dt>
            <dd>Local browser storage (no backend required)</dd>
          </div>
          <div>
            <dt>Description</dt>
            <dd>
              A complete student management system for tracking enrollment, courses, attendance, and academic
              performance.
            </dd>
          </div>
        </dl>
      </GlassCard>

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction?.onConfirm()}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmLabel={confirmAction?.confirmLabel}
        variant={confirmAction?.variant}
      />
    </div>
  );
}
