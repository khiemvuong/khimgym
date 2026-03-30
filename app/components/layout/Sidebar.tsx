'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  History,
  TrendingUp,
  Dumbbell,
  User,
  Zap,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/programs', label: 'Chương trình', icon: Dumbbell },
  { href: '/log', label: 'Ghi Log', icon: ClipboardList },
  { href: '/history', label: 'Lịch sử', icon: History },
  { href: '/progress', label: 'Tiến độ', icon: TrendingUp },
  { href: '/profile', label: 'Hồ sơ', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={22} />
          </div>
          <div>
            <div className={styles.logoTitle}>Khim Gym</div>
            <div className={styles.logoSub}>Pro</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={18} className={styles.navIcon} />
                <span>{label}</span>
                {isActive && <div className={styles.activeDot} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.footerCard}>
            <div className={styles.footerIcon}>💪</div>
            <div>
              <div className={styles.footerTitle}>Keep pushing!</div>
              <div className={styles.footerSub}>No days off mindset</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className={styles.mobileNav}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}
            >
              <Icon size={20} />
              <span className={styles.mobileNavLabel}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
