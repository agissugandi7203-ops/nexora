import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileCode2,
  ClipboardList,
  History,
  Award,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  Bell,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

import { StudentOverview } from './tabs/StudentOverview';
import { StudentSubjects } from './tabs/StudentSubjects';
import { StudentMaterials } from './tabs/StudentMaterials';
import { StudentAssignments } from './tabs/StudentAssignments';
import { StudentHistory } from './tabs/StudentHistory';
import { StudentGrades } from './tabs/StudentGrades';
import { StudentProfile } from './tabs/StudentProfile';
import { DashboardSidebar, NavGroup } from '../../components/dashboard/DashboardSidebar';
import '../../styles/dashboard.css';

export const StudentLayout: React.FC = () => {
  const { currentUser, currentStudent, logout } = useAuth();
  const { siteSettings, classes, assignments, submissions } = useData();
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

  const studentClass = classes.find((c) => c.id === currentStudent?.class_id);

  // Active tasks calculation
  const studentSubmissions = submissions.filter((s) => s.student_id === currentStudent?.id);
  const submittedAsgIds = studentSubmissions.map((s) => s.assignment_id);
  const activeAssignmentsCount = assignments.filter((a) => {
    if (a.is_active === false) return false;
    if (submittedAsgIds.includes(a.id)) return false;
    const allowedIds =
      Array.isArray(a.class_ids) && a.class_ids.length > 0
        ? a.class_ids
        : a.class_id
        ? [a.class_id]
        : [];
    if (allowedIds.length === 0) return true;
    return Boolean(currentStudent?.class_id && allowedIds.includes(currentStudent.class_id));
  }).length;

  const navGroups: NavGroup[] = [
    {
      name: 'Pembelajaran',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'assignments',
          label: 'Tugas & Ujian',
          icon: ClipboardList,
          badge: activeAssignmentsCount > 0 ? activeAssignmentsCount : undefined,
          hasDot: activeAssignmentsCount > 0,
        },
        { id: 'materials', label: 'Materi Belajar', icon: FileCode2 },
        { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
      ],
    },
    {
      name: 'Akademik Saya',
      items: [
        { id: 'history', label: 'Riwayat Tugas', icon: History },
        { id: 'grades', label: 'Nilai & Rapor', icon: Award },
        { id: 'profile', label: 'Profil Saya', icon: User },
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
          <StudentOverview
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenMobileMenu={() => setSidebarOpen(true)}
          />
        );
      case 'subjects':
        return <StudentSubjects onNavigate={(tab) => setActiveTab(tab)} />;
      case 'materials':
        return <StudentMaterials />;
      case 'assignments':
        return <StudentAssignments />;
      case 'history':
        return <StudentHistory />;
      case 'grades':
        return <StudentGrades />;
      case 'profile':
        return <StudentProfile />;
      default:
        return (
          <StudentOverview
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
      .find((i) => i.id === activeTab)?.label || 'Dashboard Siswa';

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
        brandTag="PORTAL SISWA"
        navGroups={navGroups}
        user={{
          fullName: currentUser?.full_name || 'Siswa',
          role: studentClass?.name || 'Siswa Aktif',
          avatarUrl:
            currentUser?.avatar_url ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${currentStudent?.nis_nisn || 'student'}`,
        }}
        onLogout={handleLogout}
      />

      {/* 2. Main Workspace Canvas */}
      <main className="dash-main">
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
                <p className="text-xs text-slate-400 font-medium">
                  {todayFormatted} &bull;{' '}
                  <span className="text-blue-600 font-semibold">
                    {studentClass?.name || 'Kelas Aktif'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Notification Button */}
              <button
                type="button"
                onClick={() => setActiveTab('assignments')}
                className="relative p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-all hover:bg-slate-50"
                title={`${activeAssignmentsCount} Tugas Belum Selesai`}
              >
                <Bell className="w-4 h-4" />
                {activeAssignmentsCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white absolute top-1 right-1 animate-pulse" />
                )}
              </button>

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

        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
