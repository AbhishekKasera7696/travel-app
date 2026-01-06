import React, { useState } from "react";
import {useLoaderData, useNavigate} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getTripById } from "~/appwrite/trips";
import { parseTripData } from "../../../lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { tripId } = params;
    if (!tripId) throw new Error("Trip ID is required");

    const trip = await getTripById(tripId);
    const tripData = parseTripData(trip?.tripDetails);

    return { trip, tripData };
};



// --- Component ---
const PaymentPage = () => {
    const navigate = typeof window !== "undefined" ? useNavigate() : null;

    const { trip, tripData } = useLoaderData() as {
        trip: any;
        tripData: any;
    };

    const [formData, setFormData] = useState({
        email: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        nameOnCard: "",
        country: "United States",
        zip: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (typeof window !== "undefined" && navigate) {
            setTimeout(() => {
                navigate(`/travel/${trip?.$id}/success`);
            }, 800);
        }
    };


    const price = tripData?.estimatedPrice ?? "$0.00";
    const image = trip?.imageUrls?.[0];

    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
                {/* LEFT SIDE - Trip Info */}
                <div className="p-10 border-r border-gray-200 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <img
                                src="/assets/icons/google.svg"
                                alt="Logo"
                                className="w-6 h-6"
                            />
                            <h2 className="text-xl font-semibold text-gray-800">MakeMyTour</h2>
                        </div>

                        <h3 className="text-gray-600 mb-2">
                            Pay {tripData?.duration}-Day {tripData?.country} Highlights:{" "}
                            {tripData?.travelStyle}
                        </h3>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{price}</h1>

                        {image && (
                            <img
                                src={image}
                                alt={tripData?.name}
                                className="w-full h-56 object-cover rounded-lg mb-6"
                            />
                        )}

                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {tripData?.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {tripData?.description ?? "Luxury, Diversity, and Harmony"}
                        </p>
                    </div>

                    <footer className="text-sm text-gray-400 mt-8 flex items-center gap-2">
                        <span>Powered by</span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
                        <a href="#" className="hover:underline">
                            Terms
                        </a>
                        <a href="#" className="hover:underline">
                            Privacy
                        </a>
                    </footer>
                </div>

                {/* RIGHT SIDE - Payment Form */}
                <div className="p-10 flex flex-col justify-center">
                    <button
                        type="button"
                        className="bg-black text-white py-3 rounded-md mb-6 flex items-center justify-center gap-2 hover:bg-gray-900 transition"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" alt="Apple Pay" className="h-5" />
                        <span className="text-base font-medium">Pay with Apple Pay</span>
                    </button>

                    <div className="relative flex items-center justify-center my-4">
                        <hr className="w-full border-gray-200" />
                        <span className="absolute bg-white px-3 text-sm text-gray-400">
              Or pay with card
            </span>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Card details
                            </label>
                            <div className="flex mt-1">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="1234 1234 1234 1234"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    className="flex-1 border border-gray-300 rounded-l-md p-2 outline-none"
                                />
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    className="w-20 border-t border-b border-gray-300 p-2 outline-none text-center"
                                />
                                <input
                                    type="text"
                                    name="cvc"
                                    placeholder="CVC"
                                    value={formData.cvc}
                                    onChange={handleChange}
                                    className="w-20 border border-gray-300 rounded-r-md p-2 outline-none text-center"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Name on card
                            </label>
                            <input
                                type="text"
                                name="nameOnCard"
                                value={formData.nameOnCard}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Country or region
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 outline-none"
                            >
                                <option value="United States">United States</option>
                                <option value="India">India</option>
                                <option value="Japan">Japan</option>
                                <option value="Canada">Canada</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">ZIP</label>
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-800 text-white py-3 rounded-md mt-4 hover:bg-gray-900 transition"
                        >
                            Pay {price}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default PaymentPage;
