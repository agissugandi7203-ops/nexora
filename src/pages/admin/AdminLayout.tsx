import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  FileCode2,
  HelpCircle,
  ClipboardList,
  Inbox,
  Award,
  Settings,
  LogOut,
  Bell,
  Search,
  ExternalLink,
  UserCheck,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

import { AdminOverview } from './tabs/AdminOverview';
import { AdminStudents } from './tabs/AdminStudents';
import { AdminClasses } from './tabs/AdminClasses';
import { AdminSubjects } from './tabs/AdminSubjects';
import { AdminMaterials } from './tabs/AdminMaterials';
import { AdminQuestionBank } from './tabs/AdminQuestionBank';
import { AdminAssignments } from './tabs/AdminAssignments';
import { AdminSubmissions } from './tabs/AdminSubmissions';
import { AdminGrading } from './tabs/AdminGrading';
import { AdminSettings } from './tabs/AdminSettings';
import { AdminApprovals } from './tabs/AdminApprovals';
import { DashboardSidebar, NavGroup } from '../../components/dashboard/DashboardSidebar';
import '../../styles/dashboard.css';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const {
    siteSettings,
    submissions,
    supabaseStatus,
    retrySupabaseConnection,
    userRegistrations,
  } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nexora_sidebar_expanded') === 'true';
    } catch {
      return true;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('nexora_sidebar_expanded', String(next));
      } catch {}
      return next;
    });
  };

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'submitted').length;
  const pendingApprovalsCount = userRegistrations.filter((r) => r.status === 'pending').length;

  const navGroups: NavGroup[] = [
    {
      name: 'Menu',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'approvals',
          label: 'Persetujuan Akun',
          icon: UserCheck,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          hasDot: pendingApprovalsCount > 0,
        },
        { id: 'assignments', label: 'Tugas dan Ujian', icon: ClipboardList },
        { id: 'materials', label: 'Materi Belajar', icon: FileCode2 },
        { id: 'students', label: 'Manajemen Siswa', icon: Users },
      ],
    },
    {
      name: 'Akademik',
      items: [
        { id: 'classes', label: 'Manajemen Kelas', icon: School },
        { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
        { id: 'question_bank', label: 'Bank Soal', icon: HelpCircle },
        { id: 'grading', label: 'Penilaian & Rekap', icon: Award },
      ],
    },
    {
      name: 'Sistem',
      items: [
        {
          id: 'submissions',
          label: 'Pengumpulan Jawaban',
          icon: Inbox,
          badge: pendingSubmissionsCount > 0 ? pendingSubmissionsCount : undefined,
        },
        { id: 'settings', label: 'Pengaturan Website', icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminOverview
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenMobileMenu={() => setSidebarOpen(true)}
          />
        );
      case 'approvals':
        return <AdminApprovals />;
      case 'students':
        return <AdminStudents />;
      case 'classes':
        return <AdminClasses />;
      case 'subjects':
        return <AdminSubjects />;
      case 'materials':
        return <AdminMaterials />;
      case 'question_bank':
        return <AdminQuestionBank />;
      case 'assignments':
        return <AdminAssignments />;
      case 'submissions':
        return <AdminSubmissions />;
      case 'grading':
        return <AdminGrading />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <AdminOverview
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenMobileMenu={() => setSidebarOpen(true)}
          />
        );
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const currentTabLabel =
    navGroups
      .flatMap((g) => g.items)
      .find((i) => i.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="nexora-dashboard-container">
      {/* 1. Himtech Modern Collapsible & Extendable Pill Sidebar */}
      <DashboardSidebar
        isExpanded={isSidebarExpanded}
        onToggleExpand={handleToggleSidebar}
        activeNav={activeTab}
        onSelectNav={(id) => setActiveTab(id)}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        brandName={siteSettings.site_name && siteSettings.site_name !== 'KODEAM' && siteSettings.site_name !== 'nexum' ? siteSettings.site_name : 'Marhas LMS'}
        brandTag="LEARNING PLATFORM"
        navGroups={navGroups}
        user={{
          fullName: currentUser?.full_name || 'Ilham Lesmana',
          role: 'Pengajar Utama',
          avatarUrl: currentUser?.avatar_url,
        }}
        onLogout={handleLogout}
      />

      {/* 2. Main Workspace Canvas */}
      <main className="dash-main">
        {/* Top Header bar for Sub-tabs (when not in Overview) */}
        {activeTab !== 'dashboard' && (
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="mobile-sidebar-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
                title="Kembali ke Dashboard Utama"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentTabLabel}
                </h2>
                <p className="text-xs text-slate-400 font-medium">{todayFormatted}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Cloud Status */}
              <button
                onClick={() => retrySupabaseConnection()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm transition-colors hover:border-slate-300 ${
                  supabaseStatus === 'connected'
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
                title="Status Koneksi Database"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseStatus === 'connected'
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-amber-500'
                  }`}
                />
                <span className="hidden sm:inline">
                  {supabaseStatus === 'connected' ? 'Cloud Terhubung' : 'Sinkronisasi'}
                </span>
              </button>

              {/* Notification Button */}
              <button
                type="button"
                onClick={() => setActiveTab('approvals')}
                className="relative p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-all hover:bg-slate-50"
                title={`${pendingApprovalsCount} Pendaftaran Menunggu Persetujuan`}
              >
                <Bell className="w-4 h-4" />
                {pendingApprovalsCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white absolute top-1 right-1 animate-pulse" />
                )}
              </button>

              {/* View Public Homepage */}
              <Link
                to="/"
                target="_blank"
                className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 shadow-sm transition-colors"
                title="Lihat Beranda Publik"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </header>
        )}

        {/* Tab Body */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
