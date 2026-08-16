import { useMemo, useState } from 'react';
import { Library as LibraryIcon, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import { useData } from '../../context/DataContext';
import styles from './ResourcePages.module.css';

export default function Library() {
  const { libraryBooks } = useData();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return libraryBooks;
    return libraryBooks.filter((b) => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term));
  }, [libraryBooks, search]);

  const totalCopies = useMemo(() => libraryBooks.reduce((s, b) => s + (b.totalCopies || 0), 0), [libraryBooks]);
  const availableCopies = useMemo(() => libraryBooks.reduce((s, b) => s + (b.availableCopies || 0), 0), [libraryBooks]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Central Library & Accession Catalogue</h2>
          <p>Book accessioning, available titles, and borrow/return log.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search books or author..." />
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Titles" value={libraryBooks.length} icon={LibraryIcon} />
        <StatCard label="Total Book Copies" value={totalCopies} icon={BookOpen} />
        <StatCard label="Available on Shelf" value={availableCopies} icon={CheckCircle2} />
        <StatCard label="Borrowed" value={totalCopies - availableCopies} icon={AlertCircle} />
      </div>

      <GlassCard title="Library Books Catalogue">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Accession / ISBN</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Total Copies</th>
                <th>Available Copies</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.isbn || b.id}</strong></td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td><Badge tone="info">{b.category || 'Textbook'}</Badge></td>
                  <td>{b.totalCopies}</td>
                  <td><strong>{b.availableCopies}</strong></td>
                  <td>
                    <Badge tone={b.availableCopies > 0 ? 'success' : 'danger'}>
                      {b.availableCopies > 0 ? 'Available' : 'All Issued'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
