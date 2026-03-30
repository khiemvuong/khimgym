'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { useGymStore } from '../store/gymStore';
import { useShallow } from 'zustand/react/shallow';
import {
  Flame, Dumbbell, BarChart2, Calendar,
  ChevronRight, PlayCircle, Zap, TrendingUp, Trophy,
} from 'lucide-react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

type WeeklyChartProps = { data: { day: string; volume: number }[] };

// ── Dynamic import Recharts — MUST have ssr:false (uses browser SVG APIs)
const WeeklyChart = dynamic<WeeklyChartProps>(
  () => import('./WeeklyChart'),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Đang tải biểu đồ...</div>
      </div>
    ),
  }
);

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, sub, gradVar, delay = 0,
}: {
  icon: React.ReactNode; label: string; value: string | number;
  sub?: string; gradVar?: string; delay?: number;
}) {
  return (
    <div
      className="stat-card animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        ['--grad-icon' as string]: gradVar || 'var(--grad-purple)',
      }}
    >
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}

// ── Main View ──────────────────────────────────────────────────────────────
export default function DashboardView() {
  // Granular selectors — only re-render when relevant slices change
  const profile = useGymStore(s => s.profile);
  const logs = useGymStore(s => s.logs);
  const activeLog = useGymStore(s => s.activeLog);
  const { programs, getWeeklyVolume, getCurrentStreak } = useGymStore(
    useShallow(s => ({
      programs: s.programs,
      getWeeklyVolume: s.getWeeklyVolume,
      getCurrentStreak: s.getCurrentStreak,
    }))
  );

  const streak = getCurrentStreak();
  const weeklyData = getWeeklyVolume();
  const totalVolume = logs.reduce((a, l) => a + l.totalVolume, 0);
  const activeProgram = programs.find(p => p.id === profile.activeProgram);
  const recentLogs = logs.slice(0, 3);

  const today = new Date();
  const thisWeekSessions = logs.filter(l => {
    const diff = (today.getTime() - new Date(l.date + 'T00:00:00').getTime()) / 86400000;
    return diff < 7;
  }).length;

  const weeklyTotal = weeklyData.reduce((a, d) => a + d.volume, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className={`${styles.header} animate-fade-up`}>
        <div>
          <h1 className="text-gradient">Xin chào, {profile.name} 👋</h1>
          <p className="text-secondary mt-1">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        <Link href="/log" className="btn btn-primary">
          <PlayCircle size={18} /> Bắt đầu tập
        </Link>
      </div>

      {/* Active workout banner */}
      {activeLog && (
        <Link href="/log" className={`${styles.activeBanner} animate-fade-up animate-pulse-glow`}>
          <Zap size={20} />
          <span>
            Bạn đang có buổi tập dang dở: <strong>{activeLog.dayName}</strong> —{' '}
            {activeLog.sets.length} sets đã ghi
          </span>
          <ChevronRight size={18} />
        </Link>
      )}

      {/* Stat Cards */}
      <div className={`grid grid-4 gap-4 mt-6 ${styles.statsGrid}`}>
        <StatCard icon={<Flame size={24} />} label="Streak hiện tại"
          value={`${streak} ngày`} sub="liên tiếp" gradVar="var(--grad-hot)" delay={50} />
        <StatCard icon={<Dumbbell size={24} />} label="Tổng buổi tập"
          value={profile.totalWorkouts} sub="all-time" gradVar="var(--grad-purple)" delay={100} />
        <StatCard icon={<BarChart2 size={24} />} label="Volume tuần này"
          value={`${weeklyTotal.toLocaleString()} kg`} sub="7 ngày qua"
          gradVar="var(--grad-cyan)" delay={150} />
        <StatCard icon={<Calendar size={24} />} label="Buổi tập tuần này"
          value={thisWeekSessions} sub="sessions" gradVar="var(--grad-success)" delay={200} />
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Weekly Volume Chart — lazy loaded */}
        <div className={`card animate-fade-up stagger-3 ${styles.chartCard}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Volume theo tuần</h3>
              <p className="text-sm text-secondary mt-1">Tổng volume 7 ngày qua (Sets × Reps × Kg)</p>
            </div>
            <TrendingUp size={20} className="text-accent" />
          </div>
          <WeeklyChart data={weeklyData} />
        </div>

        {/* Side Column */}
        <div className={styles.sideColumn}>
          {/* Active Program */}
          <div className="card card-accent animate-fade-up stagger-4">
            <div className="flex items-center justify-between mb-3">
              <h3>Chương trình đang tập</h3>
              <Trophy size={18} color="var(--accent-warning)" />
            </div>
            {activeProgram ? (
              <>
                <div className={styles.programName}>{activeProgram.name}</div>
                <div className="flex gap-2 mt-2">
                  <span className="badge badge-purple">{activeProgram.daysPerWeek} ngày/tuần</span>
                  <span className="badge badge-cyan">{activeProgram.level}</span>
                </div>
                <div className={styles.programDays}>
                  {activeProgram.days.map(day => (
                    <div key={day.id} className={styles.dayChip}>{day.name}</div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noProgramState}>
                <p className="text-secondary text-sm">Chưa chọn chương trình tập</p>
                <Link href="/programs" className="btn btn-primary btn-sm mt-2">Chọn ngay</Link>
              </div>
            )}
          </div>

          {/* Recent Logs */}
          <div className="card animate-fade-up stagger-5">
            <div className="flex items-center justify-between mb-3">
              <h3>Buổi tập gần nhất</h3>
              <Link href="/history" className="text-sm text-accent">Xem tất cả →</Link>
            </div>
            {recentLogs.length > 0 ? (
              <div className={styles.recentList}>
                {recentLogs.map(log => (
                  <div key={log.id} className={styles.recentItem}>
                    <div className={styles.recentItemLeft}>
                      <div className={styles.recentDate}>
                        {new Date(log.date + 'T00:00:00').toLocaleDateString('vi-VN', {
                          weekday: 'short', day: 'numeric', month: 'short',
                        })}
                      </div>
                      <div className={styles.recentDayName}>{log.dayName}</div>
                    </div>
                    <div className={styles.recentRight}>
                      <div className={styles.recentVolume}>{log.totalVolume.toLocaleString()} kg</div>
                      <div className="text-xs text-muted">{log.sets.length} sets</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Dumbbell size={32} color="var(--text-muted)" />
                <p className="text-sm text-secondary mt-2">Chưa có buổi tập nào</p>
                <Link href="/log" className="btn btn-primary btn-sm mt-3">Tập ngay</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Volume Banner */}
      <div className={`${styles.totalBanner} animate-fade-up`}>
        <div>
          <div className={styles.totalLabel}>Tổng volume all-time</div>
          <div className={styles.totalValue}>{totalVolume.toLocaleString()} <span>kg</span></div>
        </div>
        <div className={styles.totalIcon}>🏆</div>
      </div>
    </div>
  );
}
