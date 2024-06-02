import React, { useEffect, useState, useContext } from "react";
import { CartMealCxt } from "../context/CartMealContext";

function Products() {
  const [meals, setMeals] = useState([]);
  const { handleAddMealToCart, fetchCartItems } = useContext(CartMealCxt);

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

    fetchMeals();
  }, []);

    useEffect(() => {
    fetchCartItems();
  }, []); // Fetch cart items when component mounts

  return (
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
  );
}

export default Products;
