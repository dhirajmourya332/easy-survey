import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RouteGuard from "./components/RouteGuard.";

//
import Root from "./routes/Root";
import Login from "./routes/Login";
import CreateSurveyForm from "./routes/CreateSurveyForm";
import Analyse from "./routes/Analyse";
import SignUp from "./routes/SignUp";
import Dashboard from "./routes/Dashboard";
import Form from "./routes/Form";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: <RouteGuard component={Dashboard} />,
  },
  {
    path: "/form",
    element: <Form />,
  },
  {
    path: "/create-survey-form",
    element: <RouteGuard component={CreateSurveyForm} />,
  },
  { path: "/analyse-form", element: <RouteGuard component={Analyse} /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
