import React, { useEffect, useMemo, useState } from "react";
import CategoryTabs from "../components/CategoryTabs";
import { supabase } from "./supabaseClient";

export default function Home() {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("services").select(`
      id,
      title,
      service_type,
      duration,
      price
    `);

    if (error) {
      console.error(error);
    } else {
      setServices(data || []);
    }

    setLoading(false);
  };

  /* ✅ Tabs dynamically from service_type (same as RN) */
  const tabs = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(services.map((s) => s.service_type).filter(Boolean))
    );

    return [
      { label: "All Services", value: "ALL" },
      ...uniqueTypes.map((type) => ({
        label: type
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        value: type,
      })),
    ];
  }, [services]);

  /* ✅ Filter logic (same as RN) */
  const filteredServices = services.filter((service) => {
    const search = searchText.trim().toLowerCase();

    const matchesSearch =
      search.length === 0 ||
      service.title?.toLowerCase().includes(search) ||
      service.service_type?.toLowerCase().includes(search);

    const matchesCategory =
      activeCategory === "ALL" ||
      service.service_type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <input
        placeholder="Search services"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setActiveCategory("ALL");
        }}
      />

      <CategoryTabs
        activeTab={activeCategory}
        onChange={setActiveCategory}
        tabs={tabs}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredServices.length === 0 ? (
        <p>No services found</p>
      ) : (
        filteredServices.map((s) => (
          <div key={s.id}>
            <h4>{s.title}</h4>
            <p>{s.duration}</p>
            <p>₹{s.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
