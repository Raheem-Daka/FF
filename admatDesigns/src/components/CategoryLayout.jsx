import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeHolder from "../assets/placeHolder.png"
import { apiFetch } from '../api/api';

const formatName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CategoryLayout = () => {
  
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch("/categories/");
        setCategories(data.results || data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);
  
  const handleNavigateToCategory = (cat) => {
    navigate(`/category/${cat.slug}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Look up the furniture you want by category
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        A visual collection of our most recent works - each piece crafted with intention, emotion, and style.
      </p>
      <div className="sm:px-5 px-2 flex gap-2 lg:h-[400px] h-[240px] sm:h-[280px] md:h-[320px] w-full max-w-6xl mt-10 mx-auto overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat) => (
          <div
          key={cat.id}
          onClick={() => handleNavigateToCategory(cat)} 
          className="snap-start flex-shrink-0 relative group transition-all duration-500 cursor-pointer w-[250px] sm:w-[260px] md:w-[280px] lg:w-48 lg:hover:w-96 xl:w-52 xl:hover:w-[420px] h-full rounded-lg overflow-hidden">
            <img
              src={cat.imageUrl || placeHolder}
              alt={cat.name}
              className="h-full w-full object-cover object-center"

            />
            
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition">
              <p className="text-white text-xl font-bold">
              {formatName(cat.name)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryLayout;
