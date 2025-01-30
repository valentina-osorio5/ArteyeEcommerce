// import {
//   Offcanvas,
//   OffcanvasHeader,
//   OffcanvasTitle,
//   CloseButton,
//   OffcanvasBody,
// } from 'react-bootstrap';
// import { Stack } from 'react-bootstrap/Stack';
// import { ProductDetails } from './ProductDetails';

// type ShoppingCartProps = {
//   isOpen: boolean;
// };

// export function ShoppingCart({ isOpen }: ShoppingCartProps) {
//   const { closeCart, cartItems } = useShoppingCart();
//   return (
//     <>
//       <Offcanvas show={isOpen} onHide={closeCart} placement="end">
//         <OffcanvasHeader closeButton>
//           <OffcanvasTitle>Cart </OffcanvasTitle>
//         </OffcanvasHeader>
//         <OffcanvasBody>
//           <Stack gap={3}>
//             {cartItems.map((item) => (
//               <CartItem key={product.productId} {...product} />
//             ))}
//           </Stack>
//         </OffcanvasBody>
//       </Offcanvas>
//     </>
//   );
// }
