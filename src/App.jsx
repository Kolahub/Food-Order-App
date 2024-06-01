import Header from "./components/Header.jsx";
import Products from "./components/Products.jsx";
import { CartMealCxtProvider } from "./context/CartMealContext.jsx";
function App() {

  return (
    <CartMealCxtProvider>
    <Header />
    <Products />
    </CartMealCxtProvider>
  );
}

export default App;
