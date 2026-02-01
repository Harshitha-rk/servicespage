import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./components/supabaseClient";

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
  const [error, setError] = useState(null);

  /* ================= HERO ================= */
  const [heroImages, setHeroImages] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchServices();
    fetchHeroImages();
  }, []);

  async function fetchServices() {
    try {
      const { data, error } = await supabase.from("services").select("*");
      if (error) throw error;
      setServices(data || []);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchHeroImages() {
    const { data, error } = await supabase
      .from("hero_banners")
      .select("image_path")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data) return;

    const urls = data
      .map((row) => {
        const { data: img } = supabase.storage
          .from("hero-images")
          .getPublicUrl(row.image_path);
        return img?.publicUrl;
      })
      .filter(Boolean);

    setHeroImages(urls);
  }

  /* ================= HERO RESET ================= */
  useEffect(() => {
    if (heroImages.length > 0) {
      setCurrentHero(0);
    }
  }, [heroImages]);

  /* ================= HERO AUTO SLIDE ================= */
  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages]);

  /* ================= CATEGORY TABS ================= */
  const tabs = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(
        services
          .map((s) => s.service_type || s.category)
          .filter(Boolean)
      )
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

  /* ================= FILTER SERVICES ================= */
  let filteredServices =
    activeCategory === "ALL"
      ? services
      : services.filter(
          (s) => (s.service_type || s.category) === activeCategory
        );

  filteredServices = filteredServices.filter((s) =>
    s.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  /* ================= GROUP BY CATEGORY (ADDED) ================= */
  const groupedServices = filteredServices.reduce((acc, service) => {
    const category = service.service_type || service.category || "Other";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(service);
    return acc;
  }, {});

  return (
    <div className="page">
      <Header searchText={searchText} setSearchText={setSearchText} />

      {/* ================= HERO ================= */}
      {heroImages.length > 0 && (
        <div
          className="hero"
          style={{
            height: "420px",
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
              url(${heroImages[currentHero]})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          <div className="hero-dots">
            {heroImages.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentHero ? "active" : ""}`}
                onClick={() => setCurrentHero(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= SERVICES ================= */}
      <div id="services-section">
        <CategoryTabs
          activeTab={activeCategory}
          onChange={setActiveCategory}
          tabs={tabs}
        />

        {loading ? (
          <div className="loader">Loading services...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredServices.length === 0 ? (
          <div className="no-services">No services found.</div>
        ) : (
          <>
            {Object.entries(groupedServices).map(([category, items]) => (
              <section key={category} className="service-category">
                <h2 className="category-title">
                  {category
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </h2>

                <div className="services-grid">
                  {items.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onView={() =>
                        navigate(`/service/${service.id}`, {
                          state: { service, allServices: services },
                        })
                      }
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
