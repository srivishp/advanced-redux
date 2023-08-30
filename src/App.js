import { useEffect } from "react";
import { useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";

function App() {
  // useSelector sets up a subscription between component and redux store
  // so the component will know when the state changed and then access it
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);

  //todo: Always have a fat Reducer (all the synchronous code and data processing must be done in the reducer)
  // * Side effects must be handled after redux processes the data
  useEffect(() => {
    fetch(
      "https://react-js-practice-39f83-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
      {
        // PUT to overwrite existing data
        method: "PUT",
        body: JSON.stringify(cart),
        headers: { "Content-Type": "application/json" },
      }
    );
  }, [cart]);

  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
