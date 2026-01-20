import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

import Header from "./components/Header";
import CategoryTabs from "./components/CategoryTabs";
import ServiceCard from "./components/ServiceCard";
import "./Services.css";

export default function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data } = await supabase.from("services").select("*");
    setServices(data || []);
    setLoading(false);
  }

  let filteredServices =
    activeCategory === "ALL"
      ? services
      : services.filter((s) => s.category === activeCategory);

  filteredServices = filteredServices.filter((s) =>
    s.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="page">
      <Header
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <CategoryTabs
        activeTab={activeCategory}
        onChange={setActiveCategory}
      />

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="services-grid">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() =>
                navigate("/service-detail", { state: { service } })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
