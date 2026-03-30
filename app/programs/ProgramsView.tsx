'use client';

import { useState } from 'react';
import { useGymStore } from '../store/gymStore';
import {
  Dumbbell,
  Plus,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Calendar,
  Users,
} from 'lucide-react';
import { WorkoutProgram } from '../types/gym';
import styles from './programs.module.css';

const GOAL_LABELS: Record<WorkoutProgram['goal'], string> = {
  strength: 'Sức mạnh',
  hypertrophy: 'Tăng cơ',
  endurance: 'Bền bỉ',
  weight_loss: 'Giảm mỡ',
  general: 'Toàn diện',
};

const LEVEL_LABELS: Record<WorkoutProgram['level'], string> = {
  beginner: 'Người mới',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
};

const LEVEL_COLORS: Record<WorkoutProgram['level'], string> = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-danger',
};

const GOAL_COLORS: Record<WorkoutProgram['goal'], string> = {
  strength: 'badge-danger',
  hypertrophy: 'badge-purple',
  endurance: 'badge-cyan',
  weight_loss: 'badge-warning',
  general: 'badge-purple',
};

function ProgramCard({
  program,
  isActive,
  onSelect,
}: {
  program: WorkoutProgram;
  isActive: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`${styles.programCard} ${isActive ? styles.programCardActive : ''} animate-fade-up`}
    >
      {isActive && (
        <div className={styles.activeRibbon}>
          <CheckCircle size={14} /> Đang tập
        </div>
      )}

      <div className={styles.programHeader}>
        <div className={styles.programIconWrap}>
          <Dumbbell size={22} />
        </div>
        <div className={styles.programInfo}>
          <h3 className={styles.programTitle}>{program.name}</h3>
          <p className={styles.programDesc}>{program.description}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`badge ${GOAL_COLORS[program.goal]}`}>
              <Target size={11} />
              {GOAL_LABELS[program.goal]}
            </span>
            <span className={`badge ${LEVEL_COLORS[program.level]}`}>
              {LEVEL_LABELS[program.level]}
            </span>
            <span className="badge badge-cyan">
              <Calendar size={11} />
              {program.daysPerWeek} ngày/tuần
            </span>
          </div>
        </div>
      </div>

      {/* Days toggle */}
      <button
        className={styles.toggleDays}
        onClick={() => setExpanded((e) => !e)}
      >
        <Users size={14} />
        {program.days.length} ngày tập
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className={styles.daysGrid}>
          {program.days.map((day) => (
            <div key={day.id} className={styles.dayCard}>
              <div className={styles.dayName}>{day.name}</div>
              <div className={styles.dayExercises}>
                {day.exercises.map((ex) => (
                  <span key={ex.id} className={styles.exerciseChip}>
                    {ex.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.programActions}>
        <button
          className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
          onClick={onSelect}
          style={{ flex: 1 }}
          id={`select-program-${program.id}`}
        >
          {isActive ? (
            <>
              <CheckCircle size={16} /> Đang hoạt động
            </>
          ) : (
            <>
              <Plus size={16} /> Chọn chương trình này
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ProgramsView() {
  const { programs, profile, setActiveProgram } = useGymStore();

  return (
    <div className="page-container">
      {/* Header */}
      <div className={`${styles.pageHeader} animate-fade-up`}>
        <div>
          <h1>
            <span className="text-gradient">Chương trình</span> tập luyện
          </h1>
          <p className="text-secondary mt-1">
            Chọn chương trình phù hợp với mục tiêu của bạn
          </p>
        </div>
      </div>

      {/* Programs grid */}
      <div className={styles.programsGrid}>
        {programs.map((program, i) => (
          <ProgramCard
            key={program.id}
            program={program}
            isActive={profile.activeProgram === program.id}
            onSelect={() => setActiveProgram(program.id)}
          />
        ))}
      </div>
    </div>
  );
}
