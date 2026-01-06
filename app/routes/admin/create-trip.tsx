import { Header } from "../../../components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import {
    LayerDirective,
    LayersDirective,
    MapsComponent,
} from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";
import { cn, formatKey } from "../../../lib/utils";

// ✅ Loader — only returns plain data (no JSX)
export const loader = async () => {
    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population,latlng,maps"
    );
    const data = await response.json();

    return data.map((country: any) => ({
        name: country.name.common,
        flag: country.flags.svg, // ✅ SVG image for flag
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMap,
    }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
    const countries = loaderData as Country[];
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: 0,
        groupType: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (
            !formData.country ||
            !formData.travelStyle ||
            !formData.interest ||
            !formData.budget ||
            !formData.groupType
        ) {
            setError("Please provide values for all fields");
            setLoading(false);
            return;
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError("Duration must be between 1 and 10 days");
            setLoading(false);
            return;
        }

        const user = await account.get();
        if (!user.$id) {
            console.error("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/create-trip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interests: formData.interest,
                    budget: formData.budget,
                    groupType: formData.groupType,
                    userId: user.$id,
                }),
            });

            if (!response.ok) {
                let errBody: any = null;
                try {
                    errBody = await response.json();
                } catch {
                    errBody = { message: await response.text() };
                }
                setError(errBody?.message || `Server error: ${response.status}`);
                setLoading(false);
                return;
            }

            const result: CreateTripResponse = await response
                .json()
                .catch(() => ({ id: null }));
            if (result?.id) navigate(`/trips/${result.id}`);
            else setError("Failed to generate trip. Try again.");
        } catch (e) {
            console.error("Network error generating trip", e);
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData({ ...formData, [key]: value });
    };

    // ✅ Data for ComboBox (keep same but use country list directly)
    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
        flag: country.flag,
    }));

    // ✅ Map Data
    const mapData = [
        {
            country: formData.country,
            color: "#EA382E",
            coordinates:
                countries.find((c: Country) => c.name === formData.country)
                    ?.coordinates || [],
        },
    ];

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header
                title="Add a New Trip"
                description="View and edit AI Generated travel plans"
            />

            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    {/* COUNTRY FIELD */}
                    <div>
                        <label htmlFor="country">Country</label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{ text: "text", value: "value" }}
                            placeholder="Select a Country"
                            className="combo-box"
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    handleChange("country", e.value);
                                }
                            }}
                            // ✅ Show flag + name horizontally in dropdown
                            itemTemplate={(data: any) => (
                                <div className="flex items-center gap-2">
                                    <img
                                        src={data.flag}
                                        alt={data.text}
                                        className="w-6 h-4 object-cover rounded-sm border border-gray-200"
                                    />
                                    <span className="text-sm text-gray-800">{data.text}</span>
                                </div>
                            )}
                            // ✅ Show flag + name horizontally in selected value
                            valueTemplate={(data: any) => (
                                <div className="flex flex-row gap-2">
                                    <img
                                        src={data.flag}
                                        alt={data.text}
                                        className="w-6 h-4 object-cover rounded-sm border border-gray-200"
                                    />
                                    <span className="text-sm text-gray-800">{data.text}</span>
                                </div>
                            )}
                            popupHeight="300px"
                            allowFiltering
                            filtering={(e) => {
                                const query = e.text.toLowerCase();
                                e.updateData(
                                    countries
                                        .filter((country) =>
                                            country.name.toLowerCase().includes(query)
                                        )
                                        .map((country) => ({
                                            text: country.name,
                                            value: country.value,
                                            flag: country.flag,
                                        }))
                                );
                            }}
                        />

                    </div>

                    {/* DURATION FIELD */}
                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="Enter a number of days"
                            className="form-input placeholder:text-gray-100"
                            onChange={(e) =>
                                handleChange("duration", Number(e.target.value))
                            }
                        />
                    </div>

                    {/* OTHER SELECT FIELDS */}
                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>
                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{ text: "text", value: "value" }}
                                placeholder={`Select ${formatKey(key)}`}
                                change={(e: { value: string | undefined }) => {
                                    if (e.value) {
                                        handleChange(key, e.value);
                                    }
                                }}
                                allowFiltering
                                filtering={(e) => {
                                    const query = e.text.toLowerCase();
                                    e.updateData(
                                        comboBoxItems[key]
                                            .filter((item) => item.toLowerCase().includes(query))
                                            .map((item) => ({
                                                text: item,
                                                value: item,
                                            }))
                                    );
                                }}
                                className="combo-box"
                            />
                        </div>
                    ))}

                    {/* MAP FIELD */}
                    <div>
                        <label htmlFor="location">Location on the world map</label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{
                                        colorValuePath: "color",
                                        fill: "#E5E5E5",
                                    }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full" />

                    {/* ERROR */}
                    {error && (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <footer className="px-6 w-full">
                        <ButtonComponent
                            type="submit"
                            className="button-class !h-12 !w-full"
                            disabled={loading}
                        >
                            <img
                                src={`/assets/icons/${
                                    loading ? "loader.svg" : "magic-star.svg"
                                }`}
                                className={cn("size-5", { "animate-spin": loading })}
                            />
                            <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    );
};

export default CreateTrip;
