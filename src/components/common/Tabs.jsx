import styles from './Tabs.module.css';

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={[styles.tab, activeTab === tab.id ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
