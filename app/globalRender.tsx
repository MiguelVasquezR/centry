"use client";
import { Toaster } from "react-hot-toast";

import HeaderRender from "../src/component/Header";
import ReduxProvider from "../src/redux/providers/ReduxProvider";
import "../src/style/global.css";

const GlobalRender = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <HeaderRender>{children}</HeaderRender>
      <Toaster position="top-center" toastOptions={{ duration: 12 }} />
    </ReduxProvider>
  );
};

export default GlobalRender;
