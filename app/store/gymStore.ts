import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  WorkoutProgram,
  WorkoutLog,
  LoggedSet,
  UserProfile,
  ExerciseProgress,
  Exercise,
  MuscleGroup,
} from '../types/gym';
import { DEFAULT_PROGRAMS } from '../data/seed';

interface GymState {
  // Data
  programs: WorkoutProgram[];
  logs: WorkoutLog[];
  activeLog: WorkoutLog | null;
  profile: UserProfile;

  // Program actions
  addProgram: (program: WorkoutProgram) => void;
  deleteProgram: (id: string) => void;
  setActiveProgram: (programId: string) => void;
  updateProgramDay: (programId: string, dayId: string, exercises: Exercise[]) => void;

  // Workout log actions
  startWorkout: (dayName: string, programId?: string, dayId?: string) => void;
  addSetToActiveLog: (set: Omit<LoggedSet, 'id' | 'volume'>) => void;
  removeSetFromActiveLog: (setId: string) => void;
  finishWorkout: (notes?: string, duration?: number) => void;
  cancelWorkout: () => void;
  deleteLog: (id: string) => void;

  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  addBodyWeight: (weight: number) => void;
  deleteBodyWeight: (id: string) => void;

  // Computed
  getExerciseProgress: (exerciseId: string) => ExerciseProgress;
  getWeeklyVolume: () => { day: string; volume: number }[];
  getCurrentStreak: () => number;
  getLastSessionForDay: (dayName: string) => WorkoutLog | null;
}

const generateId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const todayISO = () => new Date().toISOString().split('T')[0];

export const useGymStore = create<GymState>()(
  persist(
    (set, get) => ({
      programs: DEFAULT_PROGRAMS,
      logs: [],
      activeLog: null,
      profile: {
        name: 'Gym Warrior',
        goal: 'hypertrophy',
        bodyWeight: [],
        weeklyStreak: 0,
        totalWorkouts: 0,
      },

      // ── Program Actions ──────────────────────────────
      addProgram: (program) =>
        set((s) => ({ programs: [...s.programs, program] })),

      deleteProgram: (id) =>
        set((s) => ({ programs: s.programs.filter((p) => p.id !== id) })),

      setActiveProgram: (programId) =>
        set((s) => ({
          profile: { ...s.profile, activeProgram: programId },
        })),

      updateProgramDay: (programId, dayId, exercises) =>
        set((s) => ({
          programs: s.programs.map((p) =>
            p.id !== programId
              ? p
              : {
                  ...p,
                  days: p.days.map((d) =>
                    d.id !== dayId
                      ? d
                      : {
                          ...d,
                          exercises,
                          muscleGroups: [
                            ...new Set(exercises.map((e) => e.muscleGroup)),
                          ] as MuscleGroup[],
                        }
                  ),
                }
          ),
        })),

      // ── Workout Log Actions ──────────────────────────
      startWorkout: (dayName, programId, dayId) => {
        const newLog: WorkoutLog = {
          id: generateId(),
          date: todayISO(),
          dayName,
          programId,
          dayId,
          sets: [],
          totalVolume: 0,
        };
        set({ activeLog: newLog });
      },

      addSetToActiveLog: (setData) => {
        const volume = setData.weight * setData.reps;
        const newSet: LoggedSet = {
          ...setData,
          id: generateId(),
          volume,
        };
        set((s) => {
          if (!s.activeLog) return s;
          const sets = [...s.activeLog.sets, newSet];
          const totalVolume = sets.reduce((acc, s) => acc + s.volume, 0);
          return {
            activeLog: { ...s.activeLog, sets, totalVolume },
          };
        });
      },

      removeSetFromActiveLog: (setId) => {
        set((s) => {
          if (!s.activeLog) return s;
          const sets = s.activeLog.sets.filter((s) => s.id !== setId);
          const totalVolume = sets.reduce((acc, s) => acc + s.volume, 0);
          return { activeLog: { ...s.activeLog, sets, totalVolume } };
        });
      },

      finishWorkout: (notes, duration) => {
        const { activeLog } = get();
        if (!activeLog) return;
        const finishedLog = { ...activeLog, notes, duration: duration || 0 };
        set((s) => ({
          logs: [finishedLog, ...s.logs],
          activeLog: null,
          profile: {
            ...s.profile,
            totalWorkouts: s.profile.totalWorkouts + 1,
          },
        }));
      },

      cancelWorkout: () => set({ activeLog: null }),

      deleteLog: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),

      // ── Profile Actions ──────────────────────────────
      updateProfile: (partial) =>
        set((s) => ({ profile: { ...s.profile, ...partial } })),

      addBodyWeight: (weight) => {
        const entry = { id: generateId(), date: new Date().toISOString(), weight };
        set((s) => ({
          profile: {
            ...s.profile,
            bodyWeight: [
              ...s.profile.bodyWeight,
              entry,
            ].sort((a, b) => a.date.localeCompare(b.date)),
          },
        }));
      },

      deleteBodyWeight: (idOrDate) =>
        set((s) => ({
          profile: {
            ...s.profile,
            bodyWeight: s.profile.bodyWeight.filter((e) => (e.id ? e.id !== idOrDate : e.date !== idOrDate)),
          },
        })),

      // ── Computed ─────────────────────────────────────
      getExerciseProgress: (exerciseId) => {
        const { logs } = get();
        const byDate = new Map<
          string,
          { maxWeight: number; totalVolume: number; totalSets: number; totalReps: number }
        >();

        logs.forEach((log) => {
          const setsForExercise = log.sets.filter(
            (s) => s.exerciseId === exerciseId
          );
          if (!setsForExercise.length) return;

          const existing = byDate.get(log.date) || {
            maxWeight: 0,
            totalVolume: 0,
            totalSets: 0,
            totalReps: 0,
          };
          byDate.set(log.date, {
            maxWeight: Math.max(
              existing.maxWeight,
              ...setsForExercise.map((s) => s.weight)
            ),
            totalVolume:
              existing.totalVolume +
              setsForExercise.reduce((a, s) => a + s.volume, 0),
            totalSets: existing.totalSets + setsForExercise.length,
            totalReps:
              existing.totalReps +
              setsForExercise.reduce((a, s) => a + s.reps, 0),
          });
        });

        const dataPoints = Array.from(byDate.entries())
          .map(([date, data]) => ({ date, ...data }))
          .sort((a, b) => a.date.localeCompare(b.date));

        const isPlateauing =
          dataPoints.length >= 3 &&
          dataPoints
            .slice(-3)
            .every((p) => p.maxWeight === dataPoints[dataPoints.length - 1].maxWeight);

        const exerciseName =
          logs
            .flatMap((l) => l.sets)
            .find((s) => s.exerciseId === exerciseId)?.exerciseName || exerciseId;

        return { exerciseId, exerciseName, dataPoints, isPlateauing };
      },

      getWeeklyVolume: () => {
        const { logs } = get();
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const result = days.map((day) => ({ day, volume: 0 }));

        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const dayIndex = d.getDay();
          const log = logs.find((l) => l.date === dateStr);
          if (log) {
            result[dayIndex].volume = log.totalVolume;
          }
        }
        return result;
      },

      getCurrentStreak: () => {
        const { logs } = get();
        if (!logs.length) return 0;
        const sortedDates = [...new Set(logs.map((l) => l.date))].sort(
          (a, b) => b.localeCompare(a)
        );

        let streak = 0;
        const today = todayISO();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (sortedDates[0] !== today && sortedDates[0] !== yesterdayStr)
          return 0;

        let checkDate = sortedDates[0];
        for (const date of sortedDates) {
          if (date === checkDate) {
            streak++;
            const prev = new Date(checkDate);
            prev.setDate(prev.getDate() - 1);
            checkDate = prev.toISOString().split('T')[0];
          } else {
            break;
          }
        }
        return streak;
      },

      // Get the most recent log for a given day name (for "last time" hints)
      getLastSessionForDay: (dayName) => {
        const { logs } = get();
        return logs.find((l) => l.dayName === dayName) ?? null;
      },
    }),
    {
      name: 'gym-tracker-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
