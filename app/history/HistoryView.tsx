'use client';

import { useGymStore } from '../store/gymStore';
import { useShallow } from 'zustand/react/shallow';
import { Trash2, Dumbbell, Calendar } from 'lucide-react';
import { WorkoutLog } from '../types/gym';
import styles from './history.module.css';
import Link from 'next/link';

function LogCard({ log, onDelete }: { log: WorkoutLog; onDelete: () => void }) {
  const date = new Date(log.date + 'T00:00:00');
  const exerciseNames = [...new Set(log.sets.map((s) => s.exerciseName))];

  return (
    <div className={`${styles.logCard} animate-fade-up`}>
      <div className={styles.logDateCol}>
        <div className={styles.logDay}>
          {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
        </div>
        <div className={styles.logDate}>
          {date.getDate()}
        </div>
        <div className={styles.logMonth}>
          {date.toLocaleDateString('vi-VN', { month: 'short' })}
        </div>
      </div>

      <div className={styles.logContent}>
        <div className={styles.logTitle}>{log.dayName}</div>
        <div className={styles.logMeta}>
          {log.sets.length} sets · {log.totalVolume.toLocaleString()} kg ·{' '}
          {exerciseNames.length} bài
          {log.duration ? ` · ${log.duration} phút` : ''}
        </div>
        <div className={styles.logExercises}>
          {exerciseNames.slice(0, 5).map((name) => (
            <span key={name} className={styles.exercisePill}>
              {name}
            </span>
          ))}
          {exerciseNames.length > 5 && (
            <span className={styles.morePill}>+{exerciseNames.length - 5}</span>
          )}
        </div>
        {log.notes && (
          <p className={styles.logNotes}>&ldquo;{log.notes}&rdquo;</p>
        )}
      </div>

      <div className={styles.logActions}>
        <div className={styles.logVolume}>
          {log.totalVolume.toLocaleString()}
          <span>kg</span>
        </div>
        <button
          className="btn btn-danger btn-icon btn-sm"
          onClick={onDelete}
          title="Xóa"
          id={`delete-log-${log.id}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function HistoryView() {
  const { logs, deleteLog } = useGymStore(
    useShallow(s => ({ logs: s.logs, deleteLog: s.deleteLog }))
  );

  // Group logs by month
  const grouped = logs.reduce<Record<string, WorkoutLog[]>>((acc, log) => {
    const d = new Date(log.date + 'T00:00:00');
    const key = d.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className={`${styles.header} animate-fade-up`}>
        <div>
          <h1>
            <span className="text-gradient">Lịch sử</span> tập luyện
          </h1>
          <p className="text-secondary mt-1">
            {logs.length} buổi tập đã hoàn thành
          </p>
        </div>
        <Link href="/log" className="btn btn-primary">
          <Dumbbell size={16} /> Tập ngay
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className={styles.emptyState}>
          <Calendar size={56} color="var(--text-muted)" />
          <h3 className="mt-4">Chưa có buổi tập nào</h3>
          <p className="text-secondary mt-2">
            Hãy bắt đầu ghi log buổi tập đầu tiên của bạn!
          </p>
          <Link href="/log" className="btn btn-primary btn-lg mt-4">
            <Dumbbell size={20} /> Bắt đầu tập
          </Link>
        </div>
      ) : (
        <div className={styles.timeline}>
          {Object.entries(grouped).map(([month, monthLogs]) => (
            <div key={month} className={styles.monthGroup}>
              <div className={styles.monthHeader}>
                <div className={styles.monthLabel}>{month}</div>
                <div className={styles.monthCount}>{monthLogs.length} buổi</div>
              </div>
              <div className={styles.logList}>
                {monthLogs.map((log) => (
                  <LogCard
                    key={log.id}
                    log={log}
                    onDelete={() => deleteLog(log.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
