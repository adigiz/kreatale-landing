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


  // Media permissions
  MEDIA_CREATE: "media:create",
  MEDIA_READ: "media:read",
  MEDIA_UPDATE: "media:update",
  MEDIA_DELETE: "media:delete",

  // Contacts / Inquiry permissions
  CONTACTS_READ: "contacts:read",
  CONTACTS_UPDATE: "contacts:update",
  CONTACTS_DELETE: "contacts:delete",

  // Sales pipeline (deals). Seeing and editing money values is its own permission.
  DEALS_READ: "deals:read",
  DEALS_UPDATE: "deals:update",
  DEALS_DELETE: "deals:delete",
  DEALS_VALUE: "deals:value",

  // Reply templates used from the pipeline
  TEMPLATES_MANAGE: "templates:manage",

  // Website audits (run for prospects, view results)
  AUDITS_READ: "audits:read",
  AUDITS_CREATE: "audits:create",

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
  deals: {
    label: "Pipeline",
    permissions: [
      { key: PERMISSIONS.DEALS_READ, label: "Read" },
      { key: PERMISSIONS.DEALS_UPDATE, label: "Update" },
      { key: PERMISSIONS.DEALS_DELETE, label: "Delete" },
      { key: PERMISSIONS.DEALS_VALUE, label: "See values" },
    ],
  },
  templates: {
    label: "Templates",
    permissions: [{ key: PERMISSIONS.TEMPLATES_MANAGE, label: "Manage" }],
  },
  audits: {
    label: "Audits",
    permissions: [
      { key: PERMISSIONS.AUDITS_READ, label: "Read" },
      { key: PERMISSIONS.AUDITS_CREATE, label: "Create" },
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
    PERMISSIONS.MEDIA_CREATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPDATE,
    PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.CONTACTS_READ,
    PERMISSIONS.CONTACTS_UPDATE,
    PERMISSIONS.CONTACTS_DELETE,
    PERMISSIONS.DEALS_READ,
    PERMISSIONS.DEALS_UPDATE,
    PERMISSIONS.DEALS_DELETE,
    PERMISSIONS.DEALS_VALUE,
    PERMISSIONS.TEMPLATES_MANAGE,
    PERMISSIONS.AUDITS_READ,
    PERMISSIONS.AUDITS_CREATE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  editor: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.POSTS_PUBLISH,
    PERMISSIONS.MEDIA_CREATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPDATE,
    PERMISSIONS.CONTACTS_READ,
    PERMISSIONS.DEALS_READ,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  author: [
    PERMISSIONS.POSTS_CREATE,
    PERMISSIONS.POSTS_READ,
    PERMISSIONS.POSTS_UPDATE,
    PERMISSIONS.POSTS_DELETE,
    PERMISSIONS.MEDIA_CREATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.ADMIN_ACCESS,
  ],
  sales: [
    PERMISSIONS.CONTACTS_READ,
    PERMISSIONS.CONTACTS_UPDATE,
    PERMISSIONS.DEALS_READ,
    PERMISSIONS.DEALS_UPDATE,
    PERMISSIONS.TEMPLATES_MANAGE,
    PERMISSIONS.AUDITS_READ,
    PERMISSIONS.AUDITS_CREATE,
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.MEDIA_CREATE, // media uploads (ImagePicker)
  ],
  viewer: [
    PERMISSIONS.POSTS_READ,
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
