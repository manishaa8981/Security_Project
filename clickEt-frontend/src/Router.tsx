import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routeConfig } from "@/lib/routerConfig";
import { ELayouts } from "@/interfaces/IRouterConfig";
import LoadingFallback from "@/components/common/LoadingFallback";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/common/ErrorFallback";
import { lazyImport } from "@/utils/lazyImporter";
import ProtectedRoute from "./components/HOC/ProtectedRoute";

// Layout components
const layouts = {
  [ELayouts.CLIENT]: lazy(() => import("@/components/layouts/UserLayout")),
  [ELayouts.ADMIN]: lazy(() => import("@/components/layouts/AdminLayout")),
  [ELayouts.NA]: lazy(() => import("@/components/layouts/NoneLayout")),
};

const Router = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <Routes>
      {Object.entries(routeConfig).map(([key, config]) => {
        const Component = lazyImport(config.componentLocation);
        const LayoutComponent = layouts[config.layout];

        return (
          <Route
            key={config.path}
            path={config.path}
            element={
              <ProtectedRoute>
                <LayoutComponent>
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary
                      onReset={reset}
                      fallbackRender={({ resetErrorBoundary }) => (
                        <ErrorFallback
                          resetErrorBoundary={resetErrorBoundary}
                        />
                      )}
                    >
                      <Component />
                    </ErrorBoundary>
                  </Suspense>
                </LayoutComponent>
              </ProtectedRoute>
            }
          />
        );
      })}
      {/* Fallback route for undefined paths */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default Router;
