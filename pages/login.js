import { useState } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

export default function Login() {
  const { user, login, logout, sessionTime } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, undefined, undefined); // Only username is used for now
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Welcome, {user.username}!</h1>
        <button onClick={logout} className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600">Logout</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded shadow">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center text-gray-700 dark:text-gray-200">
        <span>Don't have an account? </span>
        <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register</Link>
      </div>
    </div>
  );
} 