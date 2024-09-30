import { Page } from "@strapi/strapi/admin";
import { Route, Routes } from "react-router-dom";
import Designer from "./Designer";
import { HomePage } from "./HomePage";

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="design/:templateId" element={<Designer />} />
      <Route path="core/:coreEmailType" element={<Designer isCore />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
