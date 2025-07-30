import { Card } from "@/components/shadcn/card";
import { IUser } from "@/interfaces/auth/IAuthContext";
import { fetchAllUsers } from "@/service/authService";
import { useEffect, useState } from "react";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <Card className="w-[90%] mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Full Name</th>
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Login Timestamps</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.user_name}>
              <td className="border px-2 py-1 text-center">{idx + 1}</td>
              <td className="border px-2 py-1">{user.full_name}</td>
              <td className="border px-2 py-1">{user.user_name}</td>
              <td className="border px-2 py-1">{user.email}</td>
              <td className="border px-2 py-1">{user.role}</td>
              <td className="border px-2 py-1">
                <ul className="max-h-32 overflow-y-auto">
                  {user.loginTimestamps && user.loginTimestamps.length > 0 ? (
                    user.loginTimestamps.map((ts, i) => (
                      <li key={i} className="text-xs text-gray-600">
                        {new Date(ts).toLocaleString()}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-400">No logins</li>
                  )}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default AdminUsersPage;
