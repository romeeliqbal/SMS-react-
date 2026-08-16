import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ROLES, getRoleDefinition } from '../data/roleConfigs';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS, writeStorage } from '../utils/storage';

const AuthContext = createContext(null);

const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGEMENT];

export function AuthProvider({ children }) {
  const [activeRole, setActiveRoleState] = useStoredState(STORAGE_KEYS.activeRole, ROLES.ADMIN);
  const [authProfile, setAuthProfileState] = useStoredState(STORAGE_KEYS.authProfile, getRoleDefinition(ROLES.ADMIN).defaultUser);

  const switchRole = useCallback((roleId) => {
    const definition = getRoleDefinition(roleId);
    setActiveRoleState(roleId);
    setAuthProfileState(definition.defaultUser);
    writeStorage(STORAGE_KEYS.activeRole, roleId);
    writeStorage(STORAGE_KEYS.authProfile, definition.defaultUser);
  }, [setActiveRoleState, setAuthProfileState]);

  const roleDefinition = useMemo(() => getRoleDefinition(activeRole), [activeRole]);

  const canAccess = useCallback(
    (allowedRoles) => {
      if (!allowedRoles || allowedRoles.includes('*')) return true;
      if (ADMIN_ROLES.includes(activeRole)) return true;
      return allowedRoles.includes(activeRole);
    },
    [activeRole],
  );

  const value = useMemo(
    () => ({
      activeRole,
      authProfile,
      roleDefinition,
      switchRole,
      canAccess,
      isAdmin: ADMIN_ROLES.includes(activeRole),
      isTeacher: activeRole === ROLES.TEACHER,
      isStudent: activeRole === ROLES.STUDENT,
      isParent: activeRole === ROLES.PARENT,
      isAccountant: activeRole === ROLES.ACCOUNTANT,
    }),
    [activeRole, authProfile, roleDefinition, switchRole, canAccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
