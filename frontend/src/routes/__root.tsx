import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRoute,
  ErrorComponent,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Header } from "../components/Header";
import GlobalStyle from "../styles/global";
import { AppContainer, ContentContainer } from "./index.style";

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
        <Header />

        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </AppContainer>

      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
