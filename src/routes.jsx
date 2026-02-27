import { Navigate } from "react-router-dom";
import App from "./App";

const routes = [
  {
    path: "/",
    element: <Navigate to="/ka" replace />,
  },
  {
    path: "/:language",
    element: <App />,
  },
];

export default routes;
