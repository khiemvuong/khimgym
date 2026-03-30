import type { Metadata } from 'next';
import ProfileView from './ProfileView';

export const metadata: Metadata = {
  title: 'Hồ Sơ — GymTracker Pro',
  description: 'Thông tin cá nhân, cân nặng, mục tiêu và dữ liệu tập luyện.',
};

export default function ProfilePage() {
  return <ProfileView />;
}
