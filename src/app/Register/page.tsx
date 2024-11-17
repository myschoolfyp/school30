"use client";
import { useState } from "react";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [classInfo, setClassInfo] = useState("");
  const [section, setSection] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [childId, setChildId] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName, lastName, email, password, userType, contactNumber,
          classInfo, section, rollNumber, employeeCode, childId, adminCode
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user.");
      }

      alert("Registration successful!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
      setContactNumber("");
      setClassInfo("");
      setSection("");
      setRollNumber("");
      setEmployeeCode("");
      setChildId("");
      setAdminCode("");
    } catch (error) {
      setError("Error registering user");
    }
  };

  return (
    <div className="screenMiddleDiv bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="formDiv">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-center text-2xl font-bold mb-4 text-teal-700">Registration</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <InputField label="First Name" value={firstName} setValue={setFirstName} />
          <InputField label="Last Name" value={lastName} setValue={setLastName} />
          <InputField label="Email Address" type="email" value={email} setValue={setEmail} />
          <InputField label="Password" type="password" value={password} setValue={setPassword} />
          <InputField label="Confirm Password" type="password" value={confirmPassword} setValue={setConfirmPassword} />

          <div>
            <label htmlFor="userType" className="formLabel">User Type</label>
            <select 
              id="userType" 
              value={userType} 
              onChange={(e) => setUserType(e.target.value)}
              className="w-full bg-white text-black border border-gray-300 focus:outline-none p-2 rounded" 
              required
            >
              <option value="" disabled>Select User Type</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Parent">Parent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <InputField label="Contact Number" value={contactNumber} setValue={setContactNumber} />

          {userType === "Student" && (
            <>
              <InputField label="Class" value={classInfo} setValue={setClassInfo} />
              <InputField label="Section" value={section} setValue={setSection} />
              <InputField label="Roll Number" value={rollNumber} setValue={setRollNumber} />
            </>
          )}
          {userType === "Teacher" && (
            <InputField label="Employee Code" value={employeeCode} setValue={setEmployeeCode} />
          )}
          {userType === "Parent" && (
            <InputField label="Child ID" value={childId} setValue={setChildId} />
          )}
          {userType === "Admin" && (
            <InputField label="Admin Code" value={adminCode} setValue={setAdminCode} />
          )}

          <button type="submit" className="w-full py-2 bg-teal-600 text-white hover:bg-teal-700 rounded">Register</button>

          <div className="text-center mt-4">
            Already have an account? <a href="Login#" className="text-teal-600">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, setValue }: any) {
  return (
    <div>
      <label className="formLabel text-gray-700">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        required
        className="w-full bg-white text-black border border-gray-300 focus:outline-none p-2 rounded"
      />
    </div>
  );
}