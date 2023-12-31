import React from "react";
import { Route as RouterRoute, Routes } from "react-router-dom";
import LoadingRoute from "./loading-route";
import { useNetworkStatus } from "../hooks/network/use-network-status";

export type Route = {
  path: string;
  loader: () => Promise<{
    default: React.ComponentType<unknown>;
  }>;
  allowsOffline?: boolean;
};

type Props = {
  routes: Route[];
};

export default function Router(props: Props) {
  const routes = normalizeRoutes(props.routes);
  const { isOnline } = useNetworkStatus();

  return (
    <Routes>
      <RouterRoute path="*" element={<>404</>} />
      {routes
        .filter((r) => isOnline || (!isOnline && r.allowsOffline))
        .map((route) => {
          const RouteComponent = React.lazy(route.loader);

          return (
            <RouterRoute
              path={route.path}
              element={
                <LoadingRoute>
                  <RouteComponent />
                </LoadingRoute>
              }
              key={route.path}
            />
          );
        })}
    </Routes>
  );
}

const normalizeRoutes = (routes: Route[], basePath = "") => {
  const plainRoutes: Route[] = [];

  for (const route of routes) {
    plainRoutes.push({
      ...route,
      path: basePath + route.path,
    });
  }

  return plainRoutes;
};
