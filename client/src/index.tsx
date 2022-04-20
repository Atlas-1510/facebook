import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
  rootElement
);
