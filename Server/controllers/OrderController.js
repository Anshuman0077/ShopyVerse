import { autoUpdatedOrders } from "../utils/autoupdated.js"

export const forceUpdateOrders = async (req , res) => {
    try {
        const updatedOrders = await autoUpdatedOrders();
        res.status(200).json({
            success: true,
            message: "Orders updated successfully",
            data: updatedOrders
        });

    } catch (errt) {
        console.log("Error in forceUpdateOrders:", errt);
        res.status(500).json({
            success: false,
            message: errt.message || "Internal server error",
        });
        
    }
};



