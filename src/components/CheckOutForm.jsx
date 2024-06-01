import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "./Modal.jsx";
import Input from "./Input.jsx";
import { CartMealCxt } from "../context/CartMealContext.jsx";

function CheckOutForm({ submitted, close, totalPrice }) {
  const formRef = useRef();
  const { cartMeals, resetUserCartDataAfterCheckingOut } = useContext(CartMealCxt);

  const [checkOutData, setCheckOutData] = useState({
    items: [],
    customer: {},
  });

  const [checkedOrderOut, setCheckedOrderOut] = useState(false)

  useEffect(() => {
    async function CheckOutUserOrder() {
      try {
        const res = await fetch("http://localhost:3000/orders", {
          method: "POST",
          body: JSON.stringify({ order: checkOutData }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if(!res.ok) throw new Error(`${data,message}`)
            setCheckedOrderOut(true)
        console.log(data, "CHECKOUT SUCCESSFULL🫡");
      } catch (err) {
        console.log(err.message);
      }
    }

    CheckOutUserOrder();
  }, [checkOutData]);

  if (checkedOrderOut) {
    return <Modal open={checkedOrderOut} close={handleCloseCheckOut} btnText={'Okay'} btnFn={handleCloseCheckOut} info={true}>
        <h1>Success!</h1>
        <p>Your order was submitted Successfully.</p>
        <p>We will get back to you via email in the few minutes.</p>
    </Modal>
  }

 function handleCloseCheckOut () {
    resetUserCartDataAfterCheckingOut()
    setCheckedOrderOut(false)
 }

  function handleCheckOut() {
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    // console.log(data, '💥💥💥💥');
    setCheckOutData((prevCheckOutData) => {
      return {
        items: cartMeals,
        customer: data,
      };
    });
  }

  console.log(checkOutData, "🩷🩷🩷");
  return (
    <>
      {submitted && (
        <Modal
          open={submitted}
          close={close}
          btnText={"Submit Order"}
          btnFn={handleCheckOut}
          info={false}
        >
          <h2>Checkout</h2>
          <p>Total Amount: ${totalPrice}</p>

          <form action="" className="control" ref={formRef}>
            <Input
              id={"fullName"}
              label={"Full Name"}
              name={"name"}
              type={"text"}
            />
            <Input
              id={"email"}
              label={"E-Mail Address"}
              name={"email"}
              type={"email"}
            />
            <Input
              id={"street"}
              label={"Street"}
              name={"street"}
              type={"text"}
            />
            <div className="control-row">
              <div className="">
                <Input
                  id={"postalCode"}
                  label={"Postal Code"}
                  name={"postal-code"}
                  type={"code"}
                />
              </div>
              <div className="">
                <Input id={"city"} label={"City"} name={"city"} type={"text"} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default CheckOutForm;
