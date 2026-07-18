import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartNo, setCartNo] = useState(0);
  const [cartTotal,setCartTotal]=useState(0)
  const [cartarray,setcartarray] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  useEffect(() => {
    async function getuser() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/auth/getuser`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("auth-token"),
            },
          }
        );

        if (!res.ok) {
          localStorage.removeItem("auth-token");
          setUserEmail(false);
          loadGuestCart();
          return;
        }

        const data = await res.json();
        if (data.success && data.data) {
          setCartNo(data.data.cart ? data.data.cart.length : 0);
          setUserEmail(data.data.email);
        } else {
          localStorage.removeItem("auth-token");
          setUserEmail(false);
          loadGuestCart();
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("auth-token");
        setUserEmail(false);
        loadGuestCart();
      }
    }

    function loadGuestCart() {
      try {
        const localCart = JSON.parse(localStorage.getItem("guest-cart")) || [];
        setcartarray(localCart);
        setCartNo(localCart.length);
      } catch (error) {
        console.log("Error loading guest cart: ", error);
        setcartarray([]);
        setCartNo(0);
      }
    }

    if (localStorage.getItem("auth-token")) {
      getuser();
    } else {
      setUserEmail(false);
      loadGuestCart();
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartNo, setCartNo, cartarray, setcartarray, cartTotal, setCartTotal, userEmail, setUserEmail }}>
      {children}
    </CartContext.Provider>
  );
}