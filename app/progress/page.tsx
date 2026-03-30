import type { Metadata } from 'next';
import ProgressView from './ProgressView';

export const metadata: Metadata = {
  title: 'Tiến độ — GymTracker Pro',
  description: 'So sánh tiến độ các buổi tập: kg, reps, volume theo từng ngày tập.',
};

export default function ProgressPage() {
  return <ProgressView />;
}
