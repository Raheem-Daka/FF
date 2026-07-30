import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import DesignCard from "../components/DesignCard";
import { apiFetch } from "../api/api";
import { Helmet } from "react-helmet-async";

const PopularProducts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const data = await apiFetch("/products/popular_products/");

        console.log("Popular data:", data);

        setItems(data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const handleNavigate = (id, slug) => {
    navigate(`/product/${id}/${slug}`);
  };


  return (
    <>
      <Helmet>
        <title>
          Popular Furniture Products | Footer Furniture
        </title>

        <meta
          name="description"
          content="Explore our most popular furniture, including sofas, beds, dining tables, wardrobes and office furniture."
        />

        <meta
          name="keywords"
          content="popular furniture, sofas, beds, dining tables, wardrobes, office furniture, Malawi furniture"
        />

        <meta
          property="og:title"
          content="Popular Furniture Products | Footer Furniture"
        />

        <meta
          property="og:description"
          content="Discover our best-selling furniture collections and customer favorites."
        />

        <meta
          property="og:type"
          content="website"
        />

        https://footerfurniture.com/popular-products
      </Helmet>

      <div className="px-4 md:px-8">

        <h1 className="text-3xl font-bold text-center pt-10">
          Our most popular furniture
        </h1>

        <div className="sticky top-0 z-10 bg-white py-2 w-full">

          {/*Search Panel */}
          <div className="">
            <SearchComponent />
          </div>

          <div>
            <CategoryList />
          </div>
        </div>
        {loading ? (
          <p className="text-center mt-10 animate-pulse text-gray-500">
            Loading...
          </p>
        ) : (

          // ✅ GRID OUTSIDE
          <div className="
            grid
            grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7
            gap-4 mt-10 
          ">

            {items.map((item) => {
              const price = Number(item.price);
              const currentPrice = Number(item.current_price);

              const discountPercent =
                price > currentPrice
                  ? Math.round(((price - currentPrice) / price) * 100)
                  : null;

              return (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item.id, item.slug)}
                  className="
                    border border-zinc-200 hover:border-zinc-300
                    transition rounded-xl p-2 cursor-pointer bg-white sm:w-42 md:w-44 lg:w-48
                  "
                >

                  {/* Image */}
                  <div className="relative h-32 mb-1">

                    {discountPercent !== null && (
                      <span className="absolute top-2 left-2 flex text-xs shadow">
                        <span className="bg-white text-red-500 px-1 py-1 rounded-l line-through">
                          MWK {item.price}
                        </span>
                        <span className="bg-red-600 flex items-center text-white px-1 rounded-r">
                          {discountPercent}% OFF
                        </span>
                      </span>
                    )}

                    <img
                      src={item.imageUrl}
                      alt={`${item.name} - ${item.category_name} | Footer Furniture`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-2 space-y-1">
                    <p className="text-md font-semibold truncate">
                      {item.name}
                    </p>

                    <div className="flex gap-2 text-sm">
                      {currentPrice < price ? (
                        <>
                          <span className="text-green-600 font-bold">
                            MWK {item.current_price}
                          </span>
                        </>
                      ) : (
                        <span>MWK {item.price}</span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {item.description}
                    </p>

                    <p className="text-xs text-indigo-500">
                      {item.category_name}
                    </p>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <p className="text-center col-span-full text-gray-500">
                No popular products found.
              </p>
            )}

          </div>
        )}
      </div>
    </>
  );
};

export default PopularProducts;