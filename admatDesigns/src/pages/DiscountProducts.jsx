import React, { useEffect, useState } from "react";
import DesignCard from "../components/DesignCard";
import FilterBarComponent from "../components/FilterBarComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import { apiFetch } from "../api/api";


const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DiscountProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category")

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
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      }
    };

    fetchData();
  }, [category]);  
  
const handleNavigate = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-gray-500">Loading discount items...</p>
      </div>
    );
  }

  return (
    <div className="px-5 text-sm">
      <h1 className="text-2xl lg:text-4xl text-center font-bold">
        Discount products 
      </h1>


      <div className="w-full">
        <div className="">
          <SearchComponent/>
          <FilterBarComponent />
        </div>
        <div>
          <CategoryList basePath="/products/discounts/"/>
        </div>
      </div>

      {!loading && items.length === 0 && (
        <div className="flex justify-center py-10">
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-4 text-center text-gray-500">
            No discounted products available.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
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