import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./uiSlice";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      //checking if new item is already in the array
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        // direct manipulation code is only allowed with redux toolkit
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

/*

* An ACTION CREATOR is a function that literally creates an action object.
    Async functions & side effects can be written in the components as well because redux toolkit automatically creates action creators for us
    In Redux, action creators simply return an action object and pass the argument value if necessary.
BUT, we wanna keep our component clean and tidy. So we are writing it in the slice file

todo: WE ARE GOING TO WRITE AN ACTION CREATOR AS A THUNK
  ! What is a Thunk?
  * Thunk is a function that delays an action until later. 
  * Rather than execute some logic now, we can write a function body or code that can be used to perform the work later.
    Action creators as Thunks can also (in most cases) return other functions as actions

todo: This Thunk is written in the slice file so redux does the heavy lifting, and it doesn't mind doing it.
todo: Redux toolkit was also made with this purpose in mind.

*/

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
          method: "PUT",
          body: JSON.stringify(cart),
          headers: { "Content-Type": "application/json" },
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

export const cartActions = cartSlice.actions;

export default cartSlice;
