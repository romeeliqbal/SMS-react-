import { useState } from 'react';
import { Bot, CheckCircle2, ChevronRight, HelpCircle, Sparkles, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './AiAssistantModal.module.css';

export default function AiAssistantModal({ isOpen, onClose }) {
  const { students, teachers, classes, exams, fees, complaints, lowAttendanceStudents, overdueFees } = useData();
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [response, setResponse] = useState(null);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      id: 'low_att',
      question: 'Which students have attendance below 75%?',
      answer: () => {
        if (lowAttendanceStudents.length === 0) return 'All active students currently meet the 75% attendance threshold.';
        return `There are ${lowAttendanceStudents.length} students requiring attention:\n` +
          lowAttendanceStudents.map((s) => `• ${s.fullName} (${s.className} ${s.section}) — ${s.attendancePct}% attendance`).join('\n');
      },
    },
    {
      id: 'top_perf',
      question: 'Who are the top-performing students in Midterm 2026?',
      answer: () => {
        return 'Top 3 Performers (Grade 10 Midterm Examination):\n' +
          '1. Romeel Iqbal (Grade 10-A) — 93.4% Total (Position: 1st)\n' +
          '2. Ahmed Khan (Grade 10-A) — 87.8% Total (Position: 2nd)\n' +
          '3. Zainab Bibi (Grade 10-A) — 84.1% Total (Position: 3rd)';
      },
    },
    {
      id: 'fee_defaulters',
      question: 'What is the status of overdue fee collection?',
      answer: () => {
        if (overdueFees.length === 0) return 'No overdue fees detected for the current month.';
        const totalOverdue = overdueFees.reduce((sum, f) => sum + (f.balance || 0), 0);
        return `Total Outstanding/Overdue Amount: Rs. ${totalOverdue.toLocaleString()}\nDefaulters Count: ${overdueFees.length} invoices pending payment.`;
      },
    },
    {
      id: 'upcoming_exams',
      question: 'When is the next BISE examination scheduled?',
      answer: () => {
        const scheduled = exams.find((e) => e.status === 'Published' || e.status === 'Scheduled');
        if (!scheduled) return 'No upcoming exams published in the calendar.';
        return `Upcoming Exam: ${scheduled.name}\nDates: ${scheduled.startDate} to ${scheduled.endDate}\nTerm: ${scheduled.term}`;
      },
    },
  ];

  function handlePromptClick(p) {
    setSelectedPrompt(p.question);
    setResponse(p.answer());
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.botIcon}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className={styles.title}>EduPulse AI Assistant</h3>
              <p className={styles.subtitle}>Instant administrative & academic data queries</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.promptsSection}>
            <p className={styles.sectionLabel}><HelpCircle size={14} /> Recommended Quick Queries</p>
            <div className={styles.promptList}>
              {quickPrompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={[styles.promptBtn, selectedPrompt === p.question ? styles.promptActive : ''].join(' ')}
                  onClick={() => handlePromptClick(p)}
                >
                  <span>{p.question}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>

          {response && (
            <div className={styles.responseBox}>
              <div className={styles.responseHeader}>
                <Bot size={16} /> Answer from EduPulse Intelligence Engine:
              </div>
              <pre className={styles.responseText}>{response}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
