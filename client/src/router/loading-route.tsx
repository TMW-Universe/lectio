import { Suspense } from "react";
import RouteLayout from "../layouts/route/route.layout";

type Props = {
  children: JSX.Element;
};

export default function LoadingRoute({ children }: Props) {
  return (
    <Suspense>
      <RouteLayout>{children}</RouteLayout>
    </Suspense>
  );
}
