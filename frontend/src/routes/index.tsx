import { createFileRoute } from "@tanstack/react-router";
import fmuLogo from "../assets/fmu_logo_full.svg";
import "../main.css";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import axios from "redaxios";

type HealthType = {
  status: string;
};

const fetchHealth = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return axios
    .get<HealthType>("http://localhost:8001/api/v1/health", {
      headers: {
        "x-fmu-settings-api": "...",
      },
    })
    .then((r) => r.data)
    .catch((err: unknown) => {
      throw err;
    });
};

const healthQueryOptions = queryOptions({
  queryKey: ["health"],
  queryFn: () => fetchHealth(),
});

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(healthQueryOptions),
  component: Index,
});

function Index() {
  const healthQuery = useSuspenseQuery(healthQueryOptions);
  const health = healthQuery.data;

  return (
    <>
      <div>
        <img src={fmuLogo} className="logo" alt="FMU logo" />
      </div>
      <h1>FMU Settings</h1>

      <p>Health: {health.status}</p>
    </>
  );
}
