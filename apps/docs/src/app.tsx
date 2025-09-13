import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { AppHeader } from "./components/AppHeader";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <AppHeader />
          <main>
            <Suspense>{props.children}</Suspense>
          </main>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
