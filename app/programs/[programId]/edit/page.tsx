'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGymStore } from '../../../store/gymStore';
import { EXERCISE_LIBRARY, MUSCLE_GROUP_LABELS } from '../../../data/seed';
import { Exercise, MuscleGroup, ProgramDay } from '../../../types/gym';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Search,
  Check,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import Link from 'next/link';
import styles from './edit.module.css';

// ── Exercise Picker Modal ────────────────────────────────────
function ExercisePicker({
  currentIds,
  onConfirm,
  onClose,
}: {
  currentIds: Set<string>;
  onConfirm: (exercises: Exercise[]) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleGroup | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set(currentIds));

  const muscleGroups: { value: MuscleGroup | 'all'; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'chest', label: 'Ngực' },
    { value: 'back', label: 'Lưng' },
    { value: 'shoulders', label: 'Vai' },
    { value: 'biceps', label: 'Bicep' },
    { value: 'triceps', label: 'Tricep' },
    { value: 'core', label: 'Core' },
    { value: 'quads', label: 'Đùi trước' },
    { value: 'hamstrings', label: 'Đùi sau' },
    { value: 'glutes', label: 'Mông' },
    { value: 'calves', label: 'Bắp chân' },
  ];

  const filtered = EXERCISE_LIBRARY.filter((e) => {
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchGroup = filter === 'all' || e.muscleGroup === filter;
    return matchQuery && matchGroup;
  });

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    const exercises = EXERCISE_LIBRARY.filter((e) => selected.has(e.id));
    onConfirm(exercises);
  };

  return (
    <div className={styles.pickerOverlay} onClick={onClose}>
      <div className={styles.picker} onClick={(e) => e.stopPropagation()}>
        <div className={styles.pickerHeader}>
          <h3>Chọn bài tập</h3>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className={styles.pickerSearch}>
          <Search size={14} color="var(--text-muted)" />
          <input
            className={`input ${styles.pickerInput}`}
            placeholder="Tìm bài tập..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            id="picker-search"
          />
        </div>

        {/* Muscle filters */}
        <div className={styles.pickerFilters}>
          {muscleGroups.map((mg) => (
            <button
              key={mg.value}
              className={`${styles.filterChip} ${filter === mg.value ? styles.filterChipActive : ''}`}
              onClick={() => setFilter(mg.value)}
            >
              {mg.label}
            </button>
          ))}
        </div>

        {/* Selected count */}
        <div className={styles.pickerCount}>
          <span>{selected.size} bài được chọn</span>
        </div>

        {/* Exercise list */}
        <div className={styles.pickerList}>
          {filtered.map((ex) => {
            const isSelected = selected.has(ex.id);
            return (
              <button
                key={ex.id}
                className={`${styles.pickerItem} ${isSelected ? styles.pickerItemSelected : ''}`}
                onClick={() => toggle(ex.id)}
                id={`picker-${ex.id}`}
              >
                <div
                  className={`${styles.pickerCheck} ${isSelected ? styles.pickerCheckActive : ''}`}
                >
                  {isSelected && <Check size={11} />}
                </div>
                <div className={styles.pickerName}>{ex.name}</div>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                  {MUSCLE_GROUP_LABELS[ex.muscleGroup]}
                </span>
                <span className={styles.pickerCat}>{ex.category}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.pickerFooter}>
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={handleConfirm} id="confirm-picker-btn">
            <Check size={15} /> Áp dụng ({selected.size} bài)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Day Section ──────────────────────────────────────────────
function DaySection({
  day,
  onUpdate,
}: {
  day: ProgramDay;
  onUpdate: (exercises: Exercise[]) => void;
}) {
  const [open, setOpen] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  const removeExercise = (id: string) =>
    onUpdate(day.exercises.filter((e) => e.id !== id));

  const handlePickerConfirm = (exercises: Exercise[]) => {
    onUpdate(exercises);
    setShowPicker(false);
  };

  // Move exercise up/down
  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...day.exercises];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    onUpdate(arr);
  };

  const moveDown = (index: number) => {
    if (index === day.exercises.length - 1) return;
    const arr = [...day.exercises];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    onUpdate(arr);
  };

  return (
    <>
      <div className={styles.daySection}>
        {/* Day header — div to avoid <button> inside <button> */}
        <div className={styles.dayHeader} id={`day-toggle-${day.id}`}>
          <div
            className={styles.dayHeaderLeft}
            onClick={() => setOpen((o) => !o)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
          >
            <span className={styles.dayIcon}>
              <Dumbbell size={16} color="var(--accent-primary-light)" />
            </span>
            <div>
              <div className={styles.dayName}>{day.name}</div>
              <div className={styles.dayMeta}>
                {day.exercises.length} bài tập ·{' '}
                {[...new Set(day.exercises.map((e) => MUSCLE_GROUP_LABELS[e.muscleGroup]))].join(', ')}
              </div>
            </div>
          </div>
          <div className={styles.dayHeaderRight}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowPicker(true)}
              id={`edit-day-${day.id}`}
            >
              <Plus size={13} /> Chọn bài
            </button>
            <button
              className={styles.toggleBtn}
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle"
            >
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Exercise list */}
        {open && (
          <div className={styles.dayBody}>
            {day.exercises.length === 0 && (
              <div className={styles.emptyDay}>
                <p className="text-secondary text-sm">
                  Chưa có bài tập nào. Nhấn <strong>"Chọn bài"</strong> để thêm.
                </p>
              </div>
            )}
            {day.exercises.map((ex, idx) => (
              <div key={ex.id} className={styles.exItem}>
                <div className={styles.exOrder}>
                  <button
                    className={styles.orderBtn}
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    title="Lên"
                  >▲</button>
                  <span className={styles.orderNum}>{idx + 1}</span>
                  <button
                    className={styles.orderBtn}
                    onClick={() => moveDown(idx)}
                    disabled={idx === day.exercises.length - 1}
                    title="Xuống"
                  >▼</button>
                </div>
                <div className={styles.exInfo}>
                  <div className={styles.exName}>{ex.name}</div>
                  <span className="badge badge-purple" style={{ fontSize: '0.64rem' }}>
                    {MUSCLE_GROUP_LABELS[ex.muscleGroup]}
                  </span>
                </div>
                <span className={styles.exCat}>{ex.category}</span>
                <button
                  className="btn btn-danger btn-icon btn-sm"
                  onClick={() => removeExercise(ex.id)}
                  id={`remove-ex-${ex.id}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPicker && (
        <ExercisePicker
          currentIds={new Set(day.exercises.map((e) => e.id))}
          onConfirm={handlePickerConfirm}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

// ── Main Edit Page ───────────────────────────────────────────
export default function EditProgramPage() {
  const params = useParams();
  const router = useRouter();
  const { programs, updateProgramDay } = useGymStore();

  const programId = params.programId as string;
  const program = programs.find((p) => p.id === programId);

  // Local draft state — only save to store on "Lưu"
  const [draftDays, setDraftDays] = useState(() =>
    program ? program.days.map((d) => ({ ...d, exercises: [...d.exercises] })) : []
  );
  const [saved, setSaved] = useState(false);

  if (!program) {
    return (
      <div className="page-container">
        <Link href="/programs" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Quay lại
        </Link>
        <p className="text-secondary mt-4">Không tìm thấy chương trình này.</p>
      </div>
    );
  }

  const updateDraftDay = (dayId: string, exercises: Exercise[]) => {
    setDraftDays((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, exercises } : d))
    );
    setSaved(false);
  };

  const handleSave = () => {
    draftDays.forEach((d) => {
      updateProgramDay(programId, d.id, d.exercises);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className={`${styles.header} animate-fade-up`}>
        <div>
          <Link href="/programs" className={styles.backLink}>
            <ArrowLeft size={15} /> Chương trình
          </Link>
          <h1 className="mt-1">
            Chỉnh sửa <span className="text-gradient">{program.name}</span>
          </h1>
          <p className="text-secondary mt-1 text-sm">
            Kéo thả hoặc dùng nút ▲▼ để sắp xếp thứ tự bài tập trong từng buổi
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
            onClick={handleSave}
            id="save-program-btn"
          >
            {saved ? (
              <>
                <Check size={16} /> Đã lưu!
              </>
            ) : (
              <>
                <Save size={16} /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>

      {/* Changes banner */}
      {!saved && (
        <div className={styles.changesBanner}>
          ⚠️ Bạn có thay đổi chưa lưu. Nhấn <strong>Lưu thay đổi</strong> để áp dụng vào trang Ghi Log.
        </div>
      )}

      {/* Day sections */}
      <div className={styles.dayList}>
        {draftDays.map((day) => (
          <DaySection
            key={day.id}
            day={day}
            onUpdate={(exercises) => updateDraftDay(day.id, exercises)}
          />
        ))}
      </div>

      {/* Save floating footer */}
      <div className={styles.floatingFooter}>
        <button
          className={`btn ${saved ? 'btn-success' : 'btn-primary'} btn-lg`}
          onClick={handleSave}
          id="save-program-floating-btn"
        >
          {saved ? <><Check size={18} /> Đã lưu thay đổi!</> : <><Save size={18} /> Lưu thay đổi</>}
        </button>
        <Link href="/log" className="btn btn-secondary btn-lg">
          <Dumbbell size={18} /> Bắt đầu tập
        </Link>
      </div>
    </div>
  );
}
