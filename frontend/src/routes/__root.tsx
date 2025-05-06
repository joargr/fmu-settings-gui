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
import { AppContainer } from "./index.style";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ location, context }) => {
    if (location.pathname !== "/directory" && context.currentDirectory === "") {
      redirect({ to: "/directory", throw: true });
    }
  },
  component: Root,
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

function Root() {
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
