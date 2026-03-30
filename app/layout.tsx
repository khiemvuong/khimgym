import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/layout/Sidebar';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'GymTracker — Quản lý quy trình tập gym',
  description:
    'Ứng dụng theo dõi và quản lý quy trình tập gym. Log buổi tập, theo dõi tiến độ, phân tích progressive overload.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
