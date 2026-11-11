import React, { useState } from 'react';
import { LucideIcon, ChevronLeft, ChevronRight, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  hasDot?: boolean;
}

export interface NavGroup {
  name?: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeNav: string;
  onSelectNav: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  brandName?: string;
  brandTag?: string;
  navGroups: NavGroup[];
  user?: {
    fullName: string;
    role: string;
    avatarUrl?: string | null;
  };
  onLogout?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isExpanded,
  onToggleExpand,
  activeNav,
  onSelectNav,
  mobileOpen,
  onCloseMobile,
  brandName = 'Marhas LMS',
  brandTag = 'LEARNING PLATFORM',
  navGroups,
  user = { fullName: 'Pengguna', role: 'Anggota' },
  onLogout,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSelect = (id: string) => {
    onSelectNav(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleTriggerLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) onLogout();
  };

  const avatarSrc =
    user?.avatarUrl ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.fullName || 'User')}`;

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`dash-sidebar ${isExpanded ? 'is-expanded' : 'is-minimized'} ${
          mobileOpen ? 'is-mobile-open' : ''
        }`}
        aria-label="Sidebar Navigasi LMS"
      >
        {/* Floating Edge Toggle Button for Minimize / Extend */}
        <button
          type="button"
          className="sidebar-edge-toggle"
          onClick={onToggleExpand}
          aria-label={isExpanded ? 'Kecilkan Menu' : 'Perluas Menu'}
          title={isExpanded ? 'Kecilkan Menu' : 'Perluas Menu'}
        >
          {isExpanded ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Top: Brand Logo */}
        <div>
          <Link
            to="/"
            className="sidebar-brand"
            title="Kembali ke Beranda"
            onClick={onCloseMobile}
          >
            {/* Logo X / Clover Geometris Pengganti Huruf K */}
            <div className="sidebar-brand__mark">
              <svg
                className="w-5 h-5 fill-white"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
              </svg>
            </div>
            <div className="sidebar-brand__text hidden sm:flex">
              <span className="sidebar-brand__name">{brandName}</span>
              <span className="sidebar-brand__tag">{brandTag}</span>
            </div>
          </Link>

          {/* Navigation Section */}
          <nav className="sidebar-section" aria-label="Menu Utama">
            {navGroups.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                {group.name && isExpanded && (
                  <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {group.name}
                  </div>
                )}
                {group.name && !isExpanded && gIdx > 0 && (
                  <div className="sidebar-divider" />
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`sidebar-nav-btn ${active ? 'is-active' : ''}`}
                      onClick={() => handleSelect(item.id)}
                      data-tooltip={item.label}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="sidebar-nav-btn__icon">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="sidebar-nav-btn__label">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="sidebar-nav-btn__badge">{item.badge}</span>
                      )}
                      {item.hasDot && !active && (
                        <span className="sidebar-nav-btn__dot" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Bottom Group: Dock Toggle & User Profile */}
        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-nav-btn"
            onClick={onToggleExpand}
            data-tooltip={isExpanded ? 'Kecilkan Menu' : 'Perluas Menu'}
            aria-label={isExpanded ? 'Kecilkan Menu' : 'Perluas Menu'}
          >
            <span className="sidebar-nav-btn__icon">
              {isExpanded ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </span>
            <span className="sidebar-nav-btn__label">
              {isExpanded ? 'Kecilkan Menu' : 'Perluas Menu'}
            </span>
          </button>

          <div
            className="sidebar-profile"
            title={`${user?.fullName} — ${user?.role}`}
          >
            <div className="sidebar-avatar-ring">
              <img src={avatarSrc} alt={user?.fullName} />
            </div>
            <div className="sidebar-profile__meta">
              <span className="sidebar-profile__name">{user?.fullName}</span>
              <span className="sidebar-profile__role">{user?.role}</span>
            </div>
            {isExpanded && onLogout && (
              <button
                type="button"
                onClick={handleTriggerLogout}
                className="ml-auto text-slate-400 hover:text-rose-600 transition-colors p-1"
                title="Keluar dari akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Confirmation Dialog for Logout */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Yakin Ingin Keluar?"
        description="Sesi Anda saat ini akan diakhiri. Anda perlu memasukkan kredensial kembali untuk mengakses dashboard sekolah."
        confirmLabel="Ya, Keluar Akun"
        cancelLabel="Tetap di Sini"
        variant="danger"
        icon="logout"
      />
    </>
  );
};
