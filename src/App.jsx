import { useState, useEffect } from "react";

function Product({ item, addToCart }) {
  return (
    <div className="product-card">
      <img src={item.image} alt={item.name} className="product-image" />
      <h3>{item.name}</h3>
      <p>Price: ${item.price.toFixed(2)}</p>
      <button onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  );
}

function ShoppingCart({ cartItems, removeFromCart, clearCart, updateQuantity }) {
  const subtotal = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const savings = 150.00;
  const total = (parseFloat(subtotal) - savings).toFixed(2);

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      <button onClick={clearCart} className="deselect-all">Deselect all items</button>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                  <span className="item-stock">In Stock</span>
                  <span className="item-shipping">Eligible for FREE Shipping & FREE Returns</span>
                  <div className="item-actions">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    >
                      {[...Array(10).keys()].map(num => (
                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                      ))}
                    </select>
                    <button onClick={() => removeFromCart(item.id)}>Delete</button>
                    <button>Save for later</button>
                    <button>Compare with similar items</button>
                    <button>Share</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <p className="subtotal">
              <span>Subtotal ({cartItems.length} items):</span>
              <span>${subtotal}</span>
            </p>
          </div>
          <div className="cart-actions">
            <button className="proceed-to-checkout">Proceed to checkout</button>
          </div>
        </>
      )}
      <div className="cart-total">
        <h3>Order Summary</h3>
        <p><span>Items:</span><span>${subtotal}</span></p>
        <p><span>Shipping & handling:</span><span>$0.00</span></p>
        <p><span>Total before tax:</span><span>${subtotal}</span></p>
        <p><span>Estimated tax to be collected:</span><span>$0.00</span></p>
        <p className="order-total"><span>Order total:</span><span>${subtotal}</span></p>
        <div className="gift-card-promo">
          <p>Hector, get a $150 Amazon Gift Card instantly upon approval for Prime Visa</p>
          <button>Learn more</button>
        </div>
      </div>
    </div>
  );
}

function NewProductForm({ addProduct }) {
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price <= 0 || isNaN(newProduct.price)) {
      alert("Please enter a valid name and price.");
      return;
    }
    addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
      id: Date.now(),
      image: `https://picsum.photos/seed/${Date.now()}/200/300`
    });
    setNewProduct({ name: "", price: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        required
        min="0.01"
        step="0.01"
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: e.target.value })
        }
      />
      <button type="submit">Add Product</button>
    </form>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=5')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (item) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }
    setCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  return (
    <div className="container">
      <h1>React Shopping Cart</h1>

      <NewProductForm addProduct={addProduct} />

      <div className="product-list">
        {products.map((product) => (
          <Product key={product.id} item={product} addToCart={addToCart} />
        ))}
      </div>

      <ShoppingCart 
        cartItems={cart} 
        removeFromCart={removeFromCart} 
        clearCart={clearCart}
        updateQuantity={updateQuantity}
      />
    </div>
  );
}

export default App;
