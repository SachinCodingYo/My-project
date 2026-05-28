export interface NavItem {
  name: string;
  path?: string;
  icon: string;
  visible: ("ADMIN" | "MR")[];
  children?: NavItem[];
}

export const navLinks: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
    visible: ["ADMIN", "MR"],
  },

  {
    name: "Master",
    icon: "Database",
    visible: ["ADMIN"],
    children: [
      {
        name: "Operators",
        path: "/operators",
        icon: "Smartphone",
        visible: ["ADMIN"],
      },
      {
        name: "VIP Categories",
        path: "/vip-categories",
        icon: "Star",
        visible: ["ADMIN"],
      },
      {
        name: "Services",
        path: "/services",
        icon: "Settings",
        visible: ["ADMIN"],
      },
      {
        name: "Plan Types",
        path: "/plan-types",
        icon: "Layers",
        visible: ["ADMIN"],
      },
      {
        name: "Plan Tags",
        path: "/plan-tags",
        icon: "Tag",
        visible: ["ADMIN"],
      },
      {
        name: "Plans",
        path: "/plans",
        icon: "FileText",
        visible: ["ADMIN"],
      },
      {
        name: "Fancy Numbers",
        path: "/fancy-numbers",
        icon: "Hash",
        visible: ["ADMIN"],
      },
      {
        name: "Service Pincodes",
        path: "/service-pincodes",
        icon: "MapPin",
        visible: ["ADMIN"],
      },
    ],
  },

  {
    name: "MR Management",
    path: "/mrs",
    icon: "Users",
    visible: ["ADMIN"],
  },

  {
    name: "Support Tickets",
    path: "/tickets",
    icon: "MessageCircle",
    visible: ["ADMIN"],
  },

  {
    name: "Users",
    path: "/users",
    icon: "User",
    visible: ["ADMIN"],
  },

  {
    name: "Red Flags",
    path: "/red-flags",
    icon: "Flag",
    visible: ["ADMIN"],
  },

  {
    name: "SIM Inventory",
    path: "/sim-inventory",
    icon: "Package",
    visible: ["ADMIN"],
  },

  {
    name: "Orders",
    path: "/orders",
    icon: "ShoppingCart",
    visible: ["ADMIN"],
  },

  {
    name: "KYC Approvals",
    path: "/kyc-approvals",
    icon: "ShieldCheck",
    visible: ["ADMIN"],
  },

  {
    name: "Payments",
    path: "/payments",
    icon: "CreditCard",
    visible: ["ADMIN"],
  },

  {
    name: "Reports",
    path: "/reports",
    icon: "BarChart3",
    visible: ["ADMIN"],
  },

  {
    name: "My Profile",
    path: "/profile",
    icon: "UserCircle",
    visible: ["ADMIN", "MR"],
  },

  {
    name: "Change Password",
    path: "/admin-change-password",
    icon: "Lock",
    visible: ["ADMIN", "MR"],
  },
];
