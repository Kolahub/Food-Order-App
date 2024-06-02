import { createContext, useState, useEffect } from "react";

export const CartMealCxt = createContext({
  cartMeals: [],
  mealsLeftInCart: 0,
  handleAddMealToCart: () => {},
  handleIncreaseMealPortion: () => {},
  handleMealDescreasePortion: () => {},
  fetchCartItems: () => {},
  resetUserCartDataAfterCheckingOut: () => {}
});

export const CartMealCxtProvider = function ({ children }) {
  const [cartItems, setCartItems] = useState({
    mealsLeftInCart: 0,
    mealsInCartData: [],
  });

  async function fetchCartItems() {
    try {
      const res = await fetch("http://localhost:3000/cart");
      if (!res.ok) throw new Error("Couldn't fetch cart items.");
      const data = await res.json();
      if (Object.keys(data.meals).length === 0) return;
      setCartItems(data.meals); // No need for spread operator here
    } catch (err) {
      console.log(err.message);
    }
  }

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

  function handleIncreaseMealPortion (mealId) {
    setCartItems((prevState) => {
        const findMealIndex = prevState.mealsInCartData.findIndex(
          (el) => el.id === mealId
        );

        if (findMealIndex !== -1) {
          const updatedMealsInCart = [...prevState.mealsInCartData];
          updatedMealsInCart[findMealIndex] = {
            ...updatedMealsInCart[findMealIndex],
            quantity: updatedMealsInCart[findMealIndex].quantity + 1,
          };
          const updatedState = {
            ...prevState,
            mealsInCartData: updatedMealsInCart,
          };
          updateCartItems(updatedState);
          return updatedState;
        }
      });
  }

  function handleMealDescreasePortion(mealId) {
    setCartItems((prevState) => {
      const findMealIndex = prevState.mealsInCartData.findIndex(
        (el) => el.id === mealId
      );

      if (findMealIndex !== -1) {
        const updatedMealsInCart = [...prevState.mealsInCartData];
        if (updatedMealsInCart[findMealIndex].quantity === 1) {
          updatedMealsInCart.splice(findMealIndex, 1);
          const updatedState = {
            ...prevState,
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
          ...prevState,
          mealsInCartData: updatedMealsInCart,
        };
        updateCartItems(updatedState);
        return updatedState;
      }
    });
  }

  function handleAddMealToCart(mealName, mealId, mealPrice) {
    setCartItems((prevItemsState) => {
      const findMealIndex = prevItemsState.mealsInCartData.findIndex(
        (el) => el.id === mealId
      );

      if (findMealIndex !== -1) {
        const updatedMealsInCart = [...prevItemsState.mealsInCartData];
        updatedMealsInCart[findMealIndex] = {
          ...updatedMealsInCart[findMealIndex],
          quantity: updatedMealsInCart[findMealIndex].quantity + 1,
        };
        // Remove the meal from its current position
        const updatedMeal = updatedMealsInCart.splice(findMealIndex, 1)[0];

        // Prepend the updated meal to the array
        updatedMealsInCart.unshift(updatedMeal);

        const updatedState = {
          ...prevItemsState,
          mealsInCartData: updatedMealsInCart,
        };
        updateCartItems(updatedState);
        return updatedState;
      }
      const updatedState = {
        mealsLeftInCart: prevItemsState.mealsLeftInCart + 1,
        mealsInCartData: [
          { id: mealId, name: mealName, quantity: 1, price: mealPrice },
          ...prevItemsState.mealsInCartData,
        ],
      };
      updateCartItems(updatedState);
      return updatedState;
    });
  }

  function resetUserCartDataAfterCheckingOut () {
    const updatedState = {mealsLeftInCart: 0, mealsInCartData: []}
    setCartItems(updatedState)
    updateCartItems(updatedState)
  }

  const ctxValue = {
    cartMeals: cartItems.mealsInCartData,
    mealsLeftInCart: cartItems.mealsLeftInCart,
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
