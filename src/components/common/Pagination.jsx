import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, page * pageSize);

  const pageNumbers = [];
  const windowSize = 1;
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= page - windowSize && i <= page + windowSize)) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
  }

  return (
    <div className={styles.pagination}>
      <span className={styles.summary}>
        Showing {start}–{end} of {totalItems}
      </span>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((num, idx) =>
          num === '...' ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={num}
              type="button"
              className={[styles.pageButton, num === page ? styles.active : ''].join(' ')}
              onClick={() => onPageChange(num)}
              aria-current={num === page ? 'page' : undefined}
            >
              {num}
            </button>
          ),
        )}

        <button
          type="button"
          className={styles.navButton}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
