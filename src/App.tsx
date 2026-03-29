import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routesConfig } from "@/routes/routes";
import Layout from "@/components/Layout";
import Page404 from "@/error-pages/404";
import ResetActiveStates from "@/utils/ResetActiveStates";

function App() {
  return (
    <BrowserRouter>
      <ResetActiveStates />
      <Routes>
        <Route element={<Layout />}>
          {routesConfig.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
