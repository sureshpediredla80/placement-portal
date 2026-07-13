const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const srcDir = path.join(projectRoot, 'src');

const directories = [
  'assets',
  'components/common',
  'config',
  'constants',
  'hooks',
  'layouts',
  'lib/react-query',
  'providers',
  'routes',
  'services',
  'utils',
  'validations',
  'features'
];

const features = [
  'auth',
  'dashboard',
  'users',
  'students',
  'coordinators',
  'companies',
  'applications',
  'certificates',
  'topics',
  'sessions',
  'news',
  'notifications',
  'branches',
  'skills'
];

const featureSubDirs = ['api', 'components', 'hooks', 'pages', 'forms', 'validations'];

const files = {
  // Root
  '.env': 'VITE_API_BASE_URL=http://localhost:9090\n',
  // Config
  'src/config/env.js': 'export const env = {\n  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,\n};\n',
  // Constants
  'src/constants/roles.js': 'export const ROLES = {\n  ADMIN: "ROLE_ADMIN",\n  COORDINATOR: "ROLE_COORDINATOR",\n  STUDENT: "ROLE_STUDENT"\n};\n',
  'src/constants/applicationStatus.js': 'export const APPLICATION_STATUS = {};\n',
  'src/constants/certificateStatus.js': 'export const CERTIFICATE_STATUS = {};\n',
  'src/constants/notificationTypes.js': 'export const NOTIFICATION_TYPES = {};\n',
  'src/constants/routes.js': 'export const ROUTES = {};\n',
  // Providers
  'src/providers/AuthProvider.jsx': 'export const AuthProvider = ({ children }) => { return children; };\n',
  'src/providers/QueryProvider.jsx': 'export const QueryProvider = ({ children }) => { return children; };\n',
  'src/providers/ThemeProvider.jsx': 'export const ThemeProvider = ({ children }) => { return children; };\n',
  // Lib
  'src/lib/react-query/queryClient.js': 'export const queryClient = {};\n',
  'src/lib/react-query/queryKeys.js': 'export const queryKeys = {};\n',
  // Layouts
  'src/layouts/MainLayout.jsx': 'export const MainLayout = () => { return null; };\n',
  'src/layouts/AuthLayout.jsx': 'export const AuthLayout = () => { return null; };\n',
  'src/layouts/Sidebar.jsx': 'export const Sidebar = () => { return null; };\n',
  'src/layouts/Navbar.jsx': 'export const Navbar = () => { return null; };\n',
  'src/layouts/ProtectedRoute.jsx': 'export const ProtectedRoute = () => { return null; };\n',
  // Common Components
  'src/components/common/AppTable.jsx': 'export const AppTable = () => { return null; };\n',
  'src/components/common/AppPagination.jsx': 'export const AppPagination = () => { return null; };\n',
  'src/components/common/AppDialog.jsx': 'export const AppDialog = () => { return null; };\n',
  'src/components/common/AppLoader.jsx': 'export const AppLoader = () => { return null; };\n',
  'src/components/common/AppEmptyState.jsx': 'export const AppEmptyState = () => { return null; };\n',
  'src/components/common/AppSearch.jsx': 'export const AppSearch = () => { return null; };\n',
  'src/components/common/AppFormField.jsx': 'export const AppFormField = () => { return null; };\n',
  // Utils
  'src/utils/storage.js': 'export const storage = {};\n',
  'src/utils/token.js': 'export const tokenUtil = {};\n',
  'src/utils/date.js': 'export const dateUtil = {};\n',
  'src/utils/pagination.js': 'export const paginationUtil = {};\n',
  'src/utils/validation.js': 'export const validationUtil = {};\n',
  'src/utils/helpers.js': 'export const helpers = {};\n',
  // Services
  'src/services/axiosInstance.js': 'export const axiosInstance = {};\n',
  // Routes
  'src/routes/AppRoutes.jsx': 'export const AppRoutes = () => { return null; };\n',
  // Dashboard explicit components
  'src/features/dashboard/components/StatsCard.jsx': 'export const StatsCard = () => { return null; };\n',
  'src/features/dashboard/components/DashboardChart.jsx': 'export const DashboardChart = () => { return null; };\n',
  'src/features/dashboard/components/DashboardTable.jsx': 'export const DashboardTable = () => { return null; };\n',
};

// Ensure src exists
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

// Create base directories
directories.forEach(dir => {
  const dirPath = path.join(srcDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Create feature directories
features.forEach(feature => {
  const featurePath = path.join(srcDir, 'features', feature);
  if (!fs.existsSync(featurePath)) {
    fs.mkdirSync(featurePath, { recursive: true });
  }
  
  featureSubDirs.forEach(subDir => {
    const subDirPath = path.join(featurePath, subDir);
    if (!fs.existsSync(subDirPath)) {
      fs.mkdirSync(subDirPath, { recursive: true });
    }
  });

  // Create an index file for easy importing
  fs.writeFileSync(path.join(featurePath, 'index.js'), '// Export feature module elements here\n');
});

// Create boilerplate files
Object.keys(files).forEach(filePath => {
  const fullPath = path.join(projectRoot, filePath);
  const fileDir = path.dirname(fullPath);
  
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, files[filePath]);
  }
});

// Clean up old contexts folder if it exists
const contextsPath = path.join(srcDir, 'contexts');
if (fs.existsSync(contextsPath)) {
  fs.rmSync(contextsPath, { recursive: true, force: true });
}

// Clean up old services inside features if they exist
features.forEach(feature => {
    const oldServices = path.join(srcDir, 'features', feature, 'services');
    if(fs.existsSync(oldServices)) {
        fs.rmSync(oldServices, { recursive: true, force: true });
    }
});

console.log('Successfully scaffolded frontend architecture structure!');
