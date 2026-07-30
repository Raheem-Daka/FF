import React, { useState, useEffect } from "react";
import DesignCard from "../components/DesignCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import FilterBarComponent from "../components/FilterBarComponent";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { apiFetch } from "../api/api";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    const start = Date.now();

    const fetchProducts = async () => {
      try {
        let url = "/products/";

        if (category) {
          url += `?category=${category}`;
        }

        console.log("Request URL:", url);

        const data = await apiFetch(url);
        console.log("Products returned:", data);

        const delay = Math.max(500 - (Date.now() - start), 0); // ✅ shorter

        setTimeout(() => {
          setItems(data.results || []);
          setLoading(false);
        }, delay);

      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to load products");

      } finally {
          setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleNavigate = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };
  

  return (
    <>
      <Helmet>
        <title>
          {category
            ? `${category} Furniture | Footer Furniture`
            : "All Furniture Products | Footer Furniture"}
        </title>

        <meta
          name="description"
          content="Browse quality sofas, beds, wardrobes, office furniture, dining tables and custom furniture from Footer Furniture."
        />
      </Helmet>

      <div className="px-5 ">
        <h1 className="text-2xl lg:text-4xl text-center font-bold">
          All Products
        </h1>

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white py-2 w-full">
            <SearchComponent />
            <FilterBarComponent />
          <div className="overflow-x-scroll">
            <CategoryList basePath="/products"/>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="flex justify-center py-10">
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-4 text-center text-gray-500">
              {error}
            </p>
          </div>
        ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 mt-5 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-1 md:gap-2 lg:gap-3 lg:max-w-7xl max-w-8xl mx-auto">
            {items.map(item => (
              <DesignCard
                key={item.id}
                item={item}
                onClick={handleNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;