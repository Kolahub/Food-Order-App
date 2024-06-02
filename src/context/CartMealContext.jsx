import { createContext, useReducer } from "react";

export const CartMealCxt = createContext({
  cartMeals: [],
  mealsLeftInCart: 0,
  handleAddMealToCart: () => {},
  handleIncreaseMealPortion: () => {},
  handleMealDescreasePortion: () => {},
  fetchCartItems: () => {},
  resetUserCartDataAfterCheckingOut: () => {}
});

function cartItemsReducer(state, action) {
  async function updateCartItems(meals) {
    try {
      const res = await fetch("http://localhost:3000/cart", {
        method: "PUT",
        body: JSON.stringify({ meals: meals }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Couldn't update cart items.");
    } catch (err) {
      console.log(err.message);
    }
  }

  if (action.type === 'FETCH_CART_DATA') {
    return action.payload
  }
  
  if (action.type === 'INCREASE_PORTION') {
      const findMealIndex = state.mealsInCartData.findIndex(
        (el) => el.id === action.payload
      );

      if (findMealIndex !== -1) {
        const updatedMealsInCart = [...state.mealsInCartData];
        updatedMealsInCart[findMealIndex] = {
          ...updatedMealsInCart[findMealIndex],
          quantity: updatedMealsInCart[findMealIndex].quantity + 1,
        };
        const updatedState = {
          ...state,
          mealsInCartData: updatedMealsInCart,
        };
        updateCartItems(updatedState);
        return updatedState;
      }
  }

  if (action.type === 'DECREASE_PORTION') {
      const findMealIndex = state.mealsInCartData.findIndex(
        (el) => el.id === action.payload
      );

      if (findMealIndex !== -1) {
        const updatedMealsInCart = [...state.mealsInCartData];
        if (updatedMealsInCart[findMealIndex].quantity === 1) {
          updatedMealsInCart.splice(findMealIndex, 1);
          const updatedState = {
            ...state,
            mealsInCartData: updatedMealsInCart,
          };
        updateCartItems(updatedState);
          return updatedState;
        }
        updatedMealsInCart[findMealIndex] = {
          ...updatedMealsInCart[findMealIndex],
          quantity: updatedMealsInCart[findMealIndex].quantity - 1,
        };
        const updatedState = {
          ...state,
          mealsInCartData: updatedMealsInCart,
        };
        updateCartItems(updatedState);
        return updatedState;
      }
  }

  if (action.type === 'ADD_MEAL_TO_CART') {
      const findMealIndex = state.mealsInCartData.findIndex(
        (el) => el.id === action.payload.mealId
      );

      if (findMealIndex !== -1) {
        const updatedMealsInCart = [...state.mealsInCartData];
        updatedMealsInCart[findMealIndex] = {
          ...updatedMealsInCart[findMealIndex],
          quantity: updatedMealsInCart[findMealIndex].quantity + 1,
        };
        // Remove the meal from its current position
        const updatedMeal = updatedMealsInCart.splice(findMealIndex, 1)[0];

        // Prepend the updated meal to the array
        updatedMealsInCart.unshift(updatedMeal);

        const updatedState = {
          ...state,
          mealsInCartData: updatedMealsInCart,
        };
        updateCartItems(updatedState);
        return updatedState;
      }
      const updatedState = {
        mealsLeftInCart: state.mealsLeftInCart + 1,
        mealsInCartData: [
          { id: action.payload.mealId, name: action.payload.mealName, quantity: 1, price: action.payload.mealPrice },
          ...state.mealsInCartData,
        ],
      };
      updateCartItems(updatedState);
      return updatedState;
  }

  if(action.type === 'RESET_CART') {
    const updatedState = {mealsLeftInCart: 0, mealsInCartData: []}
    updateCartItems(updatedState)
    return updatedState
  }


  return state
}

export const CartMealCxtProvider = function ({ children }) {
  const [cartMealsState, cartMealsDispatch] = useReducer (cartItemsReducer, {
    mealsLeftInCart: 0,
    mealsInCartData: [],
  })

  async function fetchCartItems() {
    try {
      const res = await fetch("http://localhost:3000/cart");
      if (!res.ok) throw new Error("Couldn't fetch cart items.");
      const data = await res.json();
      if (Object.keys(data.meals).length === 0) return;
      cartMealsDispatch({
        type: 'FETCH_CART_DATA',
        payload: data.meals
      })
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleIncreaseMealPortion (mealId) {
    cartMealsDispatch({
      type: 'INCREASE_PORTION',
      payload: mealId
    })
  }

  function handleMealDescreasePortion(mealId) {
    cartMealsDispatch({
      type: 'DECREASE_PORTION',
      payload: mealId
    })
  }

  function handleAddMealToCart(mealName, mealId, mealPrice) {
    cartMealsDispatch({
      type: 'ADD_MEAL_TO_CART',
      payload: {
        mealName,
        mealId, 
        mealPrice
      }
    })
  }

  function resetUserCartDataAfterCheckingOut () {
    cartMealsDispatch({ 
      type: 'RESET_CART'
    })
  }

  const ctxValue = {
    cartMeals: cartMealsState.mealsInCartData,
    mealsLeftInCart: cartMealsState.mealsLeftInCart,
    handleAddMealToCart: handleAddMealToCart,
    handleIncreaseMealPortion: handleIncreaseMealPortion,
    handleMealDescreasePortion: handleMealDescreasePortion,
    fetchCartItems: fetchCartItems,
    resetUserCartDataAfterCheckingOut: resetUserCartDataAfterCheckingOut
  };

  return (
    <CartMealCxt.Provider value={ctxValue}>{children}</CartMealCxt.Provider>
  );
};
