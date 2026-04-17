const express = require("express");
const router = express.Router();
const products = require("../data/products");

router.get("/", (req, res) => {
  const { search = "" } = req.query;

  const keyword = String(search).trim().toLowerCase();

  let result = products;

  if (keyword) {
    result = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
      );
    });
  }

  res.json(result);
});

router.get("/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Không tìm thấy sản phẩm",
    });
  }

  res.json(product);
});

module.exports = router;
