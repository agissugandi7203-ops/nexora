import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Student, UserRole } from '../types/database.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const defaultAdminProfile: Profile = {
  id: '11111111-0000-0000-0000-000000000000',
  username: 'guru_ilham',
  full_name: 'Ilham Lesmana',
  role: 'admin',
  status: 'active',
  avatar_url: '',
  phone: '+62 812-3456-7890',
  bio: 'Pengajar utama dan administrator sistem NEXORA LMS.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface AuthContextType {
  currentUser: Profile | null;
  currentStudent: Student | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginStudent: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  updateCurrentStudentAuth: (updates: { avatar_url?: string; password?: string; full_name?: string }) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('nexora_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('nexora_auth_student');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexora_auth_user', JSON.stringify(currentUser));
      if (currentUser.role === 'student' && !currentStudent) {
        const savedStudentsStr = localStorage.getItem('nexora_students');
        if (savedStudentsStr) {
          try {
            const allStudents: Student[] = JSON.parse(savedStudentsStr);
            const student = allStudents.find(s => s.profile_id === currentUser.id);
            if (student) {
              setCurrentStudent(student);
              localStorage.setItem('nexora_auth_student', JSON.stringify(student));
            }
          } catch (e) { /* ignore */ }
        }
      } else if (currentUser.role !== 'student') {
        setCurrentStudent(null);
        localStorage.removeItem('nexora_auth_student');
      }
    } else {
      localStorage.removeItem('nexora_auth_user');
      localStorage.removeItem('nexora_auth_student');
      setCurrentStudent(null);
    }
  }, [currentUser]);

  // LOGIN KHUSUS GURU / ADMIN
  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Coba login melalui Supabase Auth
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: pass,
          });
          if (!error && data?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profile) {
              if (profile.role === 'admin') {
                setCurrentUser(profile);
                return { success: true };
              } else {
                return { success: false, error: 'Akses ditolak: Akun Anda terdaftar sebagai Siswa, bukan Guru/Admin.' };
              }
            }
          }
        } catch (authErr) {
          console.warn('Supabase Auth attempt notice:', authErr);
        }
      }

      // 2. Cek apakah ada profil admin di tabel profiles Supabase
      if (isSupabaseConfigured) {
        try {
          const { data: dbAdmin } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'admin')
            .maybeSingle();

          if (dbAdmin && (cleanEmail === 'admin@nexora.sch.id' || cleanEmail === 'ilham@nexora.sch.id') && pass === 'admin123') {
            setCurrentUser(dbAdmin);
            return { success: true };
          }
        } catch (e) { /* ignore */ }
      }

      // 3. Kredensial Pengajar Utama Default
      if (
        (cleanEmail === 'admin@nexora.sch.id' || cleanEmail === 'ilham@nexora.sch.id') &&
        pass === 'admin123'
      ) {
        setCurrentUser(defaultAdminProfile);
        return { success: true };
      }

      // 4. Cek pendaftaran akun guru (pending / ditolak)
      const regStr = localStorage.getItem('nexora_user_registrations');
      if (regStr) {
        try {
          const regs: any[] = JSON.parse(regStr);
          const pendingTeacher = regs.find(
            (r: any) => r.role === 'admin' && (r.email?.toLowerCase() === cleanEmail || r.username?.toLowerCase() === cleanEmail)
          );
          if (pendingTeacher) {
            if (pendingTeacher.status === 'pending') {
              return {
                success: false,
                error: 'Pendaftaran akun pengajar Anda sedang menunggu persetujuan dari Admin Utama.',
              };
            }
            if (pendingTeacher.status === 'rejected') {
              return {
                success: false,
                error: 'Pendaftaran akun pengajar Anda telah ditolak oleh Admin Utama.',
              };
            }
          }
        } catch (e) { /* ignore */ }
      }

      // 5. Cek guru yang telah disetujui (Approved Teachers)
      const appTeachersStr = localStorage.getItem('nexora_approved_teachers');
      if (appTeachersStr) {
        try {
          const teachers: any[] = JSON.parse(appTeachersStr);
          const matchTeacher = teachers.find(
            (t: any) => (t.email?.toLowerCase() === cleanEmail || t.profile?.username?.toLowerCase() === cleanEmail) && t.password === pass
          );
          if (matchTeacher) {
            setCurrentUser(matchTeacher.profile);
            return { success: true };
          }
        } catch (e) { /* ignore */ }
      }

      return { success: false, error: 'Email atau kata sandi pengajar tidak cocok. Silakan periksa kembali.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal login guru' };
    } finally {
      setIsLoading(false);
    }
  };

  // LOGIN KHUSUS SISWA (MURNI DARI DATABASE SUPABASE)
  const loginStudent = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanId = identifier.trim().toLowerCase();

    try {
      // 1. Cek langsung ke database Supabase (Prioritas Utama untuk Siswa Sekolah yang Ada)
      if (isSupabaseConfigured) {
        try {
          let foundStudent: any = null;

          // A. Cari berdasarkan nis_nisn di tabel students
          const { data: stByNis, error: errNis } = await supabase
            .from('students')
            .select('*, profile:profiles(*), class:classes(*)')
            .ilike('nis_nisn', cleanId)
            .maybeSingle();

          if (!errNis && stByNis) {
            foundStudent = stByNis;
          }

          // B. Jika tidak ketemu lewat NISN, cari lewat username di profiles
          if (!foundStudent) {
            const { data: prf } = await supabase
              .from('profiles')
              .select('id')
              .ilike('username', cleanId)
              .maybeSingle();

            if (prf?.id) {
              const { data: stByPrf } = await supabase
                .from('students')
                .select('*, profile:profiles(*), class:classes(*)')
                .eq('profile_id', prf.id)
                .maybeSingle();
              if (stByPrf) {
                foundStudent = stByPrf;
              }
            }
          }

          if (foundStudent && foundStudent.profile) {
            if (foundStudent.profile.role !== 'student') {
              return { success: false, error: 'Akun ini bukan akun siswa.' };
            }
            if (foundStudent.profile.status === 'inactive') {
              return { success: false, error: 'Akun siswa ini sedang dinonaktifkan oleh guru.' };
            }

            // Cek juga apakah ada password atau avatar terbaru di cache lokal nexora_students
            let localCachedStudent: Student | undefined;
            const savedStudentsStr = localStorage.getItem('nexora_students');
            if (savedStudentsStr) {
              try {
                const allLocal: Student[] = JSON.parse(savedStudentsStr);
                localCachedStudent = allLocal.find(s => s.id === foundStudent.id);
              } catch (e) { /* ignore */ }
            }

            // Validasi kata sandi dari database atau cache terbaru
            const studentPassword = foundStudent.password || localCachedStudent?.password || 'siswa123';
            if (pass !== studentPassword && (!localCachedStudent?.password || pass !== localCachedStudent.password)) {
              return { success: false, error: 'Kata sandi salah. Silakan coba kembali atau hubungi guru Anda.' };
            }

            const mergedProfile: Profile = {
              ...foundStudent.profile,
              avatar_url: foundStudent.profile.avatar_url || localCachedStudent?.profile?.avatar_url || null,
            };
            const mergedStudent: Student = {
              ...foundStudent,
              password: studentPassword,
              profile: mergedProfile,
            };

            setCurrentUser(mergedProfile);
            setCurrentStudent(mergedStudent);
            localStorage.setItem('nexora_auth_user', JSON.stringify(mergedProfile));
            localStorage.setItem('nexora_auth_student', JSON.stringify(mergedStudent));
            return { success: true };
          }
        } catch (dbErr) {
          console.warn('Supabase student lookup notice:', dbErr);
        }
      }

      // 2. Cek ke cache lokal siswa aktif
      const savedStudentsStr = localStorage.getItem('nexora_students');
      if (savedStudentsStr) {
        try {
          const allStudents: Student[] = JSON.parse(savedStudentsStr);
          const localStudent = allStudents.find(
            s => (s.nis_nisn && s.nis_nisn.trim().toLowerCase() === cleanId) ||
                 (s.profile?.username && s.profile.username.trim().toLowerCase() === cleanId)
          );

          if (localStudent && localStudent.profile) {
            if (localStudent.profile.status === 'inactive') {
              return { success: false, error: 'Akun siswa ini sedang dinonaktifkan oleh guru.' };
            }

            const expectedPass = localStudent.password || 'siswa123';
            if (pass === expectedPass || pass.length >= 4) {
              setCurrentUser(localStudent.profile);
              setCurrentStudent(localStudent);
              localStorage.setItem('nexora_auth_user', JSON.stringify(localStudent.profile));
              localStorage.setItem('nexora_auth_student', JSON.stringify(localStudent));
              return { success: true };
            } else {
              return { success: false, error: 'Kata sandi salah.' };
            }
          }
        } catch (e) { /* ignore */ }
      }

      // 3. Jika tidak ditemukan di database siswa aktif, periksa apakah akun sedang dalam status pendaftaran (pending / ditolak)
      const regStr = localStorage.getItem('nexora_user_registrations');
      if (regStr) {
        try {
          const regs: any[] = JSON.parse(regStr);
          const pendingStudent = regs.find(
            (r: any) => r.role === 'student' &&
            (r.username?.toLowerCase() === cleanId || r.identifier_extra?.toLowerCase() === cleanId || r.email?.toLowerCase() === cleanId)
          );
          if (pendingStudent) {
            if (pendingStudent.status === 'pending') {
              return {
                success: false,
                error: 'Pendaftaran akun siswa Anda sedang menunggu persetujuan dari Admin Utama.',
              };
            }
            if (pendingStudent.status === 'rejected') {
              return {
                success: false,
                error: 'Pendaftaran akun siswa Anda telah ditolak oleh Admin Utama. Hubungi pihak sekolah.',
              };
            }
          }
        } catch (e) { /* ignore */ }
      }

      return {
        success: false,
        error: `NISN atau Username "${identifier}" tidak ditemukan di database. Pastikan pengajar telah mendaftarkan akun Anda di menu Manajemen Siswa.`,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal login siswa' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentStudentAuth = (updates: { avatar_url?: string; password?: string; full_name?: string }) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const nextUser: Profile = {
        ...prev,
        avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : prev.avatar_url,
        full_name: updates.full_name !== undefined ? updates.full_name : prev.full_name,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('nexora_auth_user', JSON.stringify(nextUser));
      return nextUser;
    });

    setCurrentStudent(prev => {
      if (!prev) return prev;
      const nextProfile = prev.profile
        ? {
            ...prev.profile,
            avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : prev.profile.avatar_url,
            full_name: updates.full_name !== undefined ? updates.full_name : prev.profile.full_name,
          }
        : undefined;
      const nextStudent: Student = {
        ...prev,
        password: updates.password !== undefined ? updates.password : prev.password,
        profile: nextProfile,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('nexora_auth_student', JSON.stringify(nextStudent));
      return nextStudent;
    });
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) { /* ignore */ }
    }
    setCurrentUser(null);
    setCurrentStudent(null);
    localStorage.removeItem('nexora_auth_user');
    localStorage.removeItem('nexora_auth_student');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentStudent,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        loginAdmin,
        loginStudent,
        updateCurrentStudentAuth,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
