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
          age: user.age || '',
          gender: user.gender || '',
          annualIncome: user.income || '',
          numberOfPurchases: user.numberOfPurchases || 0,
          productCategory: user.productCategory,
          timeSpentOnWebsite: user.sessionTime || 0,
          loyaltyProgram: user.isLoyal ? 1 : 0,
          discountsAvailed: user.discountsAvailed || 0,
          purchaseStatus: user.purchaseStatus || 0,
        }))
        .filter(user => [0,1,2,3,4].includes(user.productCategory));
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
      user.age.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.annualIncome.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      if (sortConfig.key === 'age') {
        return sortConfig.direction === 'asc' 
          ? a.age.localeCompare(b.age)
          : b.age.localeCompare(a.age);
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
                { key: 'age', label: 'Age' },
                { key: 'gender', label: 'Gender' },
                { key: 'annualIncome', label: 'AnnualIncome' },
                { key: 'numberOfPurchases', label: 'NumberOfPurchases' },
                { key: 'productCategory', label: 'ProductCategory' },
                { key: 'timeSpentOnWebsite', label: 'TimeSpentOnWebsite' },
                { key: 'loyaltyProgram', label: 'LoyaltyProgram' },
                { key: 'discountsAvailed', label: 'DiscountsAvailed' },
                { key: 'purchaseStatus', label: 'PurchaseStatus' },
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
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.age}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.gender}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.annualIncome}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.numberOfPurchases}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.productCategory}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{(user.timeSpentOnWebsite / 60).toFixed(2)}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.loyaltyProgram}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.discountsAvailed}</td>
                <td className="py-2 px-4 border text-gray-900 dark:text-white">{user.purchaseStatus}</td>
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