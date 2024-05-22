import { useState } from "react";
import { salaryData, SalaryData } from "../data/data";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AggregatedData {
  year: number;
  totalJobs: number;
  averageSalary: number;
}

const aggregateData = (data: SalaryData[]): AggregatedData[] => {
  const aggregation: {
    [key: number]: { totalJobs: number; totalSalary: number };
  } = {};

  data.forEach((job) => {
    if (!aggregation[job.work_year]) {
      aggregation[job.work_year] = { totalJobs: 0, totalSalary: 0 };
    }
    aggregation[job.work_year].totalJobs += 1;
    aggregation[job.work_year].totalSalary += job.salary_in_usd;
  });

  return Object.entries(aggregation).map(
    ([year, { totalJobs, totalSalary }]) => ({
      year: parseInt(year, 10),
      totalJobs,
      averageSalary: totalSalary / totalJobs,
    })
  );
};
const Table = () => {
  const [data, setData] = useState<AggregatedData[]>(aggregateData(salaryData));
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AggregatedData;
    direction: "ascending" | "descending";
  } | null>(null);

  const navigate = useNavigate();

  const sortData = (key: keyof AggregatedData) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  const handleRowClick = (year: number) => {
    navigate(`/job-titles/${year}`);
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <h2 className="text-center text-2xl font-bold">Engineering Salaries</h2>
      <table className="table-fixed w-3/4 border-2 border-black">
        <thead>
          <tr>
            <th
              className="border-2 border-black bg-slate-400 cursor-pointer"
              onClick={() => sortData("year")}
            >
              Year{" "}
              {sortConfig?.key === "year" &&
                (sortConfig?.direction && sortConfig?.direction == "ascending"
                  ? " ↓"
                  : sortConfig?.direction == "descending"
                  ? " ↑"
                  : "")}
            </th>
            <th
              className="border-2 border-black p-2 bg-slate-400 cursor-pointer "
              onClick={() => sortData("totalJobs")}
            >
              Total Jobs{" "}
              {sortConfig?.key === "totalJobs" &&
                (sortConfig?.direction && sortConfig?.direction == "ascending"
                  ? " ↓"
                  : sortConfig?.direction == "descending"
                  ? " ↑"
                  : "")}
            </th>
            <th
              className="border-2 border-black bg-slate-400 cursor-pointer"
              onClick={() => sortData("averageSalary")}
            >
              Average Salary (USD)
              {sortConfig?.key === "averageSalary" &&
                (sortConfig?.direction && sortConfig?.direction == "ascending"
                  ? " ↓"
                  : sortConfig?.direction == "descending"
                  ? " ↑"
                  : "")}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.year} onClick={() => handleRowClick(row.year)}>
              <td className="text-center border border-black p-2 cursor-pointer">
                {row.year}
              </td>
              <td className="text-center border border-black p-2">
                {row.totalJobs}
              </td>
              <td className="text-center border border-black p-2">
                {row.averageSalary.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ResponsiveContainer width="90%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalJobs" stroke="#0a0a0b" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Table;
