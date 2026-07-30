// src/pages/CategoryPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignCard from "../components/DesignCard";
import CategoryList from "../components/CartegoryList";
import SearchComponent from "../components/SearchComponent";
import { apiFetch } from "../api/api";
import FilterBar from "../components/FilterBarComponent";


const formatName = (slug) =>
  slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryProducts = () => {
  const { slug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const data = await apiFetch(`/categories/${slug}/items/`);

        setItems(data.items || []);
      } catch (err) {
        console.error("Failed to fetch category items", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [slug]);

  const handleNavigateToItem = (item) => {
    navigate(`/product/${item.id}/${item.slug}`)
  }

  const formatName = (slug = "") =>
  slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <section className="px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {formatName(slug)}
      </h1>

      <div>
        <div className="">
          <SearchComponent />
          <FilterBar />
        </div>
        <div>
          <CategoryList />

        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products…</p>
      ) : items.length === 0 ? (
        <p className="text-center py-12 text-gray-400">
          No products found in this category...
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] py-5">

          
          {items.map((item) => (
            <DesignCard 
            key={item.id} 
            item={item} 
            onClick={() => handleNavigateToItem(item)}/>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryProducts;