import React, { useState, useEffect } from "react";
import DesignCard from "../components/DesignCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import FilterBarComponent from "../components/FilterBarComponent";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { apiFetch } from "../api/api";

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const navigate = useNavigate();

  useEffect(() => {
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

        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchProducts();
  }, [category]);

  const handleNavigate = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };

  return (
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
        <p className="text-center text-red-500 mt-10">
          {error}
        </p>
      ) : (
            <div className="grid gap-3 lg:space-y-5 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
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
  );
};

export default Products;