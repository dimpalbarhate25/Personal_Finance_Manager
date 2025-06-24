// src/components/categories/CategoriesList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CategoriesList({ refreshKey }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5002/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [refreshKey]);

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {categories.map((category) => {
        const Icon = iconOptions[category.icon]; // ✅ use correct variable
        return (
          <div
            key={category._id}
            className="flex items-center gap-3 p-3 bg-gray-100 rounded shadow-sm"
          >
            <div
              className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center`}
            >
              {Icon && <Icon size={18} className="text-white" />}
            </div>
            <span>{category.name}</span>
          </div>
        );
      })}
    </div>
  );
}
