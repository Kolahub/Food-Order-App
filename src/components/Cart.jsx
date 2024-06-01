import React, {
  useRef,
  //   useEffect,
  useContext,
  useState,
} from "react";
import Modal from "./Modal.jsx";
import CheckOutForm from "./CheckOutForm.jsx";
import { CartMealCxt } from "../context/CartMealContext.jsx";

function Cart({ open, close }) {
  const [submittedOrder, setSubmittedOrder]  = useState(false)
  const { cartMeals, handleMealDescreasePortion, handleIncreaseMealPortion } =
    useContext(CartMealCxt);
  const totalPrice = cartMeals.reduce(
    (acc, el) => acc + el.price * el.quantity,
    0
  );

  function handleSubmitOrder () {
    setSubmittedOrder(true)
  }

  function handleCloseCheckout () {
    setSubmittedOrder(false)
    close()
  }

  return (
    <>
      {open && (
        <Modal open={open} close={close} btnText={"Submit Order"} btnFn={handleSubmitOrder} info={false}>
          <div className="cart">
            <h2>Your Cart</h2>
            <ul>
              {cartMeals.map((meal, index) => {
                return (
                  <div key={meal.id} className="cart-item">
                    <p>
                      {meal.name} - {meal.quantity} x ${meal.price}
                    </p>
                    <div className="cart-item-actions">
                      <button
                        onClick={() => handleMealDescreasePortion(meal.id)}
                      >
                        -
                      </button>
                      <p>{meal.quantity}</p>
                      <button
                        onClick={() => handleIncreaseMealPortion(meal.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="cart-total">{totalPrice !== 0 ? `$${totalPrice.toFixed(2)}`: 'No Meals in your Cart'}</div>
            </ul>
          </div>
        </Modal>
      )}

   {submittedOrder && <CheckOutForm submitted={submittedOrder} close={handleCloseCheckout} totalPrice={totalPrice}/>}
    </>
  );
}

export default Cart;
