import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "./store/uiSlice";
import Notification from "./components/UI/Notification";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";

// this helps us to not
let renderingForTheFirstTime = true;

function App() {
  // useSelector sets up a subscription between component and redux store
  // so the component will know when the state changed and then access it
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  //todo: Always have a fat Reducer (all the synchronous code and data processing must be done in the reducer)
  // * Side effects must be handled after redux processes the data
  useEffect(() => {
    if (renderingForTheFirstTime) {
      renderingForTheFirstTime = false;
      return;
    }
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Uploading cart data",
        })
      );
      const response = await fetch(
        "https://react-js-practice-39f83-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
        {
          // PUT to overwrite existing data
          method: "PUT",
          body: JSON.stringify(cart),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Data upload failed!");
      }
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Data uploaded successfully",
        })
      );
    };

    // async functions return a promise, so we can use catch() on them
    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Upload failed!",
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
