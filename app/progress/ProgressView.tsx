'use client';

import { useMemo, useState } from 'react';
import { useGymStore } from '../store/gymStore';
import { useShallow } from 'zustand/react/shallow';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  Dumbbell,
  AlertTriangle,
  ChevronRight,
  BarChart2,
  Zap,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { WorkoutLog, LoggedSet } from '../types/gym';
import styles from './progress.module.css';

// ── Types ──────────────────────────────────────────────────────────
interface SessionSummary {
  logId: string;
  date: string;           // ISO YYYY-MM-DD
  label: string;          // "Tuần 1", "Tuần 2", etc.
  exerciseMap: Record<string, ExSummary>;  // exerciseId → summary
  totalVolume: number;
}

interface ExSummary {
  exerciseId: string;
  exerciseName: string;
  sets: { weight: number; reps: number; volume: number }[];
  maxWeight: number;
  totalReps: number;
  totalSets: number;
  totalVolume: number;
  // vs previous session
  deltaWeight: number | null;   // +/- kg (maxWeight change)
  deltaReps: number | null;     // +/- total reps change
  deltaVolume: number | null;
}

// ── Helpers ─────────────────────────────────────────────────────────
function buildSessionSummaries(logs: WorkoutLog[], dayName: string): SessionSummary[] {
  const filtered = logs
    .filter((l) => l.dayName === dayName)
    .sort((a, b) => a.date.localeCompare(b.date));

  return filtered.map((log, idx) => {
    // Group sets by exercise
    const byEx: Record<string, LoggedSet[]> = {};
    log.sets.forEach((s) => {
      if (!byEx[s.exerciseId]) byEx[s.exerciseId] = [];
      byEx[s.exerciseId].push(s);
    });

    const prev = idx > 0 ? filtered[idx - 1] : null;
    const prevByEx: Record<string, LoggedSet[]> = {};
    if (prev) {
      prev.sets.forEach((s) => {
        if (!prevByEx[s.exerciseId]) prevByEx[s.exerciseId] = [];
        prevByEx[s.exerciseId].push(s);
      });
    }

    const exerciseMap: Record<string, ExSummary> = {};
    Object.entries(byEx).forEach(([exId, sets]) => {
      const maxWeight = Math.max(...sets.map((s) => s.weight));
      const totalReps = sets.reduce((a, s) => a + s.reps, 0);
      const totalVolume = sets.reduce((a, s) => a + s.volume, 0);

      let deltaWeight: number | null = null;
      let deltaReps: number | null = null;
      let deltaVolume: number | null = null;

      if (prev && prevByEx[exId]) {
        const prevSets = prevByEx[exId];
        const prevMax = Math.max(...prevSets.map((s) => s.weight));
        const prevReps = prevSets.reduce((a, s) => a + s.reps, 0);
        const prevVol = prevSets.reduce((a, s) => a + s.volume, 0);
        deltaWeight = Math.round((maxWeight - prevMax) * 10) / 10;
        deltaReps = totalReps - prevReps;
        deltaVolume = Math.round(totalVolume - prevVol);
      }

      exerciseMap[exId] = {
        exerciseId: exId,
        exerciseName: sets[0].exerciseName,
        sets: sets.map((s) => ({ weight: s.weight, reps: s.reps, volume: s.volume })),
        maxWeight,
        totalReps,
        totalSets: sets.length,
        totalVolume,
        deltaWeight,
        deltaReps,
        deltaVolume,
      };
    });

    return {
      logId: log.id,
      date: log.date,
      label: `#${idx + 1}`,
      exerciseMap,
      totalVolume: log.totalVolume,
    };
  });
}

// ── Delta Badge ─────────────────────────────────────────────────────
function DeltaBadge({ value, unit }: { value: number | null; unit: string }) {
  if (value === null) return <span className={styles.deltaFirst}>đầu tiên</span>;
  if (value === 0) return (
    <span className={styles.deltaEqual}>
      <Minus size={10} /> {unit}
    </span>
  );
  if (value > 0) return (
    <span className={styles.deltaUp}>
      <TrendingUp size={10} /> +{value} {unit}
    </span>
  );
  return (
    <span className={styles.deltaDown}>
      <TrendingDown size={10} /> {value} {unit}
    </span>
  );
}

// ── Set Dots (compact view of all sets) ────────────────────────────
function SetDots({ sets }: { sets: { weight: number; reps: number }[] }) {
  return (
    <div className={styles.setDots}>
      {sets.map((s, i) => (
        <div key={i} className={styles.setDot} title={`${s.weight}kg × ${s.reps}`}>
          <span className={styles.setDotWeight}>{s.weight}</span>
          <span className={styles.setDotX}>×</span>
          <span className={styles.setDotReps}>{s.reps}</span>
        </div>
      ))}
    </div>
  );
}

// ── Metric Cell ─────────────────────────────────────────────────────
function ExCell({ ex, isLast }: { ex: ExSummary; isLast: boolean }) {
  const improved = (ex.deltaWeight ?? 0) > 0 || (ex.deltaReps ?? 0) > 0;
  const declined = (ex.deltaWeight ?? 0) < 0 && (ex.deltaReps ?? 0) < 0;

  return (
    <div
      className={`${styles.exCell} ${
        improved ? styles.exCellImproved : declined ? styles.exCellDeclined : ''
      } ${isLast ? styles.exCellLatest : ''}`}
    >
      <div className={styles.exCellTop}>
        <span className={styles.exCellWeight}>{ex.maxWeight} kg</span>
        <span className={styles.exCellReps}>{ex.totalReps} reps</span>
      </div>
      <SetDots sets={ex.sets} />
      <div className={styles.exCellDeltas}>
        <DeltaBadge value={ex.deltaWeight} unit="kg" />
        <DeltaBadge value={ex.deltaReps} unit="reps" />
      </div>
    </div>
  );
}

// ── Volume bar chart for a day ──────────────────────────────────────
function VolumeChart({ sessions }: { sessions: SessionSummary[] }) {
  const data = sessions.map((s, i) => ({
    name: s.label,
    volume: s.totalVolume,
    date: new Date(s.date + 'T00:00:00').toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          formatter={(v: any) => [`${Number(v).toLocaleString()} kg`, 'Volume']}
          labelFormatter={(l, p) => p[0]?.payload?.date || l}
        />
        <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === data.length - 1 ? '#8b5cf6' : 'rgba(139,92,246,0.35)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Main View ───────────────────────────────────────────────────────
export default function ProgressView() {
  const logs = useGymStore(s => s.logs);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // All unique day names that appear in logs
  const dayNames = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach((l) => {
      counts[l.dayName] = (counts[l.dayName] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])     // most frequent first
      .map(([name, count]) => ({ name, count }));
  }, [logs]);

  // Sessions for selected day
  const sessions = useMemo(
    () => (selectedDay ? buildSessionSummaries(logs, selectedDay) : []),
    [logs, selectedDay]
  );

  // All exercises that appear across any session
  const allExercises = useMemo(() => {
    const seen = new Map<string, string>(); // id → name
    sessions.forEach((s) =>
      Object.values(s.exerciseMap).forEach((ex) => seen.set(ex.exerciseId, ex.exerciseName))
    );
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [sessions]);

  // Volume improvement summary
  const volumeGrowth = useMemo(() => {
    if (sessions.length < 2) return null;
    const first = sessions[0].totalVolume;
    const last = sessions[sessions.length - 1].totalVolume;
    return first > 0 ? Math.round(((last - first) / first) * 100) : null;
  }, [sessions]);

  // Plateau: exercises with no weight change in last 2 sessions
  const plateauExercises = useMemo(() => {
    if (sessions.length < 2) return [];
    const last = sessions[sessions.length - 1];
    return Object.values(last.exerciseMap).filter(
      (ex) => ex.deltaWeight === 0 && ex.deltaReps === 0
    );
  }, [sessions]);

  // Auto-select first day
  useMemo(() => {
    if (!selectedDay && dayNames.length > 0) {
      setSelectedDay(dayNames[0].name);
    }
  }, [dayNames, selectedDay]);

  return (
    <div className="page-container">
      {/* ── Header ─────────────────────────────────── */}
      <div className={`${styles.header} animate-fade-up`}>
        <div>
          <h1>
            <span className="text-gradient">So sánh</span> tiến độ
          </h1>
          <p className="text-secondary mt-1">
            Chọn buổi tập để xem sự cải thiện qua từng lần — kg, reps, volume
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className={styles.emptyState}>
          <Activity size={56} color="var(--text-muted)" />
          <h3 className="mt-4">Chưa có dữ liệu tiến độ</h3>
          <p className="text-secondary mt-2">
            Ghi ít nhất 2 buổi tập cùng tên để xem so sánh
          </p>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* ── Left: Day picker ─────────────────────── */}
          <div className={styles.dayList}>
            <div className={styles.dayListTitle}>Buổi tập</div>
            {dayNames.map(({ name, count }) => {
              const isActive = selectedDay === name;
              const daySessions = buildSessionSummaries(logs, name);
              const hasImprovement = daySessions.length >= 2 &&
                daySessions[daySessions.length - 1].totalVolume >
                daySessions[daySessions.length - 2].totalVolume;

              return (
                <button
                  key={name}
                  className={`${styles.dayBtn} ${isActive ? styles.dayBtnActive : ''}`}
                  onClick={() => setSelectedDay(name)}
                  id={`day-select-${name.replace(/\s/g, '-')}`}
                >
                  <div className={styles.dayBtnLeft}>
                    <div className={styles.dayBtnName}>{name}</div>
                    <div className={styles.dayBtnMeta}>{count} lần tập</div>
                  </div>
                  <div className={styles.dayBtnRight}>
                    {hasImprovement && (
                      <TrendingUp size={14} color="var(--accent-success)" />
                    )}
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Right: Comparison panel ──────────────── */}
          <div className={styles.comparisonPanel}>
            {!selectedDay || sessions.length === 0 ? (
              <div className={styles.selectPrompt}>
                <Dumbbell size={44} color="var(--text-muted)" />
                <h3 className="mt-3">Chọn một buổi tập</h3>
                <p className="text-secondary mt-1 text-sm">
                  để xem so sánh giữa các lần
                </p>
              </div>
            ) : sessions.length === 1 ? (
              <div className={styles.selectPrompt}>
                <BarChart2 size={44} color="var(--text-muted)" />
                <h3 className="mt-3">Cần ít nhất 2 lần tập</h3>
                <p className="text-secondary mt-1 text-sm">
                  Tập buổi <strong>{selectedDay}</strong> thêm lần nữa để thấy so sánh
                </p>
              </div>
            ) : (
              <>
                {/* ── Summary header ─────────────────── */}
                <div className={styles.compHeader}>
                  <div>
                    <h2>{selectedDay}</h2>
                    <p className="text-secondary text-sm mt-1">
                      {sessions.length} lần tập · so sánh qua từng buổi
                    </p>
                  </div>
                  <div className={styles.compSummary}>
                    {volumeGrowth !== null && (
                      <div
                        className={`${styles.growthBadge} ${
                          volumeGrowth > 0
                            ? styles.growthUp
                            : volumeGrowth < 0
                            ? styles.growthDown
                            : styles.growthFlat
                        }`}
                      >
                        {volumeGrowth > 0 ? (
                          <TrendingUp size={15} />
                        ) : volumeGrowth < 0 ? (
                          <TrendingDown size={15} />
                        ) : (
                          <Minus size={15} />
                        )}
                        Volume {volumeGrowth > 0 ? `+${volumeGrowth}%` : `${volumeGrowth}%`} so với đầu
                      </div>
                    )}
                    {plateauExercises.length > 0 && (
                      <div className={styles.plateauBadge}>
                        <AlertTriangle size={13} />
                        {plateauExercises.length} bài plateau
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Volume mini chart ───────────────── */}
                <div className={styles.volumeChartWrap}>
                  <div className={styles.volumeChartLabel}>
                    <Zap size={13} color="var(--accent-primary-light)" />
                    Volume mỗi buổi
                  </div>
                  <VolumeChart sessions={sessions} />
                </div>

                {/* ── Session date headers ────────────── */}
                <div className={styles.tableWrap}>
                  <div className={styles.compTable}>
                    {/* Header row: dates */}
                    <div className={styles.tableHeaderRow}>
                      <div className={styles.exNameCol}>Bài tập</div>
                      {sessions.map((s, i) => (
                        <div
                          key={s.logId}
                          className={`${styles.sessionCol} ${
                            i === sessions.length - 1 ? styles.sessionColLatest : ''
                          }`}
                        >
                          <div className={styles.sessionLabel}>{s.label}</div>
                          <div className={styles.sessionDate}>
                            {new Date(s.date + 'T00:00:00').toLocaleDateString('vi-VN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                          {i === sessions.length - 1 && (
                            <div className={styles.latestTag}>mới nhất</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Exercise rows */}
                    {allExercises.map(({ id, name }) => {
                      // Check if this exercise improved overall
                      const firstSessWithEx = sessions.find((s) => s.exerciseMap[id]);
                      const lastSessWithEx = [...sessions].reverse().find((s) => s.exerciseMap[id]);
                      const overallImproved =
                        firstSessWithEx &&
                        lastSessWithEx &&
                        firstSessWithEx.logId !== lastSessWithEx.logId &&
                        lastSessWithEx.exerciseMap[id].maxWeight >
                          firstSessWithEx.exerciseMap[id].maxWeight;

                      return (
                        <div key={id} className={styles.exRow}>
                          <div className={styles.exNameCol}>
                            <div className={styles.exRowName}>{name}</div>
                            {overallImproved && (
                              <div className={styles.exRowImproved}>
                                <ArrowUpRight size={11} /> PR!
                              </div>
                            )}
                          </div>
                          {sessions.map((s, i) => {
                            const ex = s.exerciseMap[id];
                            const isLatest = i === sessions.length - 1;
                            if (!ex) {
                              return (
                                <div
                                  key={s.logId}
                                  className={`${styles.exCell} ${styles.exCellEmpty} ${
                                    isLatest ? styles.exCellLatest : ''
                                  }`}
                                >
                                  <span className={styles.emptyDash}>—</span>
                                </div>
                              );
                            }
                            return (
                              <ExCell key={s.logId} ex={ex} isLast={isLatest} />
                            );
                          })}
                        </div>
                      );
                    })}

                    {/* Volume row */}
                    <div className={`${styles.exRow} ${styles.volumeRow}`}>
                      <div className={styles.exNameCol}>
                        <div className={styles.exRowName}>📦 Total Volume</div>
                      </div>
                      {sessions.map((s, i) => {
                        const prev = i > 0 ? sessions[i - 1] : null;
                        const delta = prev ? s.totalVolume - prev.totalVolume : null;
                        const isLatest = i === sessions.length - 1;
                        return (
                          <div
                            key={s.logId}
                            className={`${styles.exCell} ${styles.volumeCell} ${
                              isLatest ? styles.exCellLatest : ''
                            }`}
                          >
                            <span className={styles.volumeCellVal}>
                              {s.totalVolume.toLocaleString()} kg
                            </span>
                            {delta !== null && (
                              <span
                                className={
                                  delta > 0
                                    ? styles.deltaUp
                                    : delta < 0
                                    ? styles.deltaDown
                                    : styles.deltaEqual
                                }
                              >
                                {delta > 0 ? (
                                  <TrendingUp size={10} />
                                ) : delta < 0 ? (
                                  <TrendingDown size={10} />
                                ) : (
                                  <Minus size={10} />
                                )}
                                {delta > 0 ? `+${delta.toLocaleString()}` : delta.toLocaleString()} kg
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Legend ─────────────────────────── */}
                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.legendDotUp}`} />
                    Cải thiện (weight hoặc reps tăng)
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.legendDotDown}`} />
                    Giảm (cả weight lẫn reps)
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.legendDotLatest}`} />
                    Buổi gần nhất
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
