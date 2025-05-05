import { Typography } from "@equinor/eds-core-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/general/smda")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Typography variant="h2">SMDA</Typography>;
}
