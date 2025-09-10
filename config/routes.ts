// routes.ts (or routes.tsx)
import {
  LayoutDashboard,
  FileText,
  Tag,
  Package,
} from "lucide-react";

export const routes = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    admin: false,
  },
  {
    title: "Articles",
    icon: FileText,
    href: "/dashboard/articles",
    admin: true,
  },
  {
    title: "Coupons",
    icon: Tag,
    href: "/dashboard/coupons",
    admin: true,
  },
  {
    title: "Products",
    icon: Package,
    href: "/dashboard/products",
    admin: true,
  },
];
