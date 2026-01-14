import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { ID } from "appwrite";
import { ensureFallbackCookie } from "~/appwrite/appwrite-fallback";

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await ensureFallbackCookie();

            // ✅ Create user
            await account.create(ID.unique(), email, password, name);

            // ✅ Log in immediately
            await account.createEmailPasswordSession({ email, password });

            // Redirect after successful signup
            navigate("/");
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Something went wrong. Please try again.");
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
                        <h2 className="p-28-semibold text-dark-100">Create Your Account ✨</h2>
                        <p className="p-18-regular text-gray-100 leading-7">
                            Join MakeMyTour and start exploring your dream destinations.
                        </p>
                    </article>

                    <form onSubmit={handleSignup} className="flex flex-col gap-4 text-left">
                        <div>
                            <label htmlFor="name" className="block text-black-200 text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 rounded-md border border-black-300 bg-transparent text-black placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                placeholder="Your full name"
                            />
                        </div>

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
                            {loading ? "Creating Account..." : "Sign Up"}
                        </ButtonComponent>
                    </form>

                    <p className="text-sm text-black-300 mt-5 text-center">
                        Already have an account?
                        <Link to="/sign-in" className="text-black-400 hover:underline ml-1">
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default SignUp;
