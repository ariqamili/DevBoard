import { useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Job Details</h1>
      <p>Viewing job with ID: {id}</p>
    </div>
  );
}
