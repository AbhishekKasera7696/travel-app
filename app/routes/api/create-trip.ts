//
// import {type ActionFunctionArgs, data} from "react-router";
// import {GoogleGenerativeAI} from "@google/generative-ai";
// import {parseMarkdownToJson, parseTripData} from "../../../lib/utils";
// import {appwriteConfig, database} from "~/appwrite/client";
// import {ID} from "appwrite";
// // import {createProduct} from "~/lib/stripe";
//
// export const action = async ({ request }: ActionFunctionArgs) => {
//     const {
//         country,
//         numberOfDays,
//         travelStyle,
//         interests,
//         budget,
//         groupType,
//         userId,
//     } = await request.json();
//
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
//     const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;
//
//     try {
//         const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
//         Budget: '${budget}'
//         Interests: '${interests}'
//         TravelStyle: '${travelStyle}'
//         GroupType: '${groupType}'
//         Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
//         {
//         "name": "A descriptive title for the trip",
//         "description": "A brief description of the trip and its highlights not exceeding 100 words",
//         "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
//         "duration": ${numberOfDays},
//         "budget": "${budget}",
//         "travelStyle": "${travelStyle}",
//         "country": "${country}",
//         "interests": ${interests},
//         "groupType": "${groupType}",
//         "bestTimeToVisit": [
//           '🌸 Season (from month to month): reason to visit',
//           '☀️ Season (from month to month): reason to visit',
//           '🍁 Season (from month to month): reason to visit',
//           '❄️ Season (from month to month): reason to visit'
//         ],
//         "weatherInfo": [
//           '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
//           '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
//           '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
//           '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
//         ],
//         "location": {
//           "city": "name of the city or region",
//           "coordinates": [latitude, longitude],
//           "openStreetMap": "link to open street map"
//         },
//         "itinerary": [
//         {
//           "day": 1,
//           "location": "City/Region Name",
//           "activities": [
//             {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
//             {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
//             {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
//           ]
//         },
//         ...
//         ]
//     }`;
//
//         const textResult = await genAI
//             .getGenerativeModel({ model: 'gemini-2.0-flash' })
//             .generateContent([prompt])
//
//         const trip = parseMarkdownToJson(textResult.response.text());
//
//         const imageResponse = await fetch(
//             `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
//         );
//
//         const imageUrls = (await imageResponse.json()).results.slice(0, 3)
//             .map((result: any) => result.urls?.regular || null);
//
//         const result = await database.createDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.tripTableId,
//             ID.unique(),
//             {
//                 tripDetails: JSON.stringify(trip),
//                 createdAt: new Date().toISOString(),
//                 imageUrls,
//                 userId,
//             }
//         )
//
//         // const tripDetail = parseTripData(result.tripDetails) as Trip;
//         // const tripPrice = parseInt(tripDetail.estimatedPrice.replace('$', ''), 10)
//         // const paymentLink = await createProduct(
//         //     tripDetail.name,
//         //     tripDetail.description,
//         //     imageUrls,
//         //     tripPrice,
//         //     result.$id
//         // )
//         //
//         // await database.updateDocument(
//         //     appwriteConfig.databaseId,
//         //     appwriteConfig.tripTableId,
//         //     result.$id,
//         //     {
//         //         payment_link: paymentLink.url
//         //     }
//         // )
//
//         return data({ id: result.$id })
//     } catch (e) {
//         console.error('Error generating travel plan: ', e);
//     }
// }




import { type ActionFunctionArgs } from "react-router";
import { OpenRouter } from "@openrouter/sdk";
import {parseMarkdownToJson, parseTripData} from "../../../lib/utils";
import { appwriteConfig, database } from "~/appwrite/client";
import { ID } from "appwrite";
import {createProduct} from "../../../lib/stripe";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        country,
        numberOfDays,
        travelStyle,
        interests,
        budget,
        groupType,
        userId,
    } = await request.json();

    const OPENROUTER_API_KEY = process.env.GEMINI_API_KEY; // your key (or rename env var)
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    if (!OPENROUTER_API_KEY) {
        console.error("OpenRouter API key missing (env GEMINI_API_KEY)");
        return new Response(
            JSON.stringify({ error: "missing_api_key", message: "OpenRouter API key missing" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    // init OpenRouter SDK
    const openRouter = new OpenRouter({ apiKey: OPENROUTER_API_KEY });

    // Prompt: strongly request JSON-only output
    const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
//         Budget: '${budget}'
//         Interests: '${interests}'
//         TravelStyle: '${travelStyle}'
//         GroupType: '${groupType}'
//         Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
//         {
//         "name": "A descriptive title for the trip",
//         "description": "A brief description of the trip and its highlights not exceeding 100 words",
//         "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
//         "duration": ${numberOfDays},
//         "budget": "${budget}",
//         "travelStyle": "${travelStyle}",
//         "country": "${country}",
//         "interests": ${interests},
//         "groupType": "${groupType}",
//         "bestTimeToVisit": [
//           '🌸 Season (from month to month): reason to visit',
//           '☀️ Season (from month to month): reason to visit',
//           '🍁 Season (from month to month): reason to visit',
//           '❄️ Season (from month to month): reason to visit'
//         ],
//         "weatherInfo": [
//           '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
//           '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
//           '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
//           '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
//         ],
//         "location": {
//           "city": "name of the city or region",
//           "coordinates": [latitude, longitude],
//           "openStreetMap": "link to open street map"
//         },
//         "itinerary": [
//         {
//           "day": 1,
//           "location": "City/Region Name",
//           "activities": [
//             {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
//             {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
//             {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
//           ]
//         },
//         ...
//         ]
//     }`;
    let trip: any = null;

    try {
        const completion = await openRouter.chat.send({
            model: "deepseek/deepseek-r1:free",
            messages: [{ role: "user", content: prompt }],
            stream: false,
            // optional: limit tokens so responses don't get huge
            max_tokens: 800,
        });

        const content =
            completion?.choices?.[0]?.message?.content ??
            completion?.choices?.[0]?.message ??
            completion?.choices?.[0]?.text ??
            (typeof completion === "string" ? completion : null);

        const text = typeof content === "string" ? content : JSON.stringify(content);

        // Try parser first (if you prefer parseMarkdownToJson)
        try {
            // If your helper expects markdown -> json, attempt it, otherwise try JSON.parse
            if (typeof parseMarkdownToJson === "function") {
                try {
                    trip = parseMarkdownToJson(text);
                } catch {
                    trip = JSON.parse(text);
                }
            } else {
                trip = JSON.parse(text);
            }
        } catch (parseErr) {
            // fallback: extract first {...} block and parse
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    trip = JSON.parse(match[0]);
                } catch (innerErr) {
                    console.error("Failed to parse JSON from OpenRouter output:", innerErr);
                    throw new Error("Model output not parseable as JSON");
                }
            } else {
                console.error("No JSON found in OpenRouter output:", text.slice(0, 1000));
                throw new Error("Model output not parseable as JSON");
            }
        }
    } catch (err: any) {
        // If OpenRouter fails (rate limit, network, etc.), fallback to a mock itinerary so app remains usable.
        console.warn("OpenRouter failed or returned unparsable output — using local fallback. Error:", err?.message ?? err);
        trip = {
            name: `Trip to ${country}`,
            description: `A ${numberOfDays}-day ${travelStyle} trip to ${country}.`,
            estimatedPrice: "$999",
            duration: Number(numberOfDays || 1),
            budget,
            travelStyle,
            country,
            interests,
            groupType,
            bestTimeToVisit: ["☀️ Summer: great for sightseeing", "🍁 Autumn: fewer crowds"],
            weatherInfo: ["☀️ Summer: 20–30°C", "❄️ Winter: 5–15°C"],
            location: { city: country, coordinates: [0, 0], openStreetMap: "" },
            itinerary: Array.from({ length: Math.max(1, Number(numberOfDays || 1)) }, (_, i) => ({
                day: i + 1,
                location: country,
                activities: [
                    { time: "Morning", description: "Explore main attractions" },
                    { time: "Afternoon", description: "Local food & culture" },
                    { time: "Evening", description: "Relax at top-rated restaurant" },
                ],
            })),
        };
    }

    // Unsplash images (guard network issues)
    let imageUrls: string[] = [];
    try {
        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(country + " " + interests + " " + travelStyle)}&client_id=${encodeURIComponent(unsplashApiKey)}`
        );
        const imageJson = await imageResponse.json();
        imageUrls = (imageJson.results || []).slice(0, 3).map((r: any) => r.urls?.regular || null).filter(Boolean);
    } catch (imgErr) {
        console.warn("Unsplash lookup failed:", imgErr);
    }

    // Save to Appwrite
    try {
        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripTableId,
            ID.unique(),
            {
                tripDetails: JSON.stringify(trip),
                createdAt: new Date().toISOString(),
                imageUrls,
                userId,
            }
        );

        const tripDetail = parseTripData(result.tripDetails) as Trip;
        const tripPrice = parseInt(tripDetail.estimatedPrice.replace('$', ''), 10)
        const paymentLink = await createProduct(
            tripDetail.name,
            tripDetail.description,
            imageUrls,
            tripPrice,
            result.$id
        )

        await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripTableId,
            result.$id,
            {
                payment_link: paymentLink.url
            }
        )


        return new Response(JSON.stringify({ id: result.$id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (dbErr: any) {
        console.error("Error saving trip to Appwrite:", dbErr);
        return new Response(JSON.stringify({ error: "db_error", message: String(dbErr?.message ?? dbErr) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};



























