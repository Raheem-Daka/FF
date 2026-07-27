import React, { useEffect, useState } from "react";
import DesignCard from "../components/DesignCard";
import FilterBarComponent from "../components/FilterBarComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import { apiFetch } from "../api/api";
import LoadingSkeleton from "../components/LoadingSkeleton";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

      } catch (err) {
        console.error("Error fetching discount products:", err);
        setError("Failed to load discount products")

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
    <div className="px-5 text-sm">
      <h1 className="text-2xl lg:text-4xl text-center font-bold">
        Discount products 
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
        <div className="grid sm:grid-cols-2 gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
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
  );
};

export default DiscountProducts;