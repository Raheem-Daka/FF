import React, { useEffect, useState } from "react";
import DesignCard from "../components/DesignCard";
import FilterBarComponent from "../components/FilterBarComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import { apiFetch } from "../api/api";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { Helmet } from "react-helmet-async";

const formatName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const DiscountProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [ error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        let url = "/products/?has_discount=true";

        if (category) {
          url += `&category=${category}`;
        }

        const data = await apiFetch(url);

        console.log("Discount data:", data);

        setItems(data.results ? data.results : data.items || []);

        const results = data.results || data.items || [];

        setItems(results);
        setError(results.length === 0 ? "No discounted products available" : null);

      } catch (err) {
        console.error("Error fetching discount products:", err);

      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, [category]);  
  
  const handleNavigate = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };

  return (
    <>
      <Helmet>
        <title>
          {category
            ? `${formatName(category)} Discount Furniture | Footer Furniture`
            : "Discount Furniture Products | Footer Furniture"}
        </title>

        <meta
          name="description"
          content={
            category
              ? `Browse discounted ${formatName(category)} furniture at Footer Furniture. Save on quality furniture for your home and office.`
              : "Discover discounted sofas, beds, wardrobes, dining tables and office furniture at Footer Furniture."
          }
        />

        <meta
          property="og:title"
          content={
            category
              ? `${formatName(category)} Discount Furniture | Footer Furniture`
              : "Discount Furniture Products | Footer Furniture"
          }
        />

        <meta
          property="og:description"
          content="Shop furniture deals and special offers from Footer Furniture."
        />

        <meta
          property="og:type"
          content="website"
        />

      </Helmet>


      <div className="px-5 text-sm">
        <h1 className="text-2xl lg:text-4xl text-center font-bold">
          {category
            ? `${formatName(category)} Discounted Products`
            : "Discount Products"}
        </h1>


        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white py-2 w-full">
            <SearchComponent />
            <FilterBarComponent />
          <div className="overflow-x-scroll">
            <CategoryList basePath="/products/discounts/"/>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="flex justify-center py-10">
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-4 text-center text-gray-500">
              {error}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 mt-5 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-1 md:gap-2 lg:gap-3 lg:max-w-7xl mx-auto">
            {items.map((item) => (
              <DesignCard
                key={item.id}
                item={item}
                onClick={() => handleNavigate(item.id, item.slug)}
              />
            ))}
          </div>
        )}
      
      </div>
    </>
  );
};

export default DiscountProducts;