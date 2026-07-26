import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = 'Search...', ariaLabel }) {
  return (
    <div className={styles.wrapper}>
      <Search size={17} className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
      />
    </div>
  );
}
