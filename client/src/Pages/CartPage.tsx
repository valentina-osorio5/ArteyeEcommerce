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
  // const [product, setProduct] = useState<any>(null);
  const { addToCart } = useContext(ShoppingCartContext);
  const userContext = useUser();
  const [event, setEvent] = useState(true);

  const user = userContext.user.userId;
  console.log('user', user);

  // const [newProductId, setNewProductId] = useState<number>(0);
  // const [newQuantity, setNewQuantity] = useState<number>(1);
  // const { userId } = useParams<{ userId: string }>();

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
  }, [user, event]);

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

  function handleAddToCart(cartItem: CartItem) {
    console.log('+ button pressed');
    console.log(cartItem);
    // if (!product) throw new Error('Product data missing');

    // // Call the context function to update local state (if needed)
    const product = {
      imageUrl: cartItem.imageUrl,
      productId: cartItem.productId,
      description: cartItem.description,
      price: cartItem.price,
      productName: cartItem.productName,
    };
    console.log(product);
    addToCart(product);

    // Now add the item to the cart in the database
    async function postData() {
      try {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Send the productId and quantity.
          // If you need to send a userId, include it here or have it added via authMiddleware on the server.
          body: JSON.stringify({
            productId: product.productId,
            quantity: 1,
            userId: user,
            // or use the value from your context if you allow choosing quantity
          }),
        };
        const res = await fetch('/api/shop/cart', options);
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        const data = await res.json();
        console.log('Cart updated:', data);
      } catch (err) {
        console.error(err);
      }
    }
    postData();
    setEvent(!event);

    // Now add the item to the cart in the database
    //   async function updateData() {
    //     console.log('update data fired');
    //     try {
    //       const options = {
    //         method: 'PUT',
    //         headers: { 'Content-Type': 'application/json' },
    //         // Send the productId and quantity.
    //         // If you need to send a userId, include it here or have it added via authMiddleware on the server.
    //         body: JSON.stringify({
    //           productId: cartItem.productId,
    //           quantity: 1,
    //           userId: user,
    //           // or use the value from your context if you allow choosing quantity
    //         }),
    //       };
    //       const res = await fetch(`/api/shop/user/${user}`, options);
    //       if (!res.ok) throw new Error(`Fetch error ${res.status}`);
    //       const data = await res.json();
    //       console.log('Cart updated:', data);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   }
    //   updateData();
  }

  async function deleteData() {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Send the productId and quantity.
        // If you need to send a userId, include it here or have it added via authMiddleware on the server.
        body: JSON.stringify({
          productId: cartItem.productId,
          quantity: 0,
          userId: user,
          // or use the value from your context if you allow choosing quantity
        }),
      };
      const res = await fetch(`/api/shop/user/${user}`, options);
      if (!res.ok) throw new Error(`Fetch error ${res.status}`);
      const data = await res.json();
      console.log('Cart updated:', data);
    } catch (err) {
      console.error(err);
    }
    deleteData();
  }

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
                  className="px-1 py-.75 rounded"
                  onClick={() => handleAddToCart(cartItem)}>
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
