"use client";

import HeaderRender from "../src/component/Header";
import ReduxProvider from "../src/redux/providers/ReduxProvider";
import "../src/style/global.css";

const GlobalRender = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <HeaderRender>{children}</HeaderRender>
    </ReduxProvider>
  );
};

export default GlobalRender;
