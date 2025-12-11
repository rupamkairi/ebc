"use client";
import React, { useEffect, useState } from "react";
import { Bell, Sun, Moon } from "lucide-react";

export default function TopNavbar() {
  const [isDark, setIsDark] = useState(false);

  // Initial theme check
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <div className="w-full flex items-center justify-end pr-2 gap-4 transition-colors">
      {/* SUPPORT BUTTON */}
      <button className="bg-[#FF7A00] text-white px-7 py-2.5 rounded-full font-medium text-[15px] shadow-[0_4px_10px_rgba(0,0,0,0.12)] hover:bg-[#e86e00] transition-all">
        Talk to Support Team
      </button>

      {/* DARK/LIGHT MODE TOGGLE */}
      <div
        onClick={toggleTheme}
        className="h-11 w-11 rounded-xl bg-white dark:bg-gray-800 shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        )}
      </div>

      {/* NOTIFICATION BELL */}
      <div className="relative h-11 w-11 rounded-xl bg-white dark:bg-gray-800 shadow-[0_2px_6px_rgba(0,0,0,0.12)] flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <Bell className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
      </div>

      {/* USER AVATAR */}
      <div className="h-11 w-11 rounded-full bg-[#2F6BFF] text-white flex items-center justify-center font-semibold shadow cursor-pointer">
        RS
      </div>
    </div>
  );
}
