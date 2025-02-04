import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { UserContext } from '../components/UserContext';
import { ShoppingCartContext } from '../components/ShoppingCartContext';

export type User = {
  userId: number;
  username: string;
};

type CartItem = {
  cartId: number;
  userId: number;
  productId: number;
  quantity: number;
  addedAt: string;
  productName: string;
  price: string;
  imageUrl: string;
  description: string;
};

export function CartPage() {
  const navigate = useNavigate();
  // const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // const [newProductId, setNewProductId] = useState<number>(0);
  // const [newQuantity, setNewQuantity] = useState<number>(1);
  // const { userId } = useParams<{ userId: string }>();
  // const { addToCart } = useContext(ShoppingCartContext);

  // const [product, setProduct] = useState<any>(null);

  const userContext = useUser();
  console.log(userContext.user.userId);
  const user = userContext.user.userId;

  // If the user is not logged in, you may want to redirect them
  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  async function fetchCartItems() {
    try {
      const res = await fetch(`api/shop/user/${user}`);
      if (!res.ok) {
        console.error(`Failed to fetch userId ${user}`);
        return;
      }
      const data = await res.json();
      console.log('data', data);
      setCartItems(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }
  function toDollars(value: number): string {
    return '$' + value.toFixed(2);
  }

  // function handleAddToCart() {
  //   if (!product) throw new Error('Product data missing');

  //   // Call the context function to update local state (if needed)
  //   addToCart(product);
  // }

  // Create cart item
  // async function handleAddToCart() {
  //   if (newProductId < 1 || newQuantity < 1) {
  //     return;
  //   }
  //   try {
  //     const res = await fetch(`api/shop/user/${userId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         productId: newProductId,
  //         quantity: newQuantity,
  //         userId: UserContext.user.userId,
  //       }),
  //     });
  //     if (!res.ok) {
  //       console.error('Failed to add item');
  //       return;
  //     }
  //     await res.json(); // the created cart item
  //     // refresh the cart items
  //     fetchCartItems();
  //     setNewProductId(0);
  //     setNewQuantity(1);
  //   } catch (error) {
  //     console.error('Error adding item:', error);
  //   }
  // }

  // Update cart item
  // async function handleUpdateQuantity(cartItemId: number, newQty: number) {
  //   if (newQty < 1) return;
  //   try {
  //     const res = await fetch(`api/shop/user/${userId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ quantity: newQty }),
  //     });
  //     if (!res.ok) {
  //       console.error('Failed to update');
  //       return;
  //     }
  //     const updatedItem = await res.json();
  //     // Update local state with the updated item
  //     setCartItems((prev) =>
  //       prev.map((item) =>
  //         item.cartItemId === cartItemId
  //           ? { ...item, quantity: updatedItem.quantity }
  //           : item
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Error updating cart item:', error);
  //   }
  // }

  // // Delete cart item
  // async function handleDeleteCartItem(cartItemId: number) {
  //   try {
  //     const res = await fetch(`/api/cart/${cartItemId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (!res.ok) {
  //       console.error('Failed to delete');
  //       return;
  //     }
  //     // Filter out the deleted item
  //     setCartItems((prev) =>
  //       prev.filter((item) => item.cartItemId !== cartItemId)
  //     );
  //   } catch (error) {
  //     console.error('Error deleting cart item:', error);
  //   }
  // }

  return (
    <>
      <div className="container flex">
        <div style={{ fontFamily: 'Nova Round' }} className="w-3/5 ml-4 p-4">
          <h1 className="align-center justify-self-center text-2xl mb-2">
            {' '}
            Your Shopping Cart
          </h1>
          {cartItems.map((cartItem) => (
            <div key={cartItem.productId} className="mb-4">
              <h2 className="font-bold">{cartItem.productName}</h2>
              <p className="font-light text-sm">
                Item Price: ${cartItem.price}
              </p>
              <p className="font-light text-sm">
                Item Total: {toDollars(cartItem.price * cartItem.quantity)}
              </p>
              <img
                className=""
                src={cartItem.imageUrl}
                alt={cartItem.productName}
                style={{ width: '125px' }}
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  style={{ backgroundColor: '#9381ef' }}
                  className="px-1 py-.75 rounded">
                  -
                </button>
                <p className="font-light">{cartItem.quantity}</p>
                <button
                  style={{ backgroundColor: '#9381ef' }}
                  className="px-1 py-.75 rounded">
                  +
                </button>
                <button className="text-sm underline">Remove from Cart</button>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{ fontFamily: 'Nova Round' }}
          className="w-2/5 border-b-1 0 ml-4 p-4 border-2">
          <h2 className="text-xl mb-2">Order Summary</h2>
          <h3 className="mb-2">Subtotal </h3>
          <p className="text-xs">Shipping & taxes calculated at checkout</p>
          <br></br>
          <br></br>
          <br></br>
          <button
            style={{ backgroundColor: '#eaf585' }}
            className="flex justify-items-center justify-self-center border border-gray-300 rounded py-1 px-3 mx-10 mb-5">
            Proceed to checkout
          </button>
        </div>
      </div>
    </>
  );
}

{
  /* <h2>My Cart</h2>
      {!user ? (
        <p>You must be signed in to view or modify your cart.</p>
      ) : (
        <>
          <form
          // onSubmit={handleAddToCart}
          >
            <h3>Add New Product to Cart</h3>
            <div>
              <label>Product ID:</label>
              <input
                type="number"
                value={newProductId}
                onChange={(e) => setNewProductId(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Quantity:</label>
              <input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
              />
            </div>
            <button type="submit">Add to Cart</button>
          </form>

          <h3>Existing Cart Items</h3>
          <ul>
            {cartItems.map((item) => (
              <li key={productId}>
                <img
                  src={imageUrl}
                  alt={productName}
                  style={{ width: '50px', marginRight: '1rem' }}
                />
                {productName} - ${item.price} x {item.quantity}
                <button
                // onClick={() =>
                //   handleUpdateQuantity(item.cartItemId, item.quantity + 1)
                // }
                >
                  +
                </button>
                <button
                // onClick={() =>
                //   handleUpdateQuantity(
                //     item.cartItemId,
                //     Math.max(1, item.quantity - 1)
                //   )
                // }
                >
                  -
                </button>
                <button
                // onClick={() => handleDeleteCartItem(item.cartItemId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )} */
}
