/*

* An ACTION CREATOR is a function that literally creates an action object.
    Async functions & side effects can be written in the components as well because redux toolkit automatically creates action creators for us
    In Redux, action creators simply return an action object and pass the argument value if necessary.
BUT, we wanna keep our component clean and tidy. So we are writing it in a separate file

todo: WE ARE GOING TO WRITE AN ACTION CREATOR AS A THUNK
  ! What is a Thunk?
  * Thunk is a function that delays an action until later. 
  * Rather than execute some logic now, we can write a function body or code that can be used to perform the work later.
    Action creators as Thunks can also (in most cases) return other functions as actions

todo: This Thunk is written separately so that redux does the heavy lifting, and it doesn't mind doing it.
todo: Redux toolkit was also made with this purpose in mind.

*/

import { uiActions } from "./uiSlice";
import { cartActions } from "./cartSlice";

export const fetchCartData = (cart) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://react-js-practice-39f83-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json"
      );

      if (!response.ok) {
        throw new Error("Could not fetch data!");
      }

      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Failed to fetch data!",
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Uploading cart data",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://react-js-practice-39f83-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
        {
          // PUT to overwrite existing data
          // Sending data to firebase with PUT will not change the format
          // It will accept it as it is, unlike with POST call

          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Data upload failed!");
      }
    };

    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Data uploaded successfully",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Upload failed!",
        })
      );
    }
  };
};
