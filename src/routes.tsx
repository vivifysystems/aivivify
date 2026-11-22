import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/site/Layout";
import Home from "./pages/Home";
import Solutions from "./pages/Solutions";
import Systems from "./pages/Systems";
import SystemDetail from "./pages/SystemDetail";
import Demos from "./pages/Demos";
import Work from "./pages/Work";
import WorkDetail from "./pages/WorkDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

/** The route tree, shared by the browser entry and the static prerender. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/systems" element={<Systems />} />
        <Route path="/systems/:slug" element={<SystemDetail />} />
        <Route path="/demos" element={<Demos />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
