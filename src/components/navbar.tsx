"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Boxes } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "テンプレート",
      active: pathname === "/",
    },
    {
      href: "/saved",
      label: "保存済み",
      active: pathname === "/saved",
    },
    {
      href: "/about",
      label: "サービス紹介",
      active: pathname === "/about",
    },
  ];

  return (
    <header className="py-4 border-b border-zinc-100 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Boxes className="w-8 h-8 text-violet-600" />
            <span className="font-bold text-xl">Prompt Box</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-violet-600",
                route.active ? "text-zinc-900" : "text-zinc-500"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
