import React, { useContext, useState } from "react";
import Cart from "./Cart.jsx";
import { CartMealCxt } from '../context/CartMealContext'
import logoImg from "../assets/logo.jpg";

function Header() {
  const { mealsLeftInCart } = useContext(CartMealCxt)
  const [cartIsOpen, setCartIsOpen] = useState(false)

  console.log('Header');

  function handleShowCart() {
    setCartIsOpen(true)
  }
  
  function handleCloseCart () {
    setCartIsOpen(false)
  }

  return (
    <>
      <div id="main-header">
        <div id="title">
          <img src={logoImg} alt="" />
          <h1>ReactFood</h1>
        </div>
        <button onClick={handleShowCart}>Cart({mealsLeftInCart})</button>
      </div>

      <Cart key={cartIsOpen} open={cartIsOpen} close={handleCloseCart}/>
    </>
  );
}

export default Header;
