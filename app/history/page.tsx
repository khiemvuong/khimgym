import type { Metadata } from 'next';
import HistoryView from './HistoryView';

export const metadata: Metadata = {
  title: 'Lịch sử tập — GymTracker Pro',
  description: 'Toàn bộ lịch sử buổi tập: volume, sets, bài tập theo từng ngày.',
};

export default function HistoryPage() {
  return <HistoryView />;
}
