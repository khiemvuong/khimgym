'use client';

import { useState } from 'react';
import { useGymStore } from '../store/gymStore';
import { User, Check, Scale, Edit3, Weight, Database, Trash2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import styles from './profile.module.css';

const GOAL_OPTIONS = [
  { value: 'strength', label: '💪 Sức mạnh' },
  { value: 'hypertrophy', label: '🏋️ Tăng cơ' },
  { value: 'endurance', label: '🏃 Bền bỉ' },
  { value: 'weight_loss', label: '🔥 Giảm mỡ' },
  { value: 'general', label: '⚡ Toàn diện' },
];

// ── Seed demo workout logs for testing ───────────────────────────────
function seedDemoLogs() {
  const store = useGymStore.getState();

  // Week 1 — Upper A
  store.startWorkout('Upper A — Push Focus', 'upper-lower-women');
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 30, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 30, reps: 9 });
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 30, reps: 8 });
  store.addSetToActiveLog({ exerciseId: 'ohp', exerciseName: 'Overhead Press', weight: 20, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'ohp', exerciseName: 'Overhead Press', weight: 20, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', weight: 8, reps: 15 });
  store.addSetToActiveLog({ exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', weight: 8, reps: 12 });
  // Manually set date to simulate past
  const log1 = store.activeLog;
  store.finishWorkout('Cảm thấy ổn', 55);
  // Patch date
  const s = useGymStore.getState();
  if (s.logs[0]) {
    useGymStore.setState((state) => ({
      logs: state.logs.map((l, i) => i === 0 ? { ...l, date: getDateDaysAgo(14) } : l),
    }));
  }

  // Week 2 — Upper A (improved)
  store.startWorkout('Upper A — Push Focus', 'upper-lower-women');
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 32.5, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 32.5, reps: 9 });
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 32.5, reps: 8 });
  store.addSetToActiveLog({ exerciseId: 'ohp', exerciseName: 'Overhead Press', weight: 20, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'ohp', exerciseName: 'Overhead Press', weight: 20, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', weight: 10, reps: 15 });
  store.addSetToActiveLog({ exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', weight: 10, reps: 13 });
  store.finishWorkout('PR bench!', 58);
  useGymStore.setState((state) => ({
    logs: state.logs.map((l, i) => i === 0 ? { ...l, date: getDateDaysAgo(7) } : l),
  }));

  // Week 3 — Upper A (more improvement)
  store.startWorkout('Upper A — Push Focus', 'upper-lower-women');
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 35, reps: 8 });
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 35, reps: 8 });
  store.addSetToActiveLog({ exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 35, reps: 7 });
  store.addSetToActiveLog({ exerciseId: 'ohp', exerciseName: 'Overhead Press', weight: 22.5, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'ohp', exerciseName: 'Overhead Press', weight: 22.5, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', weight: 10, reps: 15 });
  store.addSetToActiveLog({ exerciseId: 'lateral-raise', exerciseName: 'Lateral Raise', weight: 10, reps: 15 });
  store.addSetToActiveLog({ exerciseId: 'tricep-pushdown', exerciseName: 'Tricep Pushdown', weight: 15, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'tricep-pushdown', exerciseName: 'Tricep Pushdown', weight: 15, reps: 12 });
  store.finishWorkout('Thêm tricep vào, cảm thấy mạnh hơn', 65);

  // Week 1 — Lower A
  store.startWorkout('Lower A — Quad Focus', 'upper-lower-women');
  store.addSetToActiveLog({ exerciseId: 'squat', exerciseName: 'Barbell Squat', weight: 40, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'squat', exerciseName: 'Barbell Squat', weight: 40, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'squat', exerciseName: 'Barbell Squat', weight: 40, reps: 8 });
  store.addSetToActiveLog({ exerciseId: 'leg-press', exerciseName: 'Leg Press', weight: 60, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'leg-press', exerciseName: 'Leg Press', weight: 60, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'hip-thrust', exerciseName: 'Hip Thrust', weight: 50, reps: 12 });
  store.finishWorkout('Chân mỏi nhưng ổn', 70);
  useGymStore.setState((state) => ({
    logs: state.logs.map((l, i) => i === 0 ? { ...l, date: getDateDaysAgo(12) } : l),
  }));

  // Week 2 — Lower A (improved squat)
  store.startWorkout('Lower A — Quad Focus', 'upper-lower-women');
  store.addSetToActiveLog({ exerciseId: 'squat', exerciseName: 'Barbell Squat', weight: 42.5, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'squat', exerciseName: 'Barbell Squat', weight: 42.5, reps: 10 });
  store.addSetToActiveLog({ exerciseId: 'squat', exerciseName: 'Barbell Squat', weight: 42.5, reps: 9 });
  store.addSetToActiveLog({ exerciseId: 'leg-press', exerciseName: 'Leg Press', weight: 65, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'leg-press', exerciseName: 'Leg Press', weight: 65, reps: 11 });
  store.addSetToActiveLog({ exerciseId: 'hip-thrust', exerciseName: 'Hip Thrust', weight: 55, reps: 12 });
  store.addSetToActiveLog({ exerciseId: 'hip-thrust', exerciseName: 'Hip Thrust', weight: 55, reps: 10 });
  store.finishWorkout('Squat PR!', 68);
  useGymStore.setState((state) => ({
    logs: state.logs.map((l, i) => i === 0 ? { ...l, date: getDateDaysAgo(5) } : l),
  }));
}

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

export default function ProfileView() {
  const { profile, updateProfile, addBodyWeight, deleteBodyWeight, logs } = useGymStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.goal);
  const [newWeight, setNewWeight] = useState('');
  const [seeded, setSeeded] = useState(false);

  const handleSave = () => {
    updateProfile({ name, goal });
    setEditing(false);
  };

  const handleAddWeight = () => {
    if (!newWeight) return;
    addBodyWeight(parseFloat(newWeight));
    setNewWeight('');
  };

  const handleSeedDemo = () => {
    seedDemoLogs();
    setSeeded(true);
  };

  const handleClearLogs = () => {
    useGymStore.setState({ logs: [], activeLog: null });
    useGymStore.setState((s) => ({
      profile: { ...s.profile, totalWorkouts: 0, weeklyStreak: 0 },
    }));
  };

  const weightChartData = profile.bodyWeight.map((bw) => {
    const isIso = bw.date.includes('T');
    const d = new Date(isIso ? bw.date : bw.date + 'T00:00:00');
    return {
      date: d.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'short',
      }),
      label: isIso
        ? `${d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
        : d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' }),
      'Cân nặng': bw.weight,
    };
  });

  const lastWeight = profile.bodyWeight[profile.bodyWeight.length - 1]?.weight;
  const firstWeight = profile.bodyWeight[0]?.weight;
  const weightChange = lastWeight && firstWeight ? lastWeight - firstWeight : null;

  return (
    <div className="page-container">
      <div className={`${styles.header} animate-fade-up`}>
        <h1>
          <span className="text-gradient">Hồ sơ</span> cá nhân
        </h1>
      </div>

      <div className={styles.grid}>
        {/* Profile Card */}
        <div className={`card animate-fade-up stagger-1 ${styles.profileCard}`}>
          <div className={styles.avatar}>
            <User size={36} />
          </div>

          {editing ? (
            <div className={styles.editForm}>
              <div>
                <label className={styles.fieldLabel}>Tên</label>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="profile-name-input"
                />
              </div>
              <div>
                <label className={styles.fieldLabel}>Mục tiêu</label>
                <select
                  className="input"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as any)}
                  id="profile-goal-select"
                >
                  {GOAL_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(false)}>
                  Hủy
                </button>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={handleSave} id="save-profile-btn">
                  <Check size={16} /> Lưu
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.profileName}>{profile.name}</div>
              <div className={styles.profileGoal}>
                {GOAL_OPTIONS.find((g) => g.value === profile.goal)?.label || profile.goal}
              </div>
              <button
                className="btn btn-secondary btn-sm mt-4"
                onClick={() => setEditing(true)}
                id="edit-profile-btn"
              >
                <Edit3 size={14} /> Chỉnh sửa
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className={`card animate-fade-up stagger-2 ${styles.statsCard}`}>
          <h3>Thống kê</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statVal}>{profile.totalWorkouts}</div>
              <div className={styles.statLabel}>Tổng buổi tập</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>
                {logs.reduce((a, l) => a + l.totalVolume, 0).toLocaleString()}
                <span> kg</span>
              </div>
              <div className={styles.statLabel}>Volume all-time</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>
                {logs.reduce((a, l) => a + l.sets.length, 0)}
              </div>
              <div className={styles.statLabel}>Tổng sets</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statVal}>
                {logs.length
                  ? Math.round(logs.reduce((a, l) => a + l.sets.length, 0) / logs.length)
                  : 0}
              </div>
              <div className={styles.statLabel}>Sets / buổi TB</div>
            </div>
          </div>

          {/* Demo data section */}
          <div className={styles.demoSection}>
            <div className={styles.demoTitle}>🧪 Dữ liệu Demo</div>
            <p className="text-xs text-muted" style={{ marginBottom: '0.75rem' }}>
              Seed dữ liệu mẫu để xem tính năng So sánh tiến độ
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSeedDemo}
                disabled={seeded}
                id="seed-demo-btn"
              >
                <Database size={14} />
                {seeded ? 'Đã seed!' : 'Seed Demo Data'}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleClearLogs}
                id="clear-logs-btn"
              >
                <Trash2 size={14} /> Xóa tất cả logs
              </button>
            </div>
          </div>
        </div>

        {/* Body Weight Tracker */}
        <div className={`card animate-fade-up stagger-3 ${styles.weightCard}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <Scale size={18} color="var(--accent-secondary)" /> Theo dõi cân nặng
            </h3>
            {lastWeight && (
              <div className={styles.currentWeight}>
                {lastWeight} <span>kg</span>
              </div>
            )}
          </div>

          <div className={styles.addWeightRow}>
            <input
              className="input"
              type="number"
              step="0.1"
              min="30"
              placeholder="Nhập cân nặng hôm nay (kg)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              id="body-weight-input"
            />
            <button
              className="btn btn-primary"
              onClick={handleAddWeight}
              disabled={!newWeight}
              id="add-body-weight-btn"
            >
              <Check size={16} /> Lưu
            </button>
          </div>

          {weightChange !== null && (
            <div
              className={styles.weightChange}
              style={{
                color: weightChange < 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
              }}
            >
              {weightChange >= 0 ? '+' : ''}
              {weightChange.toFixed(1)} kg kể từ lần đầu ghi nhận
            </div>
          )}

          {weightChartData.length > 1 && (
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weightChartData}>
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'var(--text-muted)', fontSize: 12 }}
                    itemStyle={{ color: 'var(--accent-secondary)', fontWeight: 700 }}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.label || label}
                  />
                  <Area
                    type="monotone"
                    dataKey="Cân nặng"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fill="url(#cyanGrad)"
                    dot={{ fill: '#06b6d4', r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {weightChartData.length === 0 && (
            <div className={styles.noWeightData}>
              <Weight size={32} color="var(--text-muted)" />
              <p className="text-sm text-secondary mt-2">Chưa có dữ liệu cân nặng</p>
            </div>
          )}

          {/* History List */}
          {profile.bodyWeight.length > 0 && (
            <div className={styles.weightHistoryList}>
              <h4 className="mt-4 mb-2 text-sm text-secondary">Lịch sử ghi chú</h4>
              <div className={styles.historyScroll}>
                {[...profile.bodyWeight].reverse().map((bw, i) => {
                  const isIso = bw.date.includes('T');
                  const d = new Date(isIso ? bw.date : bw.date + 'T00:00:00');
                  return (
                    <div key={bw.id || i} className={styles.historyItem}>
                      <div>
                        <div className={styles.historyWeight}>{bw.weight} <span>kg</span></div>
                        <div className={styles.historyDate}>
                          {d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          {isIso && ` • ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
                        </div>
                      </div>
                      <button
                        className="btn-icon text-muted"
                        onClick={() => deleteBodyWeight(bw.id || bw.date)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
