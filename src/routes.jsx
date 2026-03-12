import { Navigate } from "react-router-dom";
import App from "./App";
import Marriages from "./Marriages";

const routes = [
  {
    path: "/",
    element: <Navigate to="/ka" replace />,
  },
  {
    path: "/:language",
    element: <App />,
  },
  {
    path: "/:language/marriages",
    element: <Marriages />,
  },
];

export default routes;
