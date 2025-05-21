const Product = require("../models/Product");
const User = require("../models/User");

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
