"use client";
import { Toaster } from "react-hot-toast";

import HeaderRender from "../src/component/Header";
import ReduxProvider from "../src/redux/providers/ReduxProvider";
import { AuthProvider } from "../src/contexts/AuthContext";
import "../src/style/global.css";

const GlobalRender = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ReduxProvider>
        <HeaderRender>{children}</HeaderRender>
        <Toaster position="top-center" />
      </ReduxProvider>
    </AuthProvider>
  );
};

export default GlobalRender;
