import React from "react";
import { Route, Routes } from "react-router-dom";
import { caosceAdminRoutes } from "./caosceAdminRoutes";

function CaosceRoutes() {
  return (
    <Routes>
      {caosceAdminRoutes.map((route, i) => (
        <Route path={route.path} element={<route.component />} key={i} />
      ))}
    </Routes>
  );
}

export default CaosceRoutes;
