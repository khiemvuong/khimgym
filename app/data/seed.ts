import {
  Exercise,
  MuscleGroup,
  WorkoutProgram,
} from '../types/gym';

// ============================
// Seed Exercise Library
// ============================
export const EXERCISE_LIBRARY: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', category: 'compound' },
  { id: 'incline-bench', name: 'Incline Bench Press', muscleGroup: 'chest', category: 'compound' },
  { id: 'chest-fly', name: 'Dumbbell Chest Fly', muscleGroup: 'chest', category: 'isolation' },
  { id: 'pushup', name: 'Push-Up', muscleGroup: 'chest', category: 'compound' },
  { id: 'cable-crossover', name: 'Cable Crossover', muscleGroup: 'chest', category: 'isolation' },
  { id: 'chest-press-machine', name: 'Ép Ngực Máy (Chest Press)', muscleGroup: 'chest', category: 'compound' },

  // Back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', category: 'compound' },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'back', category: 'compound' },
  { id: 'pullup', name: 'Pull-Up', muscleGroup: 'back', category: 'compound' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', category: 'compound' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscleGroup: 'back', category: 'compound' },
  { id: 'db-row', name: 'Dumbbell Row', muscleGroup: 'back', category: 'isolation' },

  // Shoulders
  { id: 'ohp', name: 'Overhead Press', muscleGroup: 'shoulders', category: 'compound' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'shoulders', category: 'isolation' },
  { id: 'front-raise', name: 'Front Raise', muscleGroup: 'shoulders', category: 'isolation' },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'shoulders', category: 'isolation' },
  { id: 'db-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', category: 'compound' },

  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'biceps', category: 'isolation' },
  { id: 'db-curl', name: 'Dumbbell Curl', muscleGroup: 'biceps', category: 'isolation' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'biceps', category: 'isolation' },
  { id: 'incline-curl', name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', category: 'isolation' },

  // Triceps
  { id: 'tricep-dipbar', name: 'Dip (Tricep)', muscleGroup: 'triceps', category: 'compound' },
  { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'triceps', category: 'isolation' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscleGroup: 'triceps', category: 'isolation' },
  { id: 'overhead-extension', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', category: 'isolation' },

  // Core
  { id: 'plank', name: 'Plank', muscleGroup: 'core', category: 'isolation' },
  { id: 'crunch', name: 'Crunch', muscleGroup: 'core', category: 'isolation' },
  { id: 'leg-raise', name: 'Leg Raise', muscleGroup: 'core', category: 'isolation' },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'core', category: 'isolation' },

  // Quads
  { id: 'squat', name: 'Barbell Squat', muscleGroup: 'quads', category: 'compound' },
  { id: 'goblet-squat', name: 'Goblet Squat', muscleGroup: 'quads', category: 'compound' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'quads', category: 'compound' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'quads', category: 'isolation' },
  { id: 'walking-lunge', name: 'Walking Lunge', muscleGroup: 'quads', category: 'compound' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscleGroup: 'quads', category: 'compound' },

  // Hamstrings
  { id: 'rdl', name: 'Romanian Deadlift', muscleGroup: 'hamstrings', category: 'compound' },
  { id: 'leg-curl', name: 'Lying Leg Curl', muscleGroup: 'hamstrings', category: 'isolation' },
  { id: 'nordic-curl', name: 'Nordic Curl', muscleGroup: 'hamstrings', category: 'compound' },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'glutes', category: 'compound' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'glutes', category: 'isolation' },
  { id: 'cable-kickback', name: 'Cable Glute Kickback', muscleGroup: 'glutes', category: 'isolation' },
  { id: 'sumo-squat', name: 'Sumo Squat', muscleGroup: 'glutes', category: 'compound' },
  { id: 'hip-abduction', name: 'Hip Abduction (Máy)', muscleGroup: 'glutes', category: 'isolation' },

  // Calves
  { id: 'standing-calf', name: 'Standing Calf Raise', muscleGroup: 'calves', category: 'isolation' },
  { id: 'seated-calf', name: 'Seated Calf Raise', muscleGroup: 'calves', category: 'isolation' },

  // Cardio
  { id: 'treadmill', name: 'Treadmill', muscleGroup: 'cardio', category: 'cardio' },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'cardio', category: 'cardio' },
  { id: 'rowing', name: 'Rowing Machine', muscleGroup: 'cardio', category: 'cardio' },
];

const ex = (id: string) => EXERCISE_LIBRARY.find(e => e.id === id)!;

// ============================
// Seed Programs
// ============================
export const DEFAULT_PROGRAMS: WorkoutProgram[] = [
  {
    id: 'upper-lower-women',
    name: '4-Day Upper/Lower Split (Women)',
    description: 'Chương trình 4 ngày tập mỗi tuần, chia nhóm cơ Upper Body và Lower Body. Phù hợp tăng cơ và giảm mỡ cho phụ nữ.',
    goal: 'hypertrophy',
    level: 'intermediate',
    daysPerWeek: 4,
    isDefault: true,
    days: [
      {
        id: 'ul-upper-a',
        name: 'Upper A — Push Focus',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        exercises: [
          ex('bench-press'),
          ex('incline-bench'),
          ex('ohp'),
          ex('lateral-raise'),
          ex('tricep-pushdown'),
          ex('chest-press-machine'),
        ],
      },
      {
        id: 'ul-lower-a',
        name: 'Lower A — Quad Focus',
        muscleGroups: ['quads', 'core', 'glutes'],
        exercises: [
          ex('squat'),
          ex('leg-press'),
          ex('leg-extension'),
          ex('bulgarian-split-squat'),
          ex('leg-raise'),
          ex('glute-bridge'),
          ex('crunch'),
        ],
      },
      {
        id: 'ul-upper-b',
        name: 'Upper B — Pull Focus',
        muscleGroups: ['back', 'shoulders', 'biceps'],
        exercises: [
          ex('barbell-row'),
          ex('lat-pulldown'),
          ex('db-row'),
          ex('face-pull'),
          ex('barbell-curl'),
          ex('hammer-curl'),
        ],
      },
      {
        id: 'ul-lower-b',
        name: 'Lower B — Posterior Chain',
        muscleGroups: ['hamstrings', 'glutes', 'calves'],
        exercises: [
          ex('rdl'),
          ex('leg-curl'),
          ex('hip-thrust'),
          ex('cable-kickback'),
          ex('sumo-squat'),
          ex('hip-abduction'),
          ex('standing-calf'),
        ],
      },
    ],
  },
  {
    id: 'ppl',
    name: 'PPL — Push Pull Legs (6 ngày)',
    description: 'Push Pull Legs 6 ngày/tuần. Tần suất cao, tốt cho intermediate muốn tăng thể tích tập luyện.',
    goal: 'hypertrophy',
    level: 'intermediate',
    daysPerWeek: 6,
    days: [
      {
        id: 'ppl-push',
        name: 'Push — Ngực/Vai/Triceps',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        exercises: [ex('bench-press'), ex('ohp'), ex('incline-bench'), ex('lateral-raise'), ex('skull-crusher'), ex('cable-crossover')],
      },
      {
        id: 'ppl-pull',
        name: 'Pull — Lưng/Biceps',
        muscleGroups: ['back', 'biceps'],
        exercises: [ex('deadlift'), ex('pullup'), ex('barbell-row'), ex('lat-pulldown'), ex('barbell-curl'), ex('incline-curl')],
      },
      {
        id: 'ppl-legs',
        name: 'Legs — Chân toàn diện',
        muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'],
        exercises: [ex('squat'), ex('rdl'), ex('leg-press'), ex('hip-thrust'), ex('leg-curl'), ex('standing-calf')],
      },
    ],
  },
  {
    id: 'full-body-beginner',
    name: 'Full Body — Người Mới Bắt Đầu (3 ngày)',
    description: 'Tập toàn thân 3 ngày/tuần. Lý tưởng cho người mới, tập trung các bài tập cơ bản.',
    goal: 'general',
    level: 'beginner',
    daysPerWeek: 3,
    days: [
      {
        id: 'fb-a',
        name: 'Buổi A',
        muscleGroups: ['chest', 'back', 'quads', 'core'],
        exercises: [ex('squat'), ex('bench-press'), ex('barbell-row'), ex('ohp'), ex('deadlift'), ex('plank')],
      },
      {
        id: 'fb-b',
        name: 'Buổi B',
        muscleGroups: ['glutes', 'hamstrings', 'shoulders', 'biceps', 'triceps'],
        exercises: [ex('goblet-squat'), ex('rdl'), ex('lat-pulldown'), ex('lateral-raise'), ex('db-curl'), ex('tricep-pushdown')],
      },
      {
        id: 'fb-c',
        name: 'Buổi C',
        muscleGroups: ['full_body'],
        exercises: [ex('walking-lunge'), ex('hip-thrust'), ex('pushup'), ex('seated-cable-row'), ex('face-pull'), ex('crunch')],
      },
    ],
  },
];

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Ngực',
  back: 'Lưng',
  shoulders: 'Vai',
  biceps: 'Bắp tay trước',
  triceps: 'Bắp tay sau',
  forearms: 'Cẳng tay',
  core: 'Core / Bụng',
  quads: 'Đùi trước',
  hamstrings: 'Đùi sau',
  glutes: 'Mông',
  calves: 'Bắp chân',
  full_body: 'Toàn thân',
  cardio: 'Cardio',
};

export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  chest: '#f472b6',
  back: '#60a5fa',
  shoulders: '#a78bfa',
  biceps: '#34d399',
  triceps: '#fb923c',
  forearms: '#facc15',
  core: '#f87171',
  quads: '#38bdf8',
  hamstrings: '#c084fc',
  glutes: '#f9a8d4',
  calves: '#86efac',
  full_body: '#e2e8f0',
  cardio: '#fbbf24',
};
