import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  ErrorComponent,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { RouterContext } from "../main";
import GlobalStyle from "../styles/global";
import { getApiToken, isApiToken } from "../utils/authentication";
import { AppContainer } from "./index.style";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context, location, matches }) => {
    const apiToken = context.apiToken || getApiToken();
    if (isApiToken(apiToken)) {
      if (apiToken !== context.apiToken) {
        context.setApiToken(apiToken);
      }
      if (
        matches.length > 1 && // don't redirect when route not found (matching only root route)
        context.currentDirectory === "" &&
        location.pathname !== "/directory"
      ) {
        redirect({ to: "/directory", throw: true });
      }
    }
  },
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ({ error }) => StandardErrorComponent(error),
});

function NotFoundComponent() {
  return <div>Not found</div>;
}

function StandardErrorComponent(error: Error) {
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return <ErrorComponent error={error} />;
}

function RootComponent() {
  const { apiToken } = Route.useRouteContext();

  if (!isApiToken(apiToken)) {
    return <div>Missing token</div>;
  }

  return (
    <>
      <GlobalStyle />

      <AppContainer>
        <div className="header">
          <Header />
        </div>
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </AppContainer>

      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
