/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
// import argon2, { hash } from 'argon2';
// import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Auth = {
  username: string;
  password: string;
};

type Cart = {
  cartId: number;
  userId: number;
  productId: number;
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

// const hashKey= process.env.TOKEN_SECRET;
// if(!hashKey) throw new Error('TOKEN_SECRET not found in .env');

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));

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

app.post('/api/shop/cart/:cartId', async (req, res, next) => {
  console.log('');
  try {
    // Destructure from the request body
    const { cartId } = req.params;
    if (!Number.isInteger(+cartId)) {
      throw new ClientError(400, `Non-integer cartId: ${cartId}`);
    }

    // I think we need to pulling the productName & photoUrl as well?
    const { productId, quantity } = req.body;
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new ClientError(
        400,
        'productId and product quantity must be a positive integer'
      );
    }
    // might need to add an extra error message for description?

    // Insert a new row into cart_items
    const sql = `
      insert into "cartItems" ("cartId","productId","quantity")
      values ($1, $2, $3)
      returning *
    `;
    const params = [cartId, productId, quantity];
    const result = await db.query(sql, params);
    const [cartItems] = result.rows;

    res.status(201).json(cartItems);
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

    // I think we need to pulling the productName & photoUrl as well?
    const { productId, quantity } = req.body;
    // if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    //   throw new ClientError(
    //     400,
    //     'productId and product quantity must be a positive integer'
    //   );
    // }

    // Insert a new row into cart_items
    // Do we need to have all values accounted or only the ones that are being updates?
    const sql = `
      update "cartItems"
      set "quantity" = $1,
      where "cartId"  = $2
      returning *
    `;
    const params = [cartId, productId, quantity];
    const result = await db.query(sql, params);
    console.log(result.rows);
    const updatedCart = result.rows[0];
    if (!updatedCart) {
      throw new ClientError(404, `${cartId} doesn't exist`);
    }
    res.json(updatedCart);
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
