// import { Offcanvas } from 'react-bootstrap/Offcanvas';
// import { Stack } from 'react-bootstrap/Stack';
// import { ProductDetails } from './ProductDetails';
// import { useState } from 'react';
// import { ShoppingCartContext } from '../components/ShoppingCartContext';

// type ShoppingCartProps = {
//   isOpen: boolean;
// };

// export function ShoppingCart() {
//   const [showPopUp, setShowPopUp] = useState(false);
//   const handleClose = () => setShowPopUp(false);
//   const handleShow = () => setShowPopUp(true);

//   return (
//     <>
//       <Offcanvas show={showPopUp} onHide={handleClose} placement="end">
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Cart </Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <Stack gap={3}>
//             {cartItems.map((item) => (
//               <CartItem key={product.productId} {...product} />
//             ))}
//           </Stack>
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// }
