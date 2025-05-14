import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const { register } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [income, setIncome] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const success = register({
      username,
      password,
      age,
      gender,
      income,
      numberOfPurchases: 0,
      productCategory: Math.floor(Math.random() * 5),
      sessionTime: 0,
      isLoyal: false,
      discountsAvailed: 0,
      purchaseStatus: 0,
      usedVouchers: [false, false, false, false, false],
      voucherUses: 0,
    });
    if (!success) {
      setError("Username already exists");
    } else {
      setError("");
      router.push("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-6 rounded shadow">
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
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Income (e.g. 20000)"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600"
        >
          Register
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
      <div className="mt-4 text-center text-gray-700 dark:text-gray-200">
        <span>Already have an account? </span>
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
      </div>
    </div>
  );
} 