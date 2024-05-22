import { useParams } from "react-router-dom";
import { salaryData, SalaryData } from "../data/data";
import { useNavigate } from "react-router-dom";

interface AggregatedJobTitleData {
  jobTitle: string;
  jobCount: number;
}

const aggregateJobTitles = (
  data: SalaryData[],
  year: number
): AggregatedJobTitleData[] => {
  const filteredData = data.filter((job) => job.work_year === year);
  const aggregation: { [key: string]: number } = {};

  filteredData.forEach((job) => {
    if (!aggregation[job.job_title]) {
      aggregation[job.job_title] = 0;
    }
    aggregation[job.job_title] += 1;
  });

  return Object.entries(aggregation).map(([jobTitle, jobCount]) => ({
    jobTitle,
    jobCount,
  }));
};

const JobTitlePage = () => {
  const { year } = useParams<{ year: string }>();
  const jobTitleData = aggregateJobTitles(salaryData, Number(year));
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 items-center">
      <span
        className="absolute top-4 left-10 cursor-pointer text-lg"
        onClick={() => navigate("/")}
      >
        &larr; Back
      </span>
      <h2 className="text-center text-2xl font-bold">Job Titles in {year}</h2>
      <table className="table-fixed w-3/4 border-2 border-black">
        <thead>
          <tr>
            <th className="border-2 border-black p-2 bg-slate-400">
              Job Title
            </th>
            <th className="border-2 border-black p-2 bg-slate-400">
              Number of Jobs
            </th>
          </tr>
        </thead>
        <tbody>
          {jobTitleData.map((row) => (
            <tr key={row.jobTitle}>
              <td className="text-center border border-black p-2">
                {row.jobTitle}
              </td>
              <td className="text-center border border-black p-2">
                {row.jobCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTitlePage;
