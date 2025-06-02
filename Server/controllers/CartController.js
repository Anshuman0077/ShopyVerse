import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";



// / add items //////////

export const addCartItems = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    // ✅ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ Check if user already has a cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // ✅ If no cart exists, create a new one
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      // ✅ Check if product already in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // ✅ If product exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // ✅ Else, push new product into cart
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Cart items added successfully", cart });

  } catch (error) {
    console.error("❌ Error adding cart items:", error);
    res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};



export const getCartItemsdetails = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ user: userId}).populate("items.product","name price ")
        if (!cart) {
            return res.status(404).json({success: false, message: "Cart not found for this user"});
        }
        if (cart.items.length === 0) {
            console.log("Cart fetched: ", JSON.stringify(cart, null, 2));
            return res.status(200).json({success: true, message: "Cart is empty", cart});
        } else {
           console.log("Cart fetched: ", JSON.stringify(cart, null, 2));
            return res.status(200).json({success: true, message: "Cart items fetched successfully", cart});
        }
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ success: false, message: error.message ||  "Internal Server Error "})
        
    }
}



/// update cart ///
export const updateCartItems = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    try {
        // ✅ Check if user has a cart
        const cart = await Cart.findOne({ user: userId });
    
        if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found for this user" });
        }
    
        // ✅ Check if product exists in cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        if (quantity > 0) {
            
           cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1); 
        }

        await cart.save();
        console.log("Cart items:", cart.items);
        res.status(200).json({ success: true, message: "Cart items updated successfully", cart });

    } catch (error) {
        console.error("❌ Error updating cart items:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}



/// Delete Cart items ////


export const removeCartItems = async (req, res) => {
  const userId = req.user.id;
  const {productId} = req.body;
  try {
    const cart = await Cart.findOne({
      user: userId
    });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found for this user" });
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart"});
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(200).json({ success: true, message: "Cart item removed successfully" , cart});
  } catch {
    console.error("Error removing cart items:", error);

    res.status(500).json({ success: false, message: error.message || "Internal Server Error"})
  }
}