import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRoute,
  ErrorComponent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import GlobalStyle from "../styles/global";
import { AppContainer } from "./index.style";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: () => {
    return <div>Not found</div>;
  },
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  },
});

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
