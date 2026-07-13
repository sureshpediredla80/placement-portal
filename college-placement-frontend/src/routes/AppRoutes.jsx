import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ROLES } from "../constants/roles";
import AppLoader from "../components/common/AppLoader";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../layouts/ProtectedRoute";
import StudentApplicationsPage from "../features/applications/pages/StudentApplicationsPage.jsx";


// ─── Lazy Imports ─────────────────────────────────────────────────────────

// Auth
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage"));
// Admin
const AdminDashboard = lazy(() => import("../features/dashboard/pages/AdminDashboard"));
const CoordinatorDashboard = lazy(() => import("../features/dashboard/pages/CoordinatorDashboard"));
const StudentDashboard = lazy(() => import("../features/dashboard/pages/StudentDashboard"));
const StudentProfilePage = lazy(() => import("../features/students/pages/StudentProfilePage"));
const StudentCompaniesPage = lazy(() => import("../features/companies/pages/StudentCompaniesPage"));
const StudentCompanyDetailsPage = lazy(() => import("../features/companies/pages/StudentCompanyDetailsPage"));
const StudentCertificatesPage = lazy(() => import("../features/certificates/pages/StudentCertificatesPage"));
const StudentSessionsPage = lazy(() => import("../features/sessions/pages/StudentSessionsPage"));


const CoordinatorProfilePage = lazy(() => import("../features/coordinators/pages/CoordinatorProfilePage"));
const CoordinatorStudentsPage = lazy(() => import("../features/coordinators/pages/CoordinatorStudentsPage"));
const CoordinatorCompaniesPage = lazy(() => import("../features/coordinators/pages/CoordinatorCompaniesPage"));
const CoordinatorCompanyDetailsPage = lazy(() => import("../features/coordinators/pages/CoordinatoreCompanyDetails.jsx"));
const CoordinatorApplicationsPage = lazy(() => import("../features/coordinators/pages/CoordinatorApplicationsPage"));
const CoordinatorCompanyApplicationsPage  = lazy(() => import("../features/coordinators/pages/CoordinatorCompanyApplicationsPage"));
const CoordinatorCertificatesPage  = lazy(() => import("../features/coordinators/pages/CoordinatorCertificatesPage"));
const CoordinatorSessionsPage = lazy(() => import("../features/coordinators/pages/CoordinatorSessionsPage"));
const CoordinatorTopicsPage = lazy(() => import("../features/topics/pages/CoordinatorTopicsPage"));
const StudentTopicsPage = lazy(() => import("../features/topics/pages/StudentTopicsPage"));
const CoordinatorNewsPage = lazy(() => import("../features/news/pages/CoordinatorNewsPage"));
const StudentNewsPages = lazy(() => import("../features/news/pages/StudentNewsPages.jsx"));
const ResumeBuilderPage = lazy(() => import("../features/resume/page/ResumeBuilderPage"));
//admin
const AdminCompaniesPage = lazy(() => import("../features/admin/pages/AdminCompaniesPage"));
const AdminCompanyDetailsPage = lazy(() => import("../features/admin/pages/AdminCompanyDetailsPage"));
const AdminCompanyApplicationsPage  = lazy(() => import("../features/admin/pages/AdminCompanyApplicationsPage"));
const AdminApplicationsPage = lazy(() => import("../features/admin/pages/AdminApplicationsPage"));
const AdminCertificatesPage  = lazy(() => import("../features/admin/pages/AdminCertificatesPage"));
const AdminSessionsPage = lazy(() => import("../features/admin/pages/AdminSessionsPage"));
const AdminTopicsPage = lazy(() => import("../features/admin/pages/AdminTopicsPage"));
const AdminNewsPage = lazy(() => import("../features/admin/pages/AdminNewsPage"));
const AdminStudentsPage = lazy(() => import("../features/admin/pages/AdminStudentsPage"));
const AdminCoordinatorsPage = lazy(() => import("../features/admin/pages/AdminCoordinatorsPage"));
const AdminUsersPage = lazy(() => import("../features/admin/pages/AdminUsersPage"));
const AdminBranchesPage = lazy(() => import("../features/admin/pages/AdminBranchesPage"));
const AdminRateLimitAuditPage = lazy(() =>
    import("../features/admin/pages/AdminRateLimitAuditPage")
);



const ComingSoon = ({ title }) => (
  <div style={{ padding: 32, textAlign: "center" }}>
    <h2>{title} — Coming Soon</h2>
  </div>
);

// ─── Routes ───────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Suspense fallback={<AppLoader />}>
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />}/>
      </Route>

      {/* ── Admin Routes ── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage/>} />
          <Route path={ROUTES.ADMIN_STUDENTS} element={<AdminStudentsPage />} />
          <Route path={ROUTES.ADMIN_COORDINATORS} element={<AdminCoordinatorsPage/>} />
          <Route path={ROUTES.ADMIN_COMPANIES} element={<AdminCompaniesPage/>} />
          <Route path={ROUTES. ADMIN_COMPANY_DETAILS} element={<AdminCompanyDetailsPage />}/>
          <Route path={ROUTES.ADMIN_COMPANY_APPLICATIONS} element={<AdminCompanyApplicationsPage />}/>
          <Route path={ROUTES.ADMIN_APPLICATIONS} element={<AdminApplicationsPage/>} />
          <Route path={ROUTES.ADMIN_CERTIFICATES} element={<AdminCertificatesPage/>} />
          <Route path={ROUTES.ADMIN_TOPICS} element={<AdminTopicsPage/>} />
          <Route path={ROUTES.ADMIN_SESSIONS} element={<AdminSessionsPage/>} />
          <Route path={ROUTES.ADMIN_NEWS} element={<AdminNewsPage />} />
          <Route path={ROUTES.ADMIN_BRANCHES} element={<AdminBranchesPage />} />
          <Route path={ROUTES.ADMIN_SKILLS} element={<ComingSoon title="Skills" />} />
          <Route path={ROUTES.ADMIN_NOTIFICATIONS} element={<ComingSoon title="Notifications" />} />
          <Route
              path={ROUTES.ADMIN_RATE_LIMIT_AUDIT}
              element={<AdminRateLimitAuditPage />}
          />
        </Route>
      </Route>

      {/* ── Coordinator Routes ── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.COORDINATOR]} />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.COORDINATOR_DASHBOARD} element={<CoordinatorDashboard />} />
          <Route path={ROUTES.COORDINATOR_COMPANIES} element={<CoordinatorCompaniesPage />} />
          <Route path={ROUTES.COORDINATOR_CERTIFICATES} element={<CoordinatorCertificatesPage/>} />
          <Route path={ROUTES.COORDINATOR_SESSIONS} element={<CoordinatorSessionsPage />} />
          <Route path={ROUTES.COORDINATOR_NEWS} element={< CoordinatorNewsPage/>} />
          <Route path={ROUTES.COORDINATOR_NOTIFICATIONS} element={<ComingSoon title="Notifications" />} />
          <Route path={ROUTES.COORDINATOR_PROFILE} element={<CoordinatorProfilePage />}/>
          <Route path={ROUTES.COORDINATOR_STUDENTS} element={<CoordinatorStudentsPage />}/>
          <Route path={ROUTES. COORDINATOR_COMPANY_DETAILS} element={<CoordinatorCompanyDetailsPage />}/>
          <Route path={ROUTES.COORDINATOR_APPLICATIONS} element={<CoordinatorApplicationsPage />}/>
          <Route path={ROUTES.COORDINATOR_COMPANY_APPLICATIONS} element={<CoordinatorCompanyApplicationsPage />}/>
          <Route path={ROUTES.COORDINATOR_TOPICS} element={<CoordinatorTopicsPage />} />
        </Route>
      </Route>

      {/* ── Student Routes ── */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboard />} />
          <Route path={ROUTES.STUDENT_PROFILE} element={<StudentProfilePage />}/>
          <Route path={ROUTES.STUDENT_COMPANIES} element={<StudentCompaniesPage />}/>
          <Route path={ROUTES.STUDENT_APPLICATIONS} element={<StudentApplicationsPage />}/>
          <Route path={ROUTES.STUDENT_CERTIFICATES} element={<StudentCertificatesPage />}/>
          <Route path={ROUTES.STUDENT_SESSIONS} element={< StudentSessionsPage/>} />
          <Route path={ROUTES.STUDENT_NEWS} element={<StudentNewsPages />} />
          <Route path={ROUTES.STUDENT_NOTIFICATIONS} element={<ComingSoon title="Notifications" />} />
          <Route path={ROUTES.STUDENT_COMPANY_DETAILS} element={<StudentCompanyDetailsPage />}/>
          <Route path={ROUTES.STUDENT_TOPICS} element={<StudentTopicsPage />} />
          <Route path={ROUTES.STUDENT_RESUME} element={<ResumeBuilderPage/>} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
