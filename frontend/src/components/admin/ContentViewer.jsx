// src/components/ContentViewer.jsx
import React from "react";
import { useSelector } from "react-redux";
import { AdminComps } from "../../Data/SidebarData";

const ContentViewer = () => {
  const currContent = useSelector((state) => state.admin.content);
  return (
    <div className="w-[80%] sm:w-[100%] sm:ml-0 ml-[20%] p-10 sm:p-0 bg-sky-200 flex justify-center items-start pt-36 sm:pt-32">
      {AdminComps.map((comp) =>
        currContent === comp.name ? (
          <div key={comp.name} className="w-full">
            {comp.comp}
          </div>
        ) : null
      )}
    </div>
  );
};

export default ContentViewer;