'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '0.5rem 0.75rem',
      }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
          {Number(payload[0].value).toLocaleString()} kg
        </div>
      </div>
    );
  }
  return null;
};

export default function WeeklyChart({ data }: { data: { day: string; volume: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={24}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="day" axisLine={false} tickLine={false}
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false}
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={50} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="volume" fill="url(#purpleGrad)" radius={[6, 6, 0, 0]}>
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.7} />
            </linearGradient>
          </defs>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
