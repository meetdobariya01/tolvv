import axios from "axios";
import Cookies from "js-cookie";

export const addToCart = async ({
  product,
  navigate,
  apiUrl,
}) => {
  if (!product) return;

  const token = localStorage.getItem("token");

  // 🔐 LOGGED-IN USER
  if (token) {
    try {
      await axios.post(
        `${apiUrl}/add-to-cart`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error.response || error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }

  // 👤 GUEST USER
  else {
    let cart = [];

    try {
      const stored = Cookies.get("guestCart");
      cart = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const existing = cart.find(
      (item) => item.productId === product._id
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        type: "product",
        productId: product._id,
        quantity: 1,
        price: product.ProductPrice,
        name: product.ProductName,
        img: product.Photos,
      });
    }

    Cookies.set("guestCart", JSON.stringify(cart), { expires: 7 });
    navigate("/cart");
  }
};
