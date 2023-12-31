import NavigationLayout from "./layouts/navigation/navigation.layout";
import Router from "./router/router";
import routes_definition from "./router/routes-definition";
import "./styles/reset.css";

export default function App() {
  return (
    <NavigationLayout>
      <Router routes={routes_definition} />
    </NavigationLayout>
  );
}
