import type { Metadata } from 'next';
import ProgramsView from './ProgramsView';

export const metadata: Metadata = {
  title: 'Chương Trình Tập — GymTracker Pro',
  description: 'Xem và chọn chương trình tập luyện phù hợp: Upper/Lower, PPL, Full Body.',
};

export default function ProgramsPage() {
  return <ProgramsView />;
}
