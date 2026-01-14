// import React from 'react'
// import {Link, redirect} from "react-router";
// import {ButtonComponent} from "@syncfusion/ej2-react-buttons";
// import {loginWithGoogle} from "~/appwrite/auth";
// import {account} from "~/appwrite/client";
//
// export async function clientLoader(){
//     try {
//         const user = await account.get();
//         if(user.$id) return redirect("/")
//     }catch (e) {
//         console.log("Error fetching user",e)
//     }
// }
// const SignIn = () => {
//     return (
//         <main className="auth">
//             <section className="size-full glassmorphism flex-center px-6">
//                 <div className="sign-in-card">
//                    <header className="header">
//                        <Link to="/">
//                            <img
//                              src="/assets/icons/logo.svg"
//                              alt="Logo"
//                              className="size-[30px]"
//                            />
//                        </Link>
//                        <h1 className="p-28-bold text-dark-100">MakeMyTour</h1>
//                    </header>
//                     <article>
//                         <h2 className="p-28-semibold text-dark-100 text-center">Start Your Travel Journey</h2>
//                         <p className="p-18-regular text-center text-gray-100 !leading-7">Sign in with Google to manage destinations, itineraries, and user activity with ease.</p>
//                     </article>
//                     <ButtonComponent
//                         type="button"
//                         iconCss="e-search-icon"
//                         className="button-class !h-11 !w-full"
//                         onClick={loginWithGoogle}
//                     >
//                         <img
//                           src="/assets/icons/google.svg"
//                           className="size-5"
//                           alt="google"
//                         />
//                         <span className="p-18-semibold text-white">Sign in with Google</span>
//                     </ButtonComponent>
//                 </div>
//             </section>
//         </main>
//     )
// }
// export default SignIn




// import React from "react";
// import { Link, redirect } from "react-router";
// import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
// import { loginWithGoogle } from "~/appwrite/auth";
// import { account } from "~/appwrite/client";
// import { ensureFallbackCookie } from "~/appwrite/appwrite-fallback";
//
// export async function clientLoader() {
//     try {
//         // Ensure fallback cookie if Appwrite returned it in the OAuth redirect response
//         await ensureFallbackCookie();
//
//         // Now try to get account (SDK will use cookieFallback if necessary)
//         const user = await account.get().catch(() => null);
//         if (user && user.$id) return redirect("/");
//     } catch (e) {
//         console.log("Error fetching user", e);
//     }
//     return null;
// }
//
// const SignIn = () => {
//     return (
//         <main className="auth">
//             <section className="size-full glassmorphism flex-center px-6">
//                 <div className="sign-in-card">
//                     <header className="header">
//                         <Link to="/">
//                             <img src="/assets/icons/logo.svg" alt="Logo" className="size-[30px]" />
//                         </Link>
//                         <h1 className="p-28-bold text-dark-100">MakeMyTour</h1>
//                     </header>
//                     <article>
//                         <h2 className="p-28-semibold text-dark-100 text-center">Start Your Travel Journey</h2>
//                         <p className="p-18-regular text-center text-gray-100 !leading-7">
//                             Sign in with Google to manage destinations, itineraries, and user activity with ease.
//                         </p>
//                     </article>
//
//                     <ButtonComponent
//                         type="button"
//                         iconCss="e-search-icon"
//                         className="button-class !h-11 !w-full"
//                         onClick={() => loginWithGoogle()}
//                     >
//                         <img src="/assets/icons/google.svg" className="size-5" alt="google" />
//                         <span className="p-18-semibold text-white">Sign in with Google</span>
//                     </ButtonComponent>
//                 </div>
//             </section>
//         </main>
//     );
// };
// export default SignIn;



import React, { useState } from "react";
import { Link, redirect, useNavigate } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import { ensureFallbackCookie } from "~/appwrite/appwrite-fallback";

export async function clientLoader() {
    try {
        await ensureFallbackCookie();
        const user = await account.get().catch(() => null);
        if (user && user.$id) return redirect("/");
    } catch (e) {
        console.log("Error fetching user", e);
    }
    return null;
}

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleManualLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await ensureFallbackCookie();

            // ✅ For Appwrite SDK v21+
            await account.createEmailPasswordSession({ email, password });

            const user = await account.get();
            if (user && user.$id) navigate("/");
        } catch (err: any) {
            console.error("Manual login error:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth">
            <section className="size-full glassmorphism flex-center px-6">
                <div className="sign-in-card max-w-md w-full p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                    <header className="header mb-4 flex items-center gap-3 justify-center">
                        <Link to="/">
                            <img src="/assets/icons/logo.svg" alt="Logo" className="size-[30px]" />
                        </Link>
                        <h1 className="p-28-bold text-dark-100">MakeMyTour</h1>
                    </header>

                    <article className="text-center mb-6">
                        <h2 className="p-28-semibold text-dark-100">Welcome Back 👋</h2>
                        <p className="p-18-regular text-gray-100 leading-7">
                            Sign in with Google or use your email and password to continue.
                        </p>
                    </article>

                    {/* Google Login */}
                    <ButtonComponent
                        type="button"
                        iconCss="e-search-icon"
                        className="button-class !h-11 !w-full mb-5"
                        onClick={() => loginWithGoogle()}
                        disabled={loading}
                    >
                        <img src="/assets/icons/google.svg" className="size-5 mr-2" alt="google" />
                        <span className="p-18-semibold text-white">Continue with Google</span>
                    </ButtonComponent>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-[1px] bg-gray-300"></div>
                        <span className="px-3 text-black-500 text-sm">or</span>
                        <div className="flex-grow h-[1px] bg-gray-300"></div>
                    </div>

                    {/* Manual Login */}
                    <form onSubmit={handleManualLogin} className="flex flex-col gap-4 text-left">
                        <div>
                            <label htmlFor="email" className="block text-black-200 text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 rounded-md border border-black-300 bg-transparent text-black placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-black-200 text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 rounded-md border border-black-300 bg-transparent text-black placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}

                        <ButtonComponent
                            type="submit"
                            className="!h-11 !w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </ButtonComponent>
                    </form>

                    <p className="text-sm text-black-300 mt-5 text-center">
                        Don’t have an account?
                        <Link to="/sign-up" className="text-black-400 hover:underline ml-1">
                            Create one
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default SignIn;


