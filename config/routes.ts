// routes.ts (or routes.tsx)
import {
  LayoutDashboard,
  FileText,
  Tag,
  Package,
  MessageSquare,
  Mail,
  ShoppingCart,
} from "lucide-react";

export const routes = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    admin: false,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/dashboard/orders",
    admin: true,
  },
  {
    title: "Contacts",
    icon: Mail,
    href: "/dashboard/contacts",
    admin: true,
  },
  {
    title: "Products",
    icon: Package,
    href: "/dashboard/products",
    admin: true,
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
    title: "Reviews",
    icon: MessageSquare,
    href: "/dashboard/reviews",
    admin: true,
  },
];
