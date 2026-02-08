// Permission system for RBAC
// Format: "resource:action"
//
// This file contains ONLY pure constants and synchronous functions.
// It is safe to import from both client and server components.
// For DB-aware permission resolution, use permissions.server.ts instead.

export const PERMISSIONS = {
  // Posts permissions
  POSTS_CREATE: "posts:create",
  POSTS_READ: "posts:read",
  POSTS_UPDATE: "posts:update",
  POSTS_DELETE: "posts:delete",
  POSTS_PUBLISH: "posts:publish",

  // Projects permissions
  PROJECTS_CREATE: "projects:create",
  PROJECTS_READ: "projects:read",
  PROJECTS_UPDATE: "projects:update",
  PROJECTS_DELETE: "projects:delete",
  PROJECTS_PUBLISH: "projects:publish",

  // Media permissions
  MEDIA_CREATE: "media:create",
  MEDIA_READ: "media:read",
  MEDIA_UPDATE: "media:update",
  MEDIA_DELETE: "media:delete",

  // Contacts / Inquiry permissions
  CONTACTS_READ: "contacts:read",
  CONTACTS_UPDATE: "contacts:update",
  CONTACTS_DELETE: "contacts:delete",

  // Leads permissions
  LEADS_CREATE: "leads:create",
  LEADS_READ: "leads:read",
  LEADS_UPDATE: "leads:update",
  LEADS_DELETE: "leads:delete",

  // User management permissions
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",

  // Admin permissions
  ADMIN_ACCESS: "admin:access",
} as const;

/** All valid permission strings */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/** Permission grouped by resource for UI display */
export const PERMISSION_GROUPS: Record<string, { label: string; permissions: { key: string; label: string }[] }> = {
  posts: {
    label: "Posts",
    permissions: [
      { key: PERMISSIONS.POSTS_CREATE, label: "Create" },
      { key: PERMISSIONS.POSTS_READ, label: "Read" },
      { key: PERMISSIONS.POSTS_UPDATE, label: "Update" },
      { key: PERMISSIONS.POSTS_DELETE, label: "Delete" },
      { key: PERMISSIONS.POSTS_PUBLISH, label: "Publish" },
    ],
  },
  projects: {
    label: "Projects",
    permissions: [
      { key: PERMISSIONS.PROJECTS_CREATE, label: "Create" },
      { key: PERMISSIONS.PROJECTS_READ, label: "Read" },
      { key: PERMISSIONS.PROJECTS_UPDATE, label: "Update" },
      { key: PERMISSIONS.PROJECTS_DELETE, label: "Delete" },
      { key: PERMISSIONS.PROJECTS_PUBLISH, label: "Publish" },
    ],
  },
  media: {
    label: "Media",
    permissions: [
      { key: PERMISSIONS.MEDIA_CREATE, label: "Create" },
      { key: PERMISSIONS.MEDIA_READ, label: "Read" },
      { key: PERMISSIONS.MEDIA_UPDATE, label: "Update" },
      { key: PERMISSIONS.MEDIA_DELETE, label: "Delete" },
    ],
  },
  contacts: {
    label: "Inquiry",
    permissions: [
      { key: PERMISSIONS.CONTACTS_READ, label: "Read" },
      { key: PERMISSIONS.CONTACTS_UPDATE, label: "Update" },
      { key: PERMISSIONS.CONTACTS_DELETE, label: "Delete" },
    ],
  },
  leads: {
    label: "Leads",
    permissions: [
      { key: PERMISSIONS.LEADS_CREATE, label: "Create" },
      { key: PERMISSIONS.LEADS_READ, label: "Read" },
      { key: PERMISSIONS.LEADS_UPDATE, label: "Update" },
      { key: PERMISSIONS.LEADS_DELETE, label: "Delete" },
    ],
  },
  users: {
    label: "Users",
    permissions: [
      { key: PERMISSIONS.USERS_CREATE, label: "Create" },
      { key: PERMISSIONS.USERS_READ, label: "Read" },
      { key: PERMISSIONS.USERS_UPDATE, label: "Update" },
      { key: PERMISSIONS.USERS_DELETE, label: "Delete" },
    ],
  },
  admin: {
    label: "Admin",
    permissions: [
      { key: PERMISSIONS.ADMIN_ACCESS, label: "Access Admin Panel" },
    ],
  },
};

// Hardcoded role definitions (fallback if DB is empty)
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  // super_admin always has ALL permissions -- uses ALL_PERMISSIONS directly
  // so new permissions are automatically included
  super_admin: [...ALL_PERMISSIONS],
  admin: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.POSTS_PUBLISH,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_UPDATE,
    PERMISSIONS.PROJECTS_DELETE,
    PERMISSIONS.PROJECTS_PUBLISH,
    PERMISSIONS.MEDIA_CREATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPDATE,
    PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.CONTACTS_READ,
    PERMISSIONS.CONTACTS_UPDATE,
    PERMISSIONS.CONTACTS_DELETE,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_READ,
    PERMISSIONS.LEADS_UPDATE,
    PERMISSIONS.LEADS_DELETE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  editor: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.POSTS_PUBLISH,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_UPDATE,
    PERMISSIONS.PROJECTS_DELETE,
    PERMISSIONS.PROJECTS_PUBLISH,
    PERMISSIONS.MEDIA_CREATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPDATE,
    PERMISSIONS.CONTACTS_READ,
    PERMISSIONS.LEADS_READ,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  author: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_UPDATE,
    PERMISSIONS.PROJECTS_DELETE,
    PERMISSIONS.MEDIA_CREATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  sales: [
    PERMISSIONS.CONTACTS_READ,
    PERMISSIONS.CONTACTS_UPDATE,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_READ,
    PERMISSIONS.LEADS_UPDATE,
    PERMISSIONS.LEADS_DELETE,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  viewer: [
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.MEDIA_READ,
  ],
};

export type UserRole = keyof typeof ROLE_PERMISSIONS;

/**
 * Check if a user has a specific permission (synchronous, uses hardcoded fallback)
 */
export function hasPermission(
  userRole: UserRole,
  permission: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if a permissions array includes a specific permission
 */
export function permissionIncludes(
  permissions: string[],
  permission: string
): boolean {
  return permissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  userRole: UserRole,
  permissions: string[]
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  userRole: UserRole,
  permissions: string[]
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdmin(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.ADMIN_ACCESS);
}
