import type { Metadata } from 'next';
import DashboardView from './DashboardView';

export const metadata: Metadata = {
  title: 'Dashboard — GymTracker Pro',
  description: 'Tổng quan tiến độ tập luyện: streak, volume tuần này, buổi tập gần nhất.',
};

// Server Component shell — no 'use client', enables metadata + faster initial HTML
export default function DashboardPage() {
  return <DashboardView />;
}
