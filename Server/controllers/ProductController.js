import Product from "../models/ProductModel.js";

//// create products /////

export const creatrProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, stock } = req.body;
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const product = await Product.create({
      title,
      description,
      price,
      category,
      image,
      stock,
    });
    res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this title already exists. Please use a different title.",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all prdoucts ////
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// single product ///
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(401).json({
        success: false,
        message: "Product not found by id",
      });
    }
    res.status(200).json({
      success: true,
      messsage: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// updated products ////
export const updatedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found by id",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product uoddated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/// deleted products ////

export const deletedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not deleted ",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
