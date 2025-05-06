import { Button, Typography } from "@equinor/eds-core-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/directory/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { currentDirectory, setCurrentDirectory } = Route.useRouteContext();

  return (
    <>
      <Typography variant="h2">Directory</Typography>

      <Typography>Current directory: {currentDirectory}</Typography>

      <Button
        onClick={() => {
          setCurrentDirectory("/tmp");
        }}
      >
        Set current directory
      </Button>
    </>
  );
}
