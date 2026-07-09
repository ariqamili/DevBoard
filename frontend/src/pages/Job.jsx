import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        setJobs(response.data);
        // console.log(response);
        // console.log(response.data);
      } catch (err) {
        setError("Failed to load jobs");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) return <p>{error}</p>;

  if (jobs.length === 0) return <p>No jobs available.</p>;

  return (
    <>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </>
  );
}
