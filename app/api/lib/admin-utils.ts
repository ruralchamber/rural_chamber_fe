// utils/admin-utils.ts
export const adminUtils = {
  isAdminUser: (userRole?: string): boolean => {
    return userRole === 'admin';
  },
  
  requireAdmin: (userRole?: string, redirectCallback?: () => void): boolean => {
    const isAdmin = userRole === 'admin';
    if (!isAdmin && redirectCallback) {
      redirectCallback();
    }
    return isAdmin;
  }
};