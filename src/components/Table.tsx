import { useState } from "react";
import { salaryData, SalaryData } from "../data/data";
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

  return (
    <table className="table-fixed w-full border-2">
      <thead>
        <tr>
          <th
            className="border-2 bg-slate-400"
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
            className="border-2 p-2 bg-slate-400 "
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
            className="border-2 bg-slate-400"
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
          <tr key={row.year}>
            <td className="text-center border p-2">{row.year}</td>
            <td className="text-center border p-2">{row.totalJobs}</td>
            <td className="text-center border p-2">
              {row.averageSalary.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;