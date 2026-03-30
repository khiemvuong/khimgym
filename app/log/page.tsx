import type { Metadata } from 'next';
import LogView from './LogView';

export const metadata: Metadata = {
  title: 'Ghi Log Buổi Tập — GymTracker Pro',
  description: 'Ghi lại sets, reps, kg cho từng bài tập trong buổi hôm nay.',
};

export default function LogPage() {
  return <LogView />;
}
