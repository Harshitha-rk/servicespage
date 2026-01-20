import React from "react";
import "./CategoryTabs.css";

const TABS = [
  { label: "All Services", value: "ALL" },
  { label: "Bath Room Cleaning", value: "BATHROOM" },
  { label: "House Deep Cleaning", value: "HOUSE" },
];

export default function CategoryTabs({ activeTab, onChange }) {
  return (
    <div className="tabs-container">
      {TABS.map((tab) => (
        <span
          key={tab.value}
          className={`tab-item ${
            activeTab === tab.value ? "active" : ""
          }`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
}
