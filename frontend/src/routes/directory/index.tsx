import { Typography } from "@equinor/eds-core-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/directory/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Typography variant="h2">Directory</Typography>;
}
