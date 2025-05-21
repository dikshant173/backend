const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.productId === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();

    res.json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding to cart" });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) => item.productId !== productId
    );

    await cart.save();

    res.json({ message: "Product removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing product from cart" });
  }
};
