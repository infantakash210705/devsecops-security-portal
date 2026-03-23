"use client";

import { useEffect, useState } from "react";

export default function EmployeesPage() {
    type Employee = {
  _id: string
  name: string
  email: string
  role: string
}
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const auth = JSON.parse(localStorage.getItem("securecorp_auth") || "{}");

      const res = await fetch("http://localhost:5000/api/admin/employees", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await res.json();
      setEmployees(data);
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp: Employee) => (
            <tr key={emp._id}>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.email}</td>
              <td className="border p-2">{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}