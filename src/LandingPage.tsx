import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    getAllProjects {
      id
      name
      goal
    }
  }
`;

export interface InterfaceProject {
  id: string;
  name: string;
  goal: string;
}

const LandingPage = () => {
  const { data: gqlData, loading, error } = useQuery(GET_ALL_PROJECTS);
  const [helloMessage, setHelloMessage] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:4000/hello")
      .then((res) => res.json())
      .then((result) => {
        console.log("Hello result:", result);
        setHelloMessage(result.message); // Assuming the API returns `{ message: "Hello" }`
      });
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error fetching projects: {error.message}</p>;

  const projects = gqlData?.getAllProjects ?? [];

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project: InterfaceProject) => (
          <li key={project.id}>
            <strong>{project.name}</strong>: {project.goal}
          </li>
        ))}
      </ul>
      <p>Message from API: {helloMessage}</p>
    </div>
  );
};

export default LandingPage;
