import { Button } from "@equinor/eds-core-react";
import {
  QueryErrorResetBoundary,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  ErrorComponent,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";

import {
  projectGetProjectOptions,
  projectGetProjectQueryKey,
  userGetUserOptions,
} from "../client/@tanstack/react-query.gen";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { RouterContext } from "../main";
import { PageHeader, PageText } from "../styles/common";
import GlobalStyle from "../styles/global";
import {
  getApiToken,
  isApiTokenNonEmpty,
  queryAndMutationRetry,
} from "../utils/authentication";
import { AppContainer } from "./index.style";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context, matches }) => {
    let apiTokenStatus = context.apiTokenStatus;
    let projectDirNotFound = false;

    const apiToken = context.apiToken || getApiToken();
    if (isApiTokenNonEmpty(apiToken)) {
      apiTokenStatus = { present: true, valid: true };
      if (apiToken !== context.apiToken) {
        context.setApiToken(apiToken);
      }
    } else {
      apiTokenStatus = { present: false, valid: false };
    }
    context.setApiTokenStatus(apiTokenStatus);

    if (context.hasResponseInterceptor) {
      await context.queryClient
        .fetchQuery({
          ...userGetUserOptions(),
          retry: (failureCount, error) =>
            queryAndMutationRetry(failureCount, error),
          meta: { errorPrefix: "Error getting initial user data" },
        })
        .catch(() => undefined);
    }

    const projectDirQueryState = context.queryClient.getQueryState(
      projectGetProjectQueryKey(),
    );
    if (
      projectDirQueryState !== undefined &&
      projectDirQueryState.status === "error" &&
      isAxiosError(projectDirQueryState.error) &&
      projectDirQueryState.error.status === 404
    ) {
      projectDirNotFound = true;
    }
    if (projectDirQueryState === undefined || !projectDirNotFound) {
      await context.queryClient
        .fetchQuery(projectGetProjectOptions())
        .catch((error: unknown) => {
          if (isAxiosError(error)) {
            if (error.status === 404) {
              projectDirNotFound = true;
            } else if (error.status === 401) {
              apiTokenStatus = { present: true, valid: false };
            } else {
              console.error("      GET /fmu error =", error);
            }
          } else {
            console.error("Unknown error getting FMU directory: ", error);
          }
        });
    }
    if (
      projectDirNotFound &&
      matches.length > 1 && // don't redirect when route not found (when matching only root route)
      location.pathname !== "/directory"
    ) {
      redirect({ to: "/directory", throw: true });
    }

    return {
      apiToken,
      apiTokenStatus,
    };
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

function ErrorFallbackComponent({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <>
      <PageHeader>Error</PageHeader>

      <PageText>An error occured: {error.message}</PageText>

      <PageText>Please try again, or go to another page.</PageText>

      <Button onClick={resetErrorBoundary}>Retry</Button>
    </>
  );
}

function RootComponent() {
  const location = useLocation();
  const { apiTokenStatus } = Route.useRouteContext();

  if (!apiTokenStatus.present || !apiTokenStatus.valid) {
    return (
      <>
        <div>
          {!apiTokenStatus.present ? "Missing" : "Invalid"} token, please close
          browser tab and open URL again
        </div>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <ToastContainer theme="colored" />

      <AppContainer>
        <div className="header">
          <Header />
        </div>
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="content">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                resetKeys={[location.pathname]}
                onReset={reset}
                FallbackComponent={ErrorFallbackComponent}
              >
                <Outlet />
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </div>
      </AppContainer>

      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
