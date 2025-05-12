import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";

export default function AdminAnalytics() {
  const { user } = useUser();
  const router = useRouter();
  const [analytics, setAnalytics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    // Check if user is admin
    if (!user || user.username !== 'admin') {
      router.push('/login');
      return;
    }

    // Fetch analytics data from localStorage
    const fetchAnalytics = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const analyticsData = users
        .filter(user => user.username !== 'admin') // Filter out admin user
        .map(user => ({
          username: user.username,
          gender: user.gender,
          income: user.income,
          sessionTime: user.sessionTime || 0,
          lastLogin: user.lastLogin || new Date().toISOString(),
          isLoyal: user.isLoyal || false
        }));
      setAnalytics(analyticsData);
    };

    fetchAnalytics();
    // Update analytics every minute
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, [user, router]);

  const handleDownload = () => {
    const json = JSON.stringify(analytics, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = analytics
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.income.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      if (sortConfig.key === 'lastLogin') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.lastLogin) - new Date(b.lastLogin)
          : new Date(b.lastLogin) - new Date(a.lastLogin);
      }
      
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        : a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  if (!user || user.username !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Analytics</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleDownload}
          className="bg-orange-500 text-white px-4 py-2 rounded font-bold hover:bg-orange-600"
        >
          Download JSON
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 border rounded shadow">
          <thead>
            <tr className="bg-orange-100 dark:bg-orange-900">
              {[
                { key: 'username', label: 'Username' },
                { key: 'gender', label: 'Gender' },
                { key: 'income', label: 'Income' },
                { key: 'sessionTime', label: 'Session Time (s)' },
                { key: 'lastLogin', label: 'Last Login' },
                { key: 'isLoyal', label: 'Loyalty Program' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="py-2 px-4 border text-gray-900 dark:text-white cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800"
                >
                  {label}
                  {sortConfig.key === key && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((user, i) => (
              <tr key={i} className="text-center hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.username}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.gender}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.income}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.sessionTime}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">
                  {new Date(user.lastLogin).toLocaleString()}
                </td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.isLoyal 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {user.isLoyal ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No users found
          </div>
        )}
      </div>
    </div>
  );
} 