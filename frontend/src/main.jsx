import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "../src/redux/store.js";
import ErrorBoundary from "./components/ErrorBoundary/index.jsx";
import Loader from "./components/Loader/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
