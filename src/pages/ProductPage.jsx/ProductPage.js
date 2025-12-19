import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const api_base = process.env.REACT_APP_API_URL;
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    if (searchQuery) {
      axios
        .get(`${api_base}/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Search error:", err));
    } else {
      // Load all products if no search
      axios
        .get(`${api_base}/products`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Load products error:", err));
    }
  }, [location.search]);

  return (
    <div>
      {products.length > 0 ? (
        products.map((p) => <div key={p._id}>{p.ProductName}</div>)
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductPage;
