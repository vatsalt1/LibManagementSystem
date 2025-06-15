// src/components/SideBar.jsx
import React from "react";
import Draggable from "react-draggable";
import { SideBarData } from "../../Data/SidebarData";
import { setContent } from "../../action";
import { useSelector, useDispatch } from "react-redux";

const SideBar = ({ status }) => {
  const dispatch = useDispatch();
  const current = useSelector((s) => s.admin.content);

  return (
    // <Draggable> moves its first child
    <Draggable axis="x" bounds="parent" handle=".drag-handle">
      <aside
        className={`relative bg-gray-800 text-white h-full shadow-lg
          ${status ? "w-16" : "w-64"} transition-all duration-300`}
      >
        {/* this is the grab handle */}
        <div className="drag-handle p-2 cursor-move bg-gray-700 text-center">
          {status ? "☰" : "Drag Me"}
        </div>

        {/* your menu */}
        {SideBarData.map((section) => (
          <div key={section.title} className="mt-4">
            <h3 className="px-4 text-lg font-semibold">
              {status ? section.title.charAt(0) : section.title}
            </h3>
            {section.subCategory.map((item) => (
              <div
                key={item.name}
                onClick={() => dispatch(setContent(item.name))}
                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                  current === item.name ? "bg-gray-700" : ""
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!status && <span className="ml-2">{item.name}</span>}
              </div>
            ))}
          </div>
        ))}
      </aside>
    </Draggable>
  );
};

export default SideBar;
