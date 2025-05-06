import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import {
  Dispatch,
  SetStateAction,
  StrictMode,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom/client";

import { client } from "./client/client.gen";
import { routeTree } from "./routeTree.gen";
import { getApiToken } from "./utils/authentication";

export interface RouterContext {
  currentDirectory: string;
  setCurrentDirectory: Dispatch<SetStateAction<string>>;
}

const queryClient = new QueryClient();

const apiToken = getApiToken();
if (apiToken !== "") {
  client.setConfig({
    headers: {
      "x-fmu-settings-api": apiToken,
    },
  });
  history.pushState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
}

const router = createRouter({
  routeTree,
  context: {
    currentDirectory: undefined!,
    setCurrentDirectory: undefined!,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  // eslint-disable-next-line no-unused-vars
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const [currentDirectory, setCurrentDirectory] = useState<string>("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentDirectory will indeed be invalidated
  useEffect(() => void router.invalidate(), [currentDirectory]);

  return (
    <RouterProvider
      router={router}
      context={{ currentDirectory, setCurrentDirectory }}
    />
  );
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}
