"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Profile() {
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [teachersData, setTeachersData] = useState<any[]>([]);
  const [adminsData, setAdminsData] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [activeData, setActiveData] = useState<"students" | "teachers" | "admins">("students");

  useEffect(() => {
    const userTypeParam = searchParams.get("userType");
    const email = localStorage.getItem("email");

    if (userTypeParam && email) {
      setUserType(userTypeParam);

      // Fetch user details
      fetch("/api/profile", {
        headers: {
          email,
          userType: userTypeParam,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setError(data.message);
          } else {
            setUserData(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
          setError("Failed to fetch user details");
        });

      // Fetch students data
      fetchStudentsData();
    } else {
      setError("Missing user information");
    }
  }, [searchParams]);

  const fetchStudentsData = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch students data");
      setStudentsData(data);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "An unknown error occurred");
    }
  };

  const fetchTeachersData = async () => {
    console.log("Fetching teachers data...");
    try {
      const response = await fetch("/api/teachers");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch teachers data");
      setTeachersData(data);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "An unknown error occurred");
    }
  };

  const fetchAdminsData = async () => {
    console.log("Fetching admins data...");
    try {
      const response = await fetch("/api/admin");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch admins data");
      setAdminsData(data);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "An unknown error occurred");
    }
  };

  const handleShowStudents = () => {
    setActiveData("students");
    fetchStudentsData();
  };

  const handleShowTeachers = () => {
    setActiveData("teachers");
    fetchTeachersData();
  };

  const handleShowAdmins = () => {
    setActiveData("admins");
    fetchAdminsData();
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profileContainer p-6 bg-gray-50">
      <header className="text-left p-4 text-4xl font-bold uppercase text-[#0F6466]">
        Welcome, {userData.firstName} {userData.lastName}
      </header>
      <main className="text-center mt-4 border p-4 rounded shadow-lg bg-white">
        <h2 className="text-2xl font-semibold">User Details</h2>
        <div className="mt-2">
          <p className="text-lg text-gray-700"><strong>Email:</strong> {userData.email}</p>
          <p className="text-lg text-gray-700"><strong>Contact Number:</strong> {userData.contactNumber}</p>
        </div>
      </main>

      {/* User Type Buttons */}
      {userType === "Admin" && (
        <div className="flex justify-center mt-6 space-x-4">
          <button className="btn" onClick={handleShowStudents}>Students</button>
          <button className="btn" onClick={handleShowTeachers}>Teachers</button>
          <button className="btn" onClick={handleShowAdmins}>Admins</button>
        </div>
      )}

      {/* Conditional Rendering Based on Active Data */}
      {activeData === "students" && studentsData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Students List</h2>
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-[#0F6466] text-white">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Subjects</th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student) => (
                <tr key={student._id} className="bg-white border-b hover:bg-gray-100">
                  <td className="p-2 border">{student.id}</td>
                  <td className="p-2 border">{student.name}</td>
                  <td className="p-2 border">{student.class}</td>
                  <td className="p-2 border">{student.contact}</td>
                  <td className="p-2 border">{student.subjects.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeData === "teachers" && teachersData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Teachers List</h2>
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-[#0F6466] text-white">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Contact</th>
              </tr>
            </thead>
            <tbody>
              {teachersData.map((teacher) => (
                <tr key={teacher._id} className="bg-white border-b hover:bg-gray-100">
                  <td className="p-2 border">{teacher.employeeCode}</td>
                  <td className="p-2 border">{teacher.firstName} {teacher.lastName}</td>
                  <td className="p-2 border">{teacher.email}</td>
                  <td className="p-2 border">{teacher.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeData === "admins" && adminsData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Admins List</h2>
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-[#0F6466] text-white">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Contact</th>
              </tr>
            </thead>
            <tbody>
              {adminsData.map((admin) => (
                <tr key={admin._id} className="bg-white border-b hover:bg-gray-100">
                  <td className="p-2 border">{admin.adminCode}</td>
                  <td className="p-2 border">{admin.firstName} {admin.lastName}</td>
                  <td className="p-2 border">{admin.email}</td>
                  <td className="p-2 border">{admin.contactNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}