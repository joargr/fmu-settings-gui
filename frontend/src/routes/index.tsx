import { createFileRoute } from "@tanstack/react-router";
import fmuLogo from "../assets/fmu_logo_full.svg";
import "../main.css";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div>
        <img src={fmuLogo} className="logo" alt="FMU logo" />
      </div>
      <h1>FMU Settings</h1>
    </>
  );
}
