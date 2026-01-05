import { type RouteConfig } from "@react-router/dev/routes";

export default [
    { path: "sign-in", file: "routes/root/sign-in.tsx" },
    {path: "api/create-trip" , file: "routes/api/create-trip.ts"},
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
            {
                path: "trips",
                file: "routes/admin/trips.tsx",
            },
            {
                path: "trips/create",
                file: "routes/admin/create-trip.tsx",
            },
        ],
    },
] satisfies RouteConfig;
