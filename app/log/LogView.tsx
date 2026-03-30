'use client';

import { useState, useMemo } from 'react';
import { useGymStore } from '../store/gymStore';
import { EXERCISE_LIBRARY, MUSCLE_GROUP_LABELS } from '../data/seed';
import { LoggedSet, Exercise } from '../types/gym';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Check,
  X,
  Dumbbell,
  Timer,
  Zap,
  Search,
  ChevronDown,
  ChevronUp,
  History,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import styles from './log.module.css';

// ─────────────────────────────────────────────────────────────
// Inline AddSet row — compact, for within an exercise row
// ─────────────────────────────────────────────────────────────
function QuickAddSet({
  exerciseId,
  exerciseName,
  lastWeight,
  lastReps,
  onAdd,
}: {
  exerciseId: string;
  exerciseName: string;
  lastWeight?: number;
  lastReps?: number;
  onAdd: (data: Omit<LoggedSet, 'id' | 'volume'>) => void;
}) {
  const [weight, setWeight] = useState(lastWeight ? String(lastWeight) : '');
  const [reps, setReps] = useState(lastReps ? String(lastReps) : '');

  const volume =
    weight && reps
      ? (parseFloat(weight) * parseInt(reps)).toLocaleString()
      : null;

  const handleAdd = () => {
    if (!weight || !reps) return;
    onAdd({ exerciseId, exerciseName, weight: parseFloat(weight), reps: parseInt(reps) });
    setReps(''); // keep weight, clear reps for next set
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className={styles.quickAdd}>
      <input
        className={`input ${styles.quickInput}`}
        type="number"
        min="0"
        step="0.5"
        placeholder={lastWeight ? `${lastWeight}` : 'kg'}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onKeyDown={handleKey}
        id={`weight-${exerciseId}`}
      />
      <span className={styles.quickX}>×</span>
      <input
        className={`input ${styles.quickInput}`}
        type="number"
        min="1"
        placeholder={lastReps ? `${lastReps}` : 'reps'}
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onKeyDown={handleKey}
        id={`reps-${exerciseId}`}
      />
      {volume && (
        <span className={styles.quickVol}>{volume} kg</span>
      )}
      <button
        className={`btn btn-success btn-sm ${styles.quickAddBtn}`}
        onClick={handleAdd}
        disabled={!weight || !reps}
        id={`add-set-${exerciseId}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Exercise Row — one card per exercise with its sets
// ─────────────────────────────────────────────────────────────
function ExerciseRow({
  exercise,
  sets,
  lastSession,
  onAddSet,
  onRemoveSet,
}: {
  exercise: Exercise;
  sets: LoggedSet[];
  lastSession?: { weight: number; reps: number } | null;
  onAddSet: (data: Omit<LoggedSet, 'id' | 'volume'>) => void;
  onRemoveSet: (id: string) => void;
}) {
  const totalVolume = sets.reduce((a, s) => a + s.volume, 0);
  const maxWeight = sets.length ? Math.max(...sets.map((s) => s.weight)) : 0;
  const totalReps = sets.reduce((a, s) => a + s.reps, 0);

  return (
    <div className={`${styles.exRow} ${sets.length > 0 ? styles.exRowHasSets : ''}`}>
      {/* Exercise header */}
      <div className={styles.exRowHeader}>
        <div className={styles.exRowLeft}>
          <div className={styles.exRowName}>{exercise.name}</div>
          <span className={`badge badge-purple ${styles.exRowBadge}`}>
            {MUSCLE_GROUP_LABELS[exercise.muscleGroup]}
          </span>
        </div>
        <div className={styles.exRowRight}>
          {sets.length > 0 ? (
            <div className={styles.exRowStats}>
              <span className={styles.exRowStat}>{sets.length} sets</span>
              <span className={styles.exRowStat}>{maxWeight} kg</span>
              <span className={styles.exRowStat}>{totalReps} reps</span>
              <span className={styles.exRowVol}>{totalVolume.toLocaleString()} kg vol</span>
            </div>
          ) : (
            lastSession && (
              <div className={styles.lastTime}>
                <History size={11} />
                lần trước: {lastSession.weight}kg × {lastSession.reps}
              </div>
            )
          )}
        </div>
      </div>

      {/* Logged sets */}
      {sets.length > 0 && (
        <div className={styles.setsList}>
          {sets.map((s, i) => (
            <div key={s.id} className={styles.setItem}>
              <span className={styles.setNum}>#{i + 1}</span>
              <span className={styles.setWeight}>{s.weight} kg</span>
              <span className={styles.setX}>×</span>
              <span className={styles.setReps}>{s.reps} reps</span>
              <span className={styles.setVol}>{s.volume.toLocaleString()} kg</span>
              <button
                className={`btn btn-danger btn-icon ${styles.setRemove}`}
                onClick={() => onRemoveSet(s.id)}
                id={`remove-${s.id}`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick add row */}
      <QuickAddSet
        exerciseId={exercise.id}
        exerciseName={exercise.name}
        lastWeight={lastSession?.weight}
        lastReps={lastSession?.reps}
        onAdd={onAddSet}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Extra Exercise Search Panel (add extra bài ngoài lịch)
// ─────────────────────────────────────────────────────────────
function ExtraExercisePanel({
  onSelect,
  alreadyIn,
}: {
  onSelect: (ex: Exercise) => void;
  alreadyIn: Set<string>;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const filtered = EXERCISE_LIBRARY.filter(
    (e) =>
      !alreadyIn.has(e.id) &&
      (e.name.toLowerCase().includes(q.toLowerCase()) ||
        MUSCLE_GROUP_LABELS[e.muscleGroup].toLowerCase().includes(q.toLowerCase()))
  ).slice(0, 10);

  return (
    <div className={styles.extraPanel}>
      <button
        className={`btn btn-secondary ${styles.extraToggle}`}
        onClick={() => setOpen((o) => !o)}
        id="add-extra-exercise-btn"
      >
        <Plus size={15} />
        Thêm bài tập khác
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className={styles.extraDropdown}>
          <div className={styles.extraSearch}>
            <Search size={13} />
            <input
              className={`input ${styles.extraInput}`}
              placeholder="Tìm bài tập..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              id="extra-exercise-search"
            />
          </div>
          <div className={styles.extraList}>
            {filtered.length === 0 && (
              <div className={styles.extraEmpty}>Không tìm thấy</div>
            )}
            {filtered.map((ex) => (
              <button
                key={ex.id}
                className={styles.extraItem}
                onClick={() => {
                  onSelect(ex);
                  setQ('');
                  setOpen(false);
                }}
                id={`extra-${ex.id}`}
              >
                <span className={styles.extraName}>{ex.name}</span>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                  {MUSCLE_GROUP_LABELS[ex.muscleGroup]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Finish Modal
// ─────────────────────────────────────────────────────────────
function FinishModal({
  totalSets,
  totalVolume,
  onConfirm,
  onCancel,
}: {
  totalSets: number;
  totalVolume: number;
  onConfirm: (notes: string, duration: number | undefined) => void;
  onCancel: () => void;
}) {
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Hoàn thành buổi tập 🎉</h3>
        <div className={styles.modalStats}>
          <div>
            <div className={styles.modalStatVal}>{totalSets}</div>
            <div className={styles.modalStatLabel}>Sets</div>
          </div>
          <div>
            <div className={styles.modalStatVal}>{totalVolume.toLocaleString()} kg</div>
            <div className={styles.modalStatLabel}>Volume</div>
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}><Timer size={13} /> Thời gian tập (phút)</label>
          <input className="input" type="number" placeholder="Vd: 60" value={duration}
            onChange={(e) => setDuration(e.target.value)} id="duration-input" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Ghi chú</label>
          <textarea className={`input ${styles.textarea}`} placeholder="Cảm nhận về buổi tập..."
            value={notes} onChange={(e) => setNotes(e.target.value)} id="notes-textarea" />
        </div>
        <div className="flex gap-3 mt-2">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Quay lại</button>
          <button className="btn btn-success" style={{ flex: 1 }}
            onClick={() => onConfirm(notes, duration ? parseInt(duration) : undefined)}
            id="confirm-finish-btn">
            <Check size={16} /> Lưu buổi tập
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Log Page
// ─────────────────────────────────────────────────────────────
export default function LogView() {
  const {
    activeLog,
    profile,
    programs,
    startWorkout,
    addSetToActiveLog,
    removeSetFromActiveLog,
    finishWorkout,
    cancelWorkout,
    getLastSessionForDay,
    logs,
  } = useGymStore();

  // Extra exercises added beyond the program day's list
  const [extraExercises, setExtraExercises] = useState<Exercise[]>([]);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const activeProgram = programs.find((p) => p.id === profile.activeProgram);

  // ── Derive program-day exercises for the active log ──────────
  const programDay = useMemo(() => {
    if (!activeLog?.programId || !activeLog?.dayId) return null;
    const prog = programs.find((p) => p.id === activeLog.programId);
    return prog?.days.find((d) => d.id === activeLog.dayId) ?? null;
  }, [activeLog, programs]);

  // Combined exercise list: program day's exercises + extras
  const allExercises = useMemo(() => {
    const base = programDay?.exercises ?? [];
    return [...base, ...extraExercises];
  }, [programDay, extraExercises]);

  // Sets grouped by exerciseId for the current active log
  const setsByExercise = useMemo(() => {
    const map: Record<string, LoggedSet[]> = {};
    activeLog?.sets.forEach((s) => {
      if (!map[s.exerciseId]) map[s.exerciseId] = [];
      map[s.exerciseId].push(s);
    });
    return map;
  }, [activeLog?.sets]);

  // Last session data for "lần trước" hints
  const lastSession = useMemo(
    () => (activeLog ? getLastSessionForDay(activeLog.dayName) : null),
    [activeLog, getLastSessionForDay, logs]
  );

  const getLastSetForExercise = (exerciseId: string) => {
    if (!lastSession) return null;
    const sets = lastSession.sets.filter((s) => s.exerciseId === exerciseId);
    if (!sets.length) return null;
    return sets[sets.length - 1]; // last set of that exercise
  };

  // ── No active log: Start screen ──────────────────────────────
  if (!activeLog) {
    return (
      <div className="page-container">
        <div className={`${styles.startHeader} animate-fade-up`}>
          <h1>
            <span className="text-gradient">Ghi Log</span> buổi tập
          </h1>
          <p className="text-secondary mt-1">Chọn buổi tập để bắt đầu</p>
        </div>

        <div className={styles.startGrid}>
          {/* Active program days */}
          {activeProgram && (
            <div className={`card card-accent animate-fade-up stagger-1 ${styles.quickStartCard}`}>
              <div className={styles.quickStartHeader}>
                <Dumbbell size={18} color="var(--accent-primary-light)" />
                <div>
                  <h3 style={{ fontSize: '1rem' }}>{activeProgram.name}</h3>
                  <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    Chọn buổi tập hôm nay
                  </p>
                </div>
                <Link
                  href={`/programs/${activeProgram.id}/edit`}
                  className="btn btn-secondary btn-sm"
                  id="edit-program-btn"
                  title="Chỉnh sửa bài tập"
                >
                  <Settings size={13} /> Sửa
                </Link>
              </div>
              <div className={styles.quickDays}>
                {activeProgram.days.map((day) => {
                  const lastLog = getLastSessionForDay(day.name);
                  const dayAgo = lastLog
                    ? Math.floor(
                        (Date.now() - new Date(lastLog.date + 'T00:00:00').getTime()) /
                          86400000
                      )
                    : null;
                  return (
                    <button
                      key={day.id}
                      className={`${styles.quickDayBtn}`}
                      onClick={() => startWorkout(day.name, activeProgram.id, day.id)}
                      id={`quick-start-${day.id}`}
                    >
                      <div className={styles.quickDayLeft}>
                        <Zap size={14} color="var(--accent-primary-light)" />
                        <div>
                          <div className={styles.quickDayName}>{day.name}</div>
                          <div className={styles.quickDayExercises}>
                            {day.exercises.slice(0, 3).map((e) => e.name).join(' · ')}
                            {day.exercises.length > 3 && ` +${day.exercises.length - 3}`}
                          </div>
                        </div>
                      </div>
                      {dayAgo !== null && (
                        <div className={styles.quickDayLast}>
                          {dayAgo === 0
                            ? 'hôm nay'
                            : dayAgo === 1
                            ? 'hôm qua'
                            : `${dayAgo} ngày trước`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* No active program */}
          {!activeProgram && (
            <div className={`card animate-fade-up stagger-1`} style={{ textAlign: 'center', padding: '2rem' }}>
              <Dumbbell size={36} color="var(--text-muted)" />
              <p className="text-secondary mt-2">Chưa chọn chương trình tập</p>
              <Link href="/programs" className="btn btn-primary btn-sm mt-3">
                Chọn chương trình
              </Link>
            </div>
          )}

          {/* Custom session */}
          <div className={`card animate-fade-up stagger-2 ${styles.customCard}`}>
            <h3>Tập tự do</h3>
            <p className="text-sm text-secondary mt-1">
              Log tự do, không theo lịch chương trình
            </p>
            <CustomSessionForm onStart={(name) => startWorkout(name)} />
          </div>
        </div>
      </div>
    );
  }

  // ── Active log: Logger screen ────────────────────────────────
  const exerciseIds = new Set(allExercises.map((e) => e.id));

  return (
    <div className="page-container">
      {/* Header */}
      <div className={`${styles.logHeader} animate-fade-up`}>
        <div>
          <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
            <Zap size={11} /> Đang tập
          </div>
          <h1>{activeLog.dayName}</h1>
          {programDay && (
            <p className="text-secondary mt-1" style={{ fontSize: '0.85rem' }}>
              {programDay.exercises.length} bài trong lịch · {extraExercises.length > 0 ? `+${extraExercises.length} thêm` : ''}
            </p>
          )}
        </div>
        <div className={styles.logActions}>
          <button
            className="btn btn-danger"
            onClick={() => {
              if (activeLog.sets.length > 0) {
                if (!confirm('Buổi tập chưa lưu sẽ bị xóa. Tiếp tục hủy?')) return;
              }
              cancelWorkout();
              setExtraExercises([]);
            }}
            id="cancel-workout-btn"
          >
            <X size={16} /> Hủy
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              if (activeLog.sets.length === 0) {
                toast.warning('Chưa có set nào!', {
                  description: 'Hãy thêm ít nhất 1 set trước khi hoàn thành buổi tập.',
                  duration: 3500,
                });
                return;
              }
              setShowFinishModal(true);
            }}
            id="finish-workout-btn"
          >
            <Check size={16} /> Hoàn thành
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statsBarItem}>
          <div className={styles.statsBarValue}>{activeLog.sets.length}</div>
          <div className={styles.statsBarLabel}>Sets</div>
        </div>
        <div className={styles.statsBarDivider} />
        <div className={styles.statsBarItem}>
          <div className={styles.statsBarValue}>{activeLog.totalVolume.toLocaleString()}</div>
          <div className={styles.statsBarLabel}>kg Volume</div>
        </div>
        <div className={styles.statsBarDivider} />
        <div className={styles.statsBarItem}>
          <div className={styles.statsBarValue}>
            {Object.keys(setsByExercise).length}
          </div>
          <div className={styles.statsBarLabel}>Bài tập</div>
        </div>
        {lastSession && (
          <>
            <div className={styles.statsBarDivider} />
            <div className={styles.statsBarItem}>
              <div className={styles.statsBarValue} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {lastSession.totalVolume.toLocaleString()} kg
              </div>
              <div className={styles.statsBarLabel}>
                <History size={9} /> buổi trước
              </div>
            </div>
          </>
        )}
      </div>

      {/* Exercise list */}
      <div className={styles.exerciseGrid}>
        {allExercises.length === 0 && (
          <div className={styles.noExercises}>
            <p className="text-secondary text-sm">Không có bài tập nào. Thêm bài tập để bắt đầu.</p>
          </div>
        )}

        {allExercises.map((ex) => {
          const lastSet = getLastSetForExercise(ex.id);
          return (
            <ExerciseRow
              key={ex.id}
              exercise={ex}
              sets={setsByExercise[ex.id] ?? []}
              lastSession={lastSet ? { weight: lastSet.weight, reps: lastSet.reps } : null}
              onAddSet={addSetToActiveLog}
              onRemoveSet={removeSetFromActiveLog}
            />
          );
        })}

        {/* Add extra exercise */}
        <ExtraExercisePanel
          alreadyIn={exerciseIds}
          onSelect={(ex) => setExtraExercises((prev) => [...prev, ex])}
        />
      </div>

      {/* Finish modal */}
      {showFinishModal && (
        <FinishModal
          totalSets={activeLog.sets.length}
          totalVolume={activeLog.totalVolume}
          onConfirm={(notes, duration) => {
            const setsCount = activeLog.sets.length;
            finishWorkout(notes, duration);
            setExtraExercises([]);
            setShowFinishModal(false);
            toast.success('Buổi tập đã được lưu!', {
              description: `${setsCount} sets • ${activeLog.totalVolume.toLocaleString()} kg volume`,
              duration: 4000,
            });
          }}
          onCancel={() => setShowFinishModal(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Custom session form (small helper)
// ─────────────────────────────────────────────────────────────
function CustomSessionForm({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <div className={styles.customInputRow}>
      <input
        className="input"
        placeholder="Tên buổi tập (vd: Chest Day)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onStart(name || 'Custom Session')}
        id="custom-day-name-input"
      />
      <button
        className="btn btn-primary"
        onClick={() => onStart(name || 'Custom Session')}
        id="start-custom-workout-btn"
      >
        <Zap size={16} /> Bắt đầu
      </button>
    </div>
  );
}
