import { type RouteConfig } from "@react-router/dev/routes";

export default [
    { path: "sign-in", file: "routes/root/sign-in.tsx" },
    { path: "api/create-trip", file: "routes/api/create-trip.ts" },

    // Admin Layout + routes
    {
        file: "routes/admin/admin-layout.tsx",
        children: [
            { path: "dashboard", file: "routes/admin/dashboard.tsx" },
            { path: "all-users", file: "routes/admin/all-users.tsx" },
            { path: "trips", file: "routes/admin/trips.tsx" },
            { path: "trips/create", file: "routes/admin/create-trip.tsx" },
            { path: "trips/:tripId", file: "routes/admin/trip-detail.tsx" },
        ],
    },

    {
        file: "routes/root/page-layout.tsx",
        children: [
            {
                index: true,
                file: "routes/root/travel-page.tsx",
            },
            {
                path: "travel/:tripId",
                file: "routes/root/travel-detail.tsx",
            },
            {
                path: "travel/:tripId/success",
                file: "routes/root/payment-success.tsx",
            },
            {
                path: "travel/:tripId/checkout",
                file: "routes/root/payment-page.tsx",
            },
        ],
    },
] satisfies RouteConfig;
