/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import { nextTick } from 'process';
import { redirect } from 'react-router-dom';
import argon2, { hash } from 'argon2';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Auth = {
  username: string;
  password: string;
};

// changed this to a numbers array
type Cart = {
  cartId: number;
  userId: number;
  productId: number[];
  quantity: number;
};

type Product = {
  productId: number;
  productName: string;
  description: string;
  imageUrl: string;
  price: number;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/shop', async (req, res, next) => {
  console.log('/api/shop hit');
  try {
    const sql = `
    select * from "products"
    order by "productId" asc;
    `;

    const result = await db.query(sql);
    console.log(result.rows);
    const products = result.rows;

    if (!products) {
      throw new ClientError(400, 'No products found');
    }
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.get('/api/shop/:productId', async (req, res, next) => {
  console.log('/api/shop/:productId hit');
  try {
    const productId = Number(req.params.productId);
    // validateProductId(productId)
    console.log(productId);
    if (!Number.isInteger(+productId)) {
      throw new ClientError(400, `Non-integer productId: ${productId}`);
    }

    const sql = `
    select *
    from "products"
    where "productId" = $1
    `;

    const params = [productId];
    const result = await db.query(sql, params);
    console.log(result.rows);
    const [product] = result.rows;

    if (!product) {
      throw new ClientError(400, `productId ${productId} not found`);
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  console.log('/api/auth/sign-up hit');
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning "userId", "username", "createdAt"
    `;
    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('api/auth/sign-in', async (req, res, next) => {
  console.log('api/auth/sign-in hit');
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select "userId",
           "hashedPassword"
    from "users"
    where "username" = $1
    `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.get('/api/shop/cart/:cartId', async (req, res, next) => {
  console.log('/api/shop/cart/:cartId hit');
  try {
    const cartId = Number(req.params.cartId);
    console.log(cartId);
    if (!Number.isInteger(+cartId)) {
      throw new ClientError(400, `Non-integer cartId: ${cartId}`);
    }

    const sql = `
    select *
    from "cartItems"
    where "cartId" = $1
    `;

    const params = [cartId];
    const result = await db.query(sql, params);
    console.log(result.rows);
    const [cart] = result.rows;

    if (!cart) {
      throw new ClientError(400, `cartId ${cartId} not found`);
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
});

// app.post('/api/shop/product/:productId', async (req, res, next) => {
//   console.log('/api/shop/product/:productId hit');
//   try {
//     // Destructure from the request body
//     const { productId } = req.params;
//     console.log(productId);
//     // if (!Number.isInteger(+productId)) {
//     //   throw new ClientError(400, `Non-integer cartId: ${productId}`);
//     // }

//     // I think we need to pulling the productName & photoUrl as well?
//     const { cartId, numberOfItems } = req.body;
//     console.log(req.body);
//     if (!Number.isInteger(numberOfItems) || numberOfItems < 1) {
//       throw new ClientError(400, 'product quantity must be a positive integer');
//     }

//     if (!cartId) {
//       const sql = `
//       insert into "cartItems" ("productId","quantity")
//       values ($1, $2)
//       returning *
//     `;
//       const params = [productId, numberOfItems];
//       const result = await db.query(sql, params);
//       const [cartItems] = result.rows;

//       res.status(201).json(cartItems);
//     } else {
//       if (cartId) {
//         const { cartId } = req.params;
//         if (!Number.isInteger(+cartId)) {
//           throw new ClientError(400, `Non-integer cartId: ${cartId}`);
//         }

//         //
//         const { productId, quantity } = req.body;
//         if (!productId || !Number.isInteger(quantity) || quantity < 1) {
//           throw new ClientError(
//             400,
//             'productId and product quantity must be a positive integer'
//           );
//         }

//         // Insert a new row into cart_items
//         // For this cartId, is this something that should be assigned a $ variable?
//         const sql = `
//       update "cartItems"
//       set "quantity" = $1
//       where "cartId"  = $2 and "productId" = $3
//       returning *
//     `;
//         const params = [quantity, cartId, productId];
//         const result = await db.query(sql, params);
//         console.log(result.rows);
//         const updatedCart = result.rows[0];
//         if (!updatedCart) {
//           throw new ClientError(404, `cartId ${cartId} doesn't exist`);
//         }
//         res.json(updatedCart);
//       }
//     }

//     // use sql to see if there's a cart (initial query)

//     // if else statement if cart doesn't exist, do a post request
//     // if a cart does exist, do a put request (sql query)
//     // line 168 will run depending on which sql was defined
//   } catch (err) {
//     next(err);
//   }
// });

app.post('/api/shop/product/:productId', async (req, res, next) => {
  console.log('/api/shop/product/:productId hit');
  try {
    // Destructure from the request body
    const { productId } = req.params;
    console.log(productId);

    // Cart ID and product quantity array
    const { cartId, products } = req.body; // Assuming `products` is an array of { productId, quantity }

    if (!Array.isArray(products) || products.length === 0) {
      throw new ClientError(
        400,
        'Products must be an array of objects with productId and quantity.'
      );
    }

    // Validate each product's quantity
    products.forEach(({ productId, quantity }) => {
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new ClientError(
          400,
          'Each product quantity must be a positive integer.'
        );
      }
    });

    if (!cartId) {
      // If there's no cartId (new cart), insert new cart items
      const sql = `
        INSERT INTO "cartItems" ("productId", "quantity")
        VALUES ($1, $2)
        RETURNING *
      `;
      const result = [];

      // Loop through each product and insert into the cartItems table
      for (const { productId, quantity } of products) {
        const params = [productId, quantity];
        const res = await db.query(sql, params);
        result.push(res.rows[0]); // Collect the results for each product added
      }

      res.status(201).json(result); // Return all the added items in the response
    } else {
      // If cartId exists (existing cart), update existing products or add new ones
      const result = [];

      for (const { productId, quantity } of products) {
        // Check if the product is already in the cart
        const checkSql = `
          SELECT * FROM "cartItems"
          WHERE "cartId" = $1 AND "productId" = $2
        `;
        const checkParams = [cartId, productId];
        const checkResult = await db.query(checkSql, checkParams);

        if (checkResult.rows.length > 0) {
          // If product exists, update its quantity
          const updateSql = `
            UPDATE "cartItems"
            SET "quantity" = $1
            WHERE "cartId" = $2 AND "productId" = $3
            RETURNING *
          `;
          const updateParams = [quantity, cartId, productId];
          const updateRes = await db.query(updateSql, updateParams);
          result.push(updateRes.rows[0]); // Add the updated product
        } else {
          // If product doesn't exist in the cart, add it
          const insertSql = `
            INSERT INTO "cartItems" ("cartId", "productId", "quantity")
            VALUES ($1, $2, $3)
            RETURNING *
          `;
          const insertParams = [cartId, productId, quantity];
          const insertRes = await db.query(insertSql, insertParams);
          result.push(insertRes.rows[0]); // Add the newly inserted product
        }
      }

      res.json(result); // Return all the updated/added products in the cart
    }
  } catch (err) {
    next(err);
  }
});

app.put('/api/shop/cart/:cartId', async (req, res, next) => {
  console.log('put route /api/shop/cart/:cartId hit');
  try {
    // Destructure from the request body
    const { cartId } = req.params;
    if (!Number.isInteger(+cartId)) {
      throw new ClientError(400, `Non-integer cartId: ${cartId}`);
    }

    // I think we need to be pulling the productName & photoUrl as well?
    const { productId, quantity } = req.body;
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new ClientError(
        400,
        'productId and product quantity must be a positive integer'
      );
    }

    // Insert a new row into cart_items
    // Do we need to have all values accounted or only the ones that are being updated?
    const sql = `
      update "cartItems"
      set "quantity" = $1
      where "cartId"  = $2 and "productId" = $3
      returning *
    `;
    const params = [quantity, cartId, productId];
    const result = await db.query(sql, params);
    console.log(result.rows);
    const updatedCart = result.rows[0];
    if (!updatedCart) {
      throw new ClientError(404, `cartId ${cartId} doesn't exist`);
    }
    res.json(updatedCart);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/shop/cart/:cartId', async (req, res, next) => {
  console.log('delete /api/shop/cart/:cartId hit');
  try {
    const { cartId } = req.params;
    if (!Number.isInteger(+cartId)) {
      throw new ClientError(400, `Non-integer cartId: ${cartId}`);
    }
    const sql = `
  delete from "cartItems" where "cartId" = $1
  returning *;
  `;
    const params = [cartId];
    const result = await db.query(sql, params);
    console.log(result.rows);
    const deleteCart = result.rows[0];
    if (!deleteCart) {
      throw new ClientError(404, `cart ${cartId} doesn't exist!`);
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
