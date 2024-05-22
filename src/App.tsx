import { BrowserRouter, Route, Routes } from "react-router-dom";
import Table from "./components/Table";
import JobTitlePage from "./components/JobTitleTable";
function App() {
  return (
    <main className="max-w-7xl mx-auto p-2 mt-4">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/job-titles/:year" element={<JobTitlePage />} />
        </Routes>{" "}
      </BrowserRouter>{" "}
    </main>
  );
}

export default App;
