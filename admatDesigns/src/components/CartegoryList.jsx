import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { getCategories } from "../api/categoryApi";
import placeHolder from "../assets/placeHolder.png";

const formatName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryList = ({ basePath= "/products" }) => {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await getCategories(controller.signal);
        setCategories(data || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  const getCategoryUrl = (slug) => {
    const params = new URLSearchParams(searchParams);

    if (activeCategory === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    return `${basePath}?${params.toString()}`;
  };
  return (
    <section className="">
      <h2 className="text-lg font-semibold mb-3">Shop by Category</h2>

      <div className="flex gap-3 overflow-x-auto rounded py-1 px-2 bg-orange-50 items-center w-full max-w-full">
        {categories.map((cat) => (
          <NavLink
            key={cat.id}
            title={formatName(cat.name)}
            aria-label={formatName(cat.name)}
            to={getCategoryUrl(cat.slug)}
            className={() =>
              `flex shrink-0  border border-gray-200 items-center gap-1 py-1 rounded text-sm truncate transition ${
                activeCategory === cat.slug
                  ? "bg-orange-600 text-white"
                  : "bg-orange-100 hover:bg-orange-600 hover:text-white"
              }`
            }
          >            
            <img
              src={cat.imageUrl || placeHolder}
              onError={(e) => (e.currentTarget.src = placeHolder)}
              className="w-8 h-8 object-contain bg-transparent p-1 rounded"
              alt={cat.name}
            />
            {formatName(cat.name)}
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;