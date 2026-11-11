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
  Sparkles,
  Menu,
  X,
  School,
  Search,
  Bell,
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

export const StudentLayout: React.FC = () => {
  const { currentUser, currentStudent, logout } = useAuth();
  const { siteSettings, classes, assignments, submissions } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentClass = classes.find(c => c.id === currentStudent?.class_id);

  // Active tasks calculation
  const studentSubmissions = submissions.filter(s => s.student_id === currentStudent?.id);
  const submittedAsgIds = studentSubmissions.map(s => s.assignment_id);
  const activeAssignmentsCount = assignments.filter(
    a => a.is_active !== false &&
         (!currentStudent?.class_id || !a.class_id || a.class_id === currentStudent.class_id) &&
         !submittedAsgIds.includes(a.id)
  ).length;

  const menuGroup = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'assignments', 
      label: 'Tugas & Ujian', 
      icon: ClipboardList,
      badge: activeAssignmentsCount > 0 ? activeAssignmentsCount : undefined
    },
    { id: 'materials', label: 'Materi Belajar', icon: FileCode2 },
    { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
  ];

  const academicGroup = [
    { id: 'history', label: 'Riwayat Tugas', icon: History },
    { id: 'grades', label: 'Nilai & Rapor', icon: Award },
    { id: 'profile', label: 'Profil Saya', icon: User },
  ];

  const allNavItems = [...menuGroup, ...academicGroup];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentOverview onNavigate={(tab) => setActiveTab(tab)} />;
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
        return <StudentOverview onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[#f0f2f7] text-slate-900 p-3 sm:p-5 lg:p-6 flex flex-col md:flex-row gap-6 selection:bg-[#3b5bf5] selection:text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 sticky top-3 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#3b5bf5] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
              N
            </div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">
              {siteSettings.site_name}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-semibold border border-rose-200"
        >
          Keluar
        </button>
      </div>

      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Modern Sidebar matching DealDeck layout */}
      <aside
        className={`fixed md:sticky top-6 h-[calc(100vh-3rem)] w-72 bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 z-50 flex flex-col justify-between transition-transform duration-300 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto pr-1">
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between pb-6 mb-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2a45d4] to-[#3b5bf5] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/30">
                <span className="tracking-tighter">N</span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#3b5bf5] transition-colors">
                  {siteSettings.site_name}
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">RUANG SISWA</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-6 flex-1">
            {/* GROUP 1: BELAJAR */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2.5">
                BELAJAR
              </p>
              <div className="space-y-1">
                {menuGroup.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#3b5bf5] text-white shadow-md shadow-blue-500/25 font-bold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          isActive ? 'bg-white text-[#3b5bf5]' : 'bg-rose-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GROUP 2: AKADEMIK */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2.5">
                AKADEMIK
              </p>
              <div className="space-y-1">
                {academicGroup.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#3b5bf5] text-white shadow-md shadow-blue-500/25 font-bold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Student Profile Card */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex items-center justify-between gap-3">
              <div
                onClick={() => {
                  setActiveTab('profile');
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                title="Klik untuk Ganti Foto Profil & Password"
              >
                <img
                  src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentStudent?.nis_nisn || 'student'}`}
                  alt={currentUser?.full_name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:border-[#3b5bf5] transition-colors"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#3b5bf5] transition-colors">
                    {currentUser?.full_name || 'Siswa'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {studentClass?.name || 'Siswa Aktif'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-white transition-colors border border-transparent hover:border-slate-200 shrink-0"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-2">
          {/* Left Title & Date */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {allNavItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {todayFormatted} &bull; <span className="text-[#3b5bf5] font-semibold">{studentClass?.name || 'Kelas Aktif'}</span>
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Search circular button */}
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#3b5bf5] hover:shadow transition-all"
              title="Pencarian"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#3b5bf5] hover:shadow transition-all"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
              </button>
              {activeAssignmentsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white absolute top-1 right-1"></span>
              )}
            </div>

            {/* Student Profile Capsule (Klik untuk ke Pengaturan Profil & Password) */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 bg-white hover:bg-slate-50 shadow-sm border border-slate-200/80 rounded-full transition-all cursor-pointer"
              title="Buka Profil & Ganti Password / Foto"
            >
              <img
                src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentStudent?.nis_nisn || 'student'}`}
                alt={currentUser?.full_name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.full_name || 'Siswa'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {studentClass?.name || 'Siswa Aktif'}
                </p>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 shadow-sm transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
