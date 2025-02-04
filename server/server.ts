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

app.get('/api/shop/user/:userId', async (req, res, next) => {
  console.log('/api/shop/user/:userId hit');
  try {
    const userId = Number(req.params.userId);
    console.log(userId);
    if (!Number.isInteger(+userId)) {
      throw new ClientError(400, `Non-integer userId: ${userId}`);
    }

    const sql = `
    select "cartId", "quantity", "productId","productName", "description", "imageUrl", "price"
    from "cartItems"
    join "products" using ("productId")
    where "userId" = $1
    `;
    // on line 146, join to "products" where "productId" = $2
    // might need to eventually refine what we're selecting instead of all,
    // probably an object for each productId

    const params = [userId];
    const result = await db.query(sql, params);
    // console.log(result.rows);
    const cart = result.rows;
    console.log('cart', cart);

    if (!cart) {
      throw new ClientError(400, `cart for userId ${userId} not found`);
    }
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
});

app.post('/api/shop/user/:userId', async (req, res, next) => {
  console.log('pos /api/shop/user/:userId hit');
  try {
    // shouldn't userId be the req.params? not req.body?
    const { userId } = req.params;
    console.log('post userId', userId);
    if (!Number.isInteger(+userId)) {
      throw new ClientError(400, `Non-integer userId: ${userId}`);
    }
    const { productId, quantity } = req.body;
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new ClientError(
        400,
        'productId must be provided and quantity must be a positive integer'
      );
    }
    // First, see if an entry for this product (for this user) already exists.
    const checkSql = `
      SELECT *
      FROM "cartItems"
      WHERE "productId" = $1 AND "userId" = $2
    `;
    const checkParams = [productId, userId];
    const checkResult = await db.query(checkSql, checkParams);
    console.log(checkResult);
    if (checkResult.rows.length > 0) {
      // If the product already exists in corresponding product cart, update the quantity.
      const existingItem = checkResult.rows[0];
      const updateSql = `
        UPDATE "cartItems"
        SET "quantity" = "quantity" + $1
        WHERE "cartId" = $2
        RETURNING *
      `;
      const updateParams = [quantity, existingItem.cartId];
      const updateResult = await db.query(updateSql, updateParams);
      return res.status(200).json(updateResult.rows[0]);
    } else {
      // Otherwise, insert a new row.
      const insertSql = `
        INSERT INTO "cartItems" ("userId", "productId", "quantity")
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const insertParams = [userId, productId, quantity];
      const insertResult = await db.query(insertSql, insertParams);
      return res.status(201).json(insertResult.rows[0]);
    }
  } catch (err) {
    next(err);
  }
});

app.put('/api/shop/user/:userId', async (req, res, next) => {
  console.log('put route /api/shop/user/:userId hit');
  try {
    // Destructure from the request body
    const { userId } = req.params;
    if (!Number.isInteger(+userId)) {
      throw new ClientError(400, `Non-integer userId: ${userId}`);
    }

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
      where "userId"  = $2 and "productId" = $3
      returning *
    `;
    const params = [quantity, userId, productId];
    const result = await db.query(sql, params);
    console.log(result.rows);
    const updatedCart = result.rows[0];
    if (!updatedCart) {
      throw new ClientError(404, `cart for this item does not exist`);
    }
    res.json(updatedCart);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  console.log('/api/auth/sign-in hit');
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    console.log(username, password);
    const sql = `
    select "userId",
           "hashedPassword"
    from "users"
    where "username" = $1
    `;
    const params = [username];
    console.log(params);
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    console.log(result.rows);
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    console.log(payload);
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

app.post('/api/shop/cart', async (req, res, next) => {
  console.log('/api/shop/cart hit');
  try {
    const { productId, quantity, userId } = req.body;
    console.log('post userId', userId);
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new ClientError(
        400,
        'productId must be provided and quantity must be a positive integer'
      );
    }
    // First, see if an entry for this product (for this user) already exists.
    const checkSql = `
      SELECT *
      FROM "cartItems"
      WHERE "productId" = $1 AND "userId" = $2
    `;
    const checkParams = [productId, userId];
    const checkResult = await db.query(checkSql, checkParams);
    console.log(checkResult);
    if (checkResult.rows.length > 0) {
      // If the product already exists in the cart, update the quantity.
      const existingItem = checkResult.rows[0];
      const updateSql = `
        UPDATE "cartItems"
        SET "quantity" = "quantity" + $1
        WHERE "cartId" = $2
        RETURNING *
      `;
      const updateParams = [quantity, existingItem.cartId];
      const updateResult = await db.query(updateSql, updateParams);
      return res.status(200).json(updateResult.rows[0]);
    } else {
      // Otherwise, insert a new row.
      const insertSql = `
        INSERT INTO "cartItems" ("userId", "productId", "quantity")
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const insertParams = [userId, productId, quantity];
      const insertResult = await db.query(insertSql, insertParams);
      return res.status(201).json(insertResult.rows[0]);
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
