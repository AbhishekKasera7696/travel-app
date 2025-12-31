import { type RouteConfig } from "@react-router/dev/routes";


export default [
    {
        file: "routes/admin/admin-layout.tsx",
        children: [
            {
                path: "dashboard",
                file: "routes/admin/dashboard.tsx",
            },
            {
                path: "all-users",
                file: "routes/admin/all-users.tsx",
            },
        ],
    },
] satisfies RouteConfig;

