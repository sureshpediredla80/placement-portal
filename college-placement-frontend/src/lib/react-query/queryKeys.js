export const QUERY_KEYS = {
  // Auth
  AUTH_ME: ["auth", "me"],

  // Users
  USERS: ["users"],
  USER: (id) => ["users", id],

  // Students
  STUDENTS: ["students"],
  STUDENT: (id) => ["students", id],

  // Coordinators
  COORDINATORS: ["coordinators"],
  COORDINATOR: (id) => ["coordinators", id],

  // Companies
  COMPANIES: ["companies"],
  COMPANY: (id) => ["companies", id],

  // Applications
  APPLICATIONS: ["applications"],
  APPLICATION: (id) => ["applications", id],

  // Certificates
  CERTIFICATES: ["certificates"],
  CERTIFICATE: (id) => ["certificates", id],

  // Topics
  TOPICS: ["topics"],
  TOPIC: (id) => ["topics", id],

  // Sessions
  SESSIONS: ["sessions"],
  SESSION: (id) => ["sessions", id],

  // News
  NEWS: ["news"],
  NEWS_ITEM: (id) => ["news", id],

  // Notifications
  NOTIFICATIONS: ["notifications"],
  NOTIFICATION: (id) => ["notifications", id],

  // Branches
  BRANCHES: ["branches"],
  BRANCH: (id) => ["branches", id],

  // Skills
  SKILLS: ["skills"],
  SKILL: (id) => ["skills", id],

  // Dashboard
  DASHBOARD_STATS: ["dashboard", "stats"],
};
