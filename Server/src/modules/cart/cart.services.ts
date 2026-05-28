import Cart from "./cart.model";
import Plan from "../plan/plan.model";
import { PRICING_CONFIG } from "../../config/pricing.config";

export class CartService {
  async addToCart(userId: string, planId: string, quantity: number) {
    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Plan not found!");
    if (!plan.isActive) throw new Error("Plan is not available!");
    if (!plan.simTypes.includes("physical"))
      throw new Error(
        "eSIM-only plans cannot be added to cart. Please order them directly.",
      );
    if (plan.isBusinessSim)
      throw new Error(
        "Business SIM plans cannot be added to cart. Please raise a business inquiry directly.",
      );

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ planId, quantity }],
      });
      return cart;
    }

    const existingItem = cart.items.find(
      (item) => item.planId.toString() === planId,
    );

    if (existingItem) {
      existingItem.quantity = existingItem.quantity + quantity;
    } else {
      cart.items.push({ planId, quantity } as any);
    }

    await cart.save();
    return cart;
  }

  async getCart(userId: string) {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.planId",
      select:
        "price salePrice description validity data calls sms networkType operatorId planTypeId serviceId",
      populate: [
        { path: "planTypeId", select: "name slug" },
        {
          path: "operatorId",
          select: "name slug logo operatorFee isOperatorFee",
        },
        { path: "serviceId", select: "name slug" },
      ],
    });

    let subTotal = 0,
      discount = 0,
      saleSubTotal = 0,
      platformFee = PRICING_CONFIG.PLATFORM_FEE,
      deliveryPrice = 0,
      totalOperatorFee = 0;

    // return these things when the cart is empty
    if (!cart || cart.items.length === 0) {
      return {
        cart: null,
        subTotal: 0,
        saleSubTotal: 0,
        discount: 0,
        platformFee: 0,
        deliveryPrice: 0,
        totalOperatorFee: 0,
        totalPrice: 0,
      };
    }

    cart.items.forEach((item) => {
      const plan = item.planId as any;
      subTotal += plan.price * item.quantity;
      saleSubTotal += plan.salePrice * item.quantity;

      if (plan.operatorId.isOperatorFee) {
        totalOperatorFee += plan.operatorId.operatorFee * item.quantity;
      }
    });
    discount = subTotal - saleSubTotal;
    deliveryPrice =
      saleSubTotal < PRICING_CONFIG.FREE_DELIVERY_THRESHOLD
        ? PRICING_CONFIG.DELIVERY_CHARGE
        : 0;
    let totalPrice =
      saleSubTotal + deliveryPrice + platformFee + totalOperatorFee;
    return {
      cart,
      subTotal,
      saleSubTotal,
      discount,
      platformFee,
      deliveryPrice,
      totalOperatorFee,
      totalPrice,
    };
  }

  async updateQuantity(userId: string, planId: string, quantity: number) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found!");

    const item = cart.items.find((item) => item.planId.toString() === planId);
    if (!item) throw new Error("Item not found in cart!");

    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async removeItem(userId: string, planId: string) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found!");

    cart.items = cart.items.filter(
      (item) => item.planId.toString() !== planId,
    ) as any; // yaha pe sirf wo items return karo jo is planId se match nahi karte , jo match karta hai uske hata do aur fir cart ko db me save kardo

    await cart.save();
    return cart;
  }

  async clearCart(userId: string) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found!");
    cart.items = [] as any;
    await cart.save();
    return cart;
  }
}

export default new CartService();
