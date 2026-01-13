// import {
//   isRouteErrorResponse,
//   Links,
//   Meta,
//   Outlet,
//   Scripts,
//   ScrollRestoration,
// } from "react-router";
// import * as Sentry from "@sentry/react-router";
// import type { Route } from "./+types/root";
// import "./app.css";
//
// import { registerLicense } from "@syncfusion/ej2-base";
// import { storeUserData, getUser } from "~/appwrite/auth";
//
// // Register Syncfusion license
// registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);
//
// export const loader: Route.LoaderFunction = async () => {
//   try {
//     let user = await getUser().catch(() => null);
//
//     // If no user record yet (first OAuth login), ensure it's created
//     if (!user) {
//       await storeUserData();
//       user = await getUser().catch(() => null);
//     }
//
//     // Returning user allows nested routes to access it via useLoaderData if needed
//     return user;
//   } catch (error) {
//     console.error("Root loader error:", error);
//     return null;
//   }
// };
//
// export function Layout({ children }: { children: React.ReactNode }) {
//   return (
//       <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//       {children}
//       <ScrollRestoration />
//       <Scripts />
//       </body>
//       </html>
//   );
// }
//
// export default function App() {
//   return <Outlet />;
// }
//
// export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
//   console.error("App Error:", error);
//
//   let message = "Oops!";
//   let details = "An unexpected error occurred.";
//   let stack: string | undefined;
//
//   if (isRouteErrorResponse(error)) {
//     message = error.status === 404 ? "404" : "Error";
//     details =
//         error.status === 404
//             ? "The requested page could not be found."
//             : error.statusText || details;
//   } else if (error && error instanceof Error) {
//     Sentry.captureException(error);
//     details = error.message;
//     stack = error.stack;
//   }
//
//   if (details.includes("User not found") || details.includes("fetch")) {
//     setTimeout(() => window.location.reload(), 1500);
//   }
//
//   return (
//       <main className="pt-16 p-4 container mx-auto text-center">
//         <h1 className="text-2xl font-semibold">{message}</h1>
//         <p>{details}</p>
//         {stack && (
//             <pre className="w-full p-4 overflow-x-auto text-left">
//           <code>{stack}</code>
//         </pre>
//         )}
//       </main>
//   );
// }

















import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import * as Sentry from "@sentry/react-router";
import type { Route } from "./+types/root";
import "./app.css";

import { registerLicense } from "@syncfusion/ej2-base";
import { storeUserData, getUser } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

import { ensureFallbackCookie } from "./appwrite/appwrite-fallback";

// Register Syncfusion license
registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

// ✅ Root loader (runs on app load)
export const loader: Route.LoaderFunction = async () => {
  try {
    // Step 1 — Ensure Appwrite fallback cookie (handles cross-domain OAuth)
    await ensureFallbackCookie();

    // Step 2 — Try to get user from Appwrite SDK
    let user = await getUser().catch(async () => {
      try {
        // Try fetching directly from account (uses fallback cookie)
        return await account.get();
      } catch {
        return null;
      }
    });

    // Step 3 — If no user (first login or missing DB record), ensure user creation
    if (!user) {
      await storeUserData().catch(() => null);
      user = await getUser().catch(() => null);
    }

    // ✅ Return user to nested routes (optional for `useLoaderData`)
    return user;
  } catch (error) {
    console.error("Root loader error:", error);
    return null;
  }
};

// ✅ Layout wrapper (unchanged)
export function Layout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      </body>
      </html>
  );
}

export default function App() {
  return <Outlet />;
}

// ✅ Improved ErrorBoundary (kept your logic intact)
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  console.error("App Error:", error);

  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
        error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
  } else if (error && error instanceof Error) {
    Sentry.captureException(error);
    details = error.message;
    stack = error.stack;
  }

  // Auto-retry on transient auth/fetch issues (helpful after OAuth redirect)
  if (details.includes("User not found") || details.includes("fetch")) {
    setTimeout(() => window.location.reload(), 1500);
  }

  return (
      <main className="pt-16 p-4 container mx-auto text-center">
        <h1 className="text-2xl font-semibold">{message}</h1>
        <p>{details}</p>
        {stack && (
            <pre className="w-full p-4 overflow-x-auto text-left">
          <code>{stack}</code>
        </pre>
        )}
      </main>
  );
}

