import React, { useEffect, useState, useContext } from "react";
import { CartMealCxt } from "../context/CartMealContext";

function Products() {
  const [meals, setMeals] = useState([]);
  const { handleAddMealToCart, fetchCartItems } = useContext(CartMealCxt);
  //   const [cartItems, setCartItems] = useState({
  //     mealsLeftInCart: 0,
  //     mealsInCartData: []
  //   })

  useEffect(() => {
    async function fetchMeals() {
      try {
        const res = await fetch("http://localhost:3000/meals");
        const data = await res.json();
        if (!res.ok) throw new Error("Coudn't fetch meal data.");
        setMeals(data);
      } catch (err) {
        console.log(err.message);
      }
    }

    // async function fetchCartItemsj () {
    //    fetchCartItems()
    // }

    // fetchCartItemsj()
    fetchMeals();
  }, []);

    useEffect(() => {
    fetchCartItems();
  }, []); // Fetch cart items when component mounts

  //   function handleAddMealToCart (mealName, mealId, mealPrice) {
  //     setCartItems((prevItemsState) => {
  //         let alreadyExist = prevItemsState.mealsInCartData.find((el) => el.id === mealId)

  //         if (alreadyExist) {
  //             const updateCartData = [...prevItemsState.mealsInCartData.filter(el => el.id !== mealId)]
  //             return {...prevItemsState, mealsInCartData: [{...alreadyExist, quantity: (alreadyExist.quantity + 1) }, updateCartData]}

  //         }
  //         return {mealsLeftInCart: prevItemsState.mealsLeftInCart + 1, mealsInCartData: [{id: mealId, name: mealName, quantity: 1, price: mealPrice}, ...prevItemsState.mealsInCartData]}
  //     })
  //   }

  //   console.log(cartItems.mealsInCartData, cartItems.mealsLeftInCart, '❤️❤️❤️')

  //   const ctxValue = {
  //     cartMeals: cartItems.mealsInCartData,
  //     mealsLeftInCart: cartItems.mealsLeftInCart,
  //   }

  //   console.log(ctxValue)

  return (
    // <CartMealCxt.Provider value={ctxValue}>
    <div id="meals">
      {meals.map((meal) => {
        return (
          <div key={meal.id} className="meal-item">
            <img src={`http://localhost:3000/${meal.image}`} alt={meal.alt} />
            <article>
              <h3>{meal.name}</h3>
              <div className="meal-item-price">${meal.price}</div>
              <div className="meal-item-description">{meal.description}</div>
              <div
                className="meal-item-actions"
                onClick={() =>
                  handleAddMealToCart(meal.name, meal.id, meal.price)
                }
              >
                Add to cart
              </div>
            </article>
          </div>
        );
      })}
    </div>
    // </CartMealCxt.Provider>
  );
}

export default Products;
