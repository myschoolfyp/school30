"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userType: category }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "Error logging in");
        return;
      }

      const { email: userEmail, userType, firstName, lastName, contactNumber } = await response.json();
      alert("Login successful!");

      // Store user details in local storage
      localStorage.setItem("email", userEmail);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("contactNumber", contactNumber);

      // Navigate to Profile page with userType as query parameter
      router.push(`/Profile?userType=${userType}`);
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="screenMiddleDiv">
      <div className="formDiv">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center text-[#0F6466]">Welcome</h2>
          {error && <p className="text-red-500">{error}</p>}

          <div className="mb-4">
            <label htmlFor="role" className="formLabel">Select Your Role</label>
            <select
              id="role"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#0F6466] text-white border border-[#0F6466] focus:outline-none"
              required
            >
              <option value="" disabled>Select Your Role</option>
              {["Admin", "Teacher"].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="formLabel">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white text-black border border-[#0F6466] focus:outline-none"
            />
          </div>

          <div className="my-6">
            <label htmlFor="password" className="formLabel">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white text-black border border-[#0F6466] focus:outline-none"
            />
          </div>

          <button type="submit" className="formButton bg-[#0F6466] text-white hover:bg-[#2C3532]">
            Login
          </button>

          <div className="text-center mt-4">
            <a href="#" className="text-sm hover:underline">Forgot your password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}