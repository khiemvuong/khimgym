// ============================
// Core Data Types
// ============================

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full_body'
  | 'cardio';

export type ExerciseCategory = 'compound' | 'isolation' | 'cardio' | 'stretching';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  category: ExerciseCategory;
  instructions?: string;
}

// A logged set within a workout session
export interface LoggedSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number; // kg
  reps: number;
  volume: number; // weight × reps
  notes?: string;
}

// A complete workout log for one session
export interface WorkoutLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  programId?: string;
  dayId?: string;   // which ProgramDay was used
  dayName: string;
  sets: LoggedSet[];
  totalVolume: number;
  duration?: number; // minutes
  notes?: string;
}

// A day within a program (e.g. "Upper A")
export interface ProgramDay {
  id: string;
  name: string;
  exercises: Exercise[];
  muscleGroups: MuscleGroup[];
}

// A full training program (e.g. "4-Day Upper/Lower Split")
export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  days: ProgramDay[];
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general';
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  isDefault?: boolean;
}

// User body weight entry
export interface BodyWeightEntry {
  id?: string;
  date: string; // Full ISO timestamp
  weight: number; // kg
}

// User profile
export interface UserProfile {
  name: string;
  goal: WorkoutProgram['goal'];
  bodyWeight: BodyWeightEntry[];
  activeProgram?: string; // programId
  weeklyStreak: number;
  totalWorkouts: number;
}

// Progress data for charts
export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  dataPoints: {
    date: string;
    maxWeight: number;
    totalVolume: number;
    totalSets: number;
    totalReps: number;
  }[];
  isPlateauing: boolean; // same max weight for 3+ weeks
}
