"use client";

import React from "react";
import {
  useAdminLogin,
  useCreateAdmin,
  useCreateAdminManager,
  useSession,
  useSyncSession,
} from "@/hooks/api/use-auth-admin";
import { useAuthStore } from "@/store/authStore";

/**
 * Example Component demonstrating usage of Auth Hooks and Store
 */
export const AuthExample = () => {
  // 1. Sync Session (Recommended to use in Layout or Top-level Provider)
  // This hook automatically updates the auth store when session data is fetched
  useSyncSession();

  // 2. Access Store State
  const { user, token, logout } = useAuthStore();

  // 3. Login Mutation
  const loginMutation = useAdminLogin();

  // 4. Create Admin Mutation (Public if no admins exist)
  const createAdminMutation = useCreateAdmin();

  // 5. Create Subordinate (Requires specific roles)
  const createManagerMutation = useCreateAdminManager();

  const handleLogin = () => {
    loginMutation.mutate(
      {
        email: "root@example.com",
        password: "password",
      },
      {
        onSuccess: (data) => {
          console.log("Logged in successfully!", data);
        },
        onError: (err) => {
          console.error("Login failed", err);
        },
      }
    );
  };

  const handleCreateRootAdmin = () => {
    createAdminMutation.mutate({
      email: "root@example.com",
      name: "Root Admin",
      password: "password",
    });
  };

  const handleCreateManager = () => {
    createManagerMutation.mutate({
      email: "manager@example.com",
      name: "Manager Name",
      password: "password",
    });
  };

  if (loginMutation.isPending) return <div>Logging in...</div>;

  return (
    <div>
      <h1>Auth Example</h1>

      {/* Display User Info if logged in */}
      {user ? (
        <div>
          <p>
            Welcome, {user.name} ({user.role})
          </p>
          <p>Email: {user.email}</p>
          <button onClick={() => logout()}>Logout</button>

          <hr />

          {/* Example of Role-based action */}
          {user.role === "ADMIN" && (
            <button onClick={handleCreateManager}>Create Manager</button>
          )}
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login as Admin</button>
          <button onClick={handleCreateRootAdmin}>
            Create Root Admin (Setup)
          </button>
        </div>
      )}

      {/* Show Errors */}
      {loginMutation.isError && (
        <p style={{ color: "red" }}>Error: {loginMutation.error.message}</p>
      )}
    </div>
  );
};
