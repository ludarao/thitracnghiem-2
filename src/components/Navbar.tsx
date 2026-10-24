"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BarChart3, Settings } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Phòng thi", href: "/", icon: BookOpen },
    { label: "Số lượng dự thi", href: "/dashboard", icon: BarChart3 },
    { label: "Quản trị", href: "/admin", icon: Settings },
  ];

  return (
    <header className="site-header sticky top-0 z-50 border-b border-amber-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/csgt-logo.png"
                alt="Biểu trưng Cảnh sát giao thông"
                width={55}
                height={64}
                preload
                className="w-11 sm:w-[50px] h-auto shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-bold text-brand-700 leading-tight text-sm sm:text-base">
                  CÔNG AN TỈNH GIA LAI
                </span>
                <span className="mt-1 text-[10px] sm:text-xs font-semibold tracking-wide text-brand-700">
                  TÌM HIỂU PHÁP LUẬT GIAO THÔNG
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  aria-label={item.label}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-700 text-white shadow-sm"
                      : "text-brand-800 hover:bg-white/70"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-brand-700"}`}
                  />
                  <span className="inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
