// @author Uday Pratap Chauhan
import Cart from "../cart/cart.model";
import orderService from "../orders/order.service";
import Plan from "../plan/plan.model";
import CheckoutSession, { ICheckoutItem } from "./checkoutSession.model";

export class CheckoutSessionService {
  async createSession(
    userId: string,
    type: "DIRECT" | "THROUGHCART",
    planId?: string,
    quantity?: number,
  ) {
    if (type === "DIRECT") {
      const plan = await Plan.findById(planId);
      if (!plan || !plan.isActive)
        throw new Error("Plan is either inactive or doesn't exist");

      const session = await CheckoutSession.create({
        userId,
        orderType: "DIRECT",
        items: [
          {
            planId: plan._id,
            quantity,
            priceAtSnapshot: plan.salePrice,
          },
        ],
      });
      return session;
    }

    // THROUGHCART
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) throw new Error("Cart is Empty!");

    let processedItems: any = [];
    processedItems = await Promise.all(
      cart.items.map(async (item) => {
        const plan = await Plan.findById(item.planId);
        if (!plan || !plan.isActive) throw new Error("Plan not found");

        return {
          planId: plan._id,
          quantity: item.quantity,
          priceAtSnapshot: plan.salePrice,
        };
      }),
    );

    // let processedItems: ICheckoutItem[] = [];
    // for (let item of cart.items) {
    //   const plan = await Plan.findById(item.planId);
    //   if (!plan || !plan.isActive) throw new Error("Plan not found");

    //   processedItems.push({
    //     planId: plan._id,
    //     quantity: item.quantity,
    //     priceAtSnapshot: plan.salePrice,
    //   });
    // }
    const session = await CheckoutSession.create({
      userId,
      orderType: "THROUGHCART",
      items: processedItems,
    });
    return session;
  }

  async getSession(userId: string, sessionId: string) {
    const checkoutSession = await CheckoutSession.findById(sessionId);
    if (!checkoutSession) throw new Error("Session not found");
    if (checkoutSession.userId.toString() !== userId)
      throw new Error("Unauthourized");
    if (checkoutSession.expiresAt < new Date())
      throw new Error("Session expired!");

    // changing items into string
    const formattedItems = checkoutSession.items.map((item) => ({
      planId: item.planId.toString(),
      quantity: item.quantity,
    }));
    const summary = await orderService.calculateOrderSummary(formattedItems);

    // checking if price has changed and if changed then sending the isPriceChanged flag
    const finalItems = summary.processedItems.map((item, index) => {
      const originalPrice = checkoutSession.items[index].priceAtSnapshot;
      return {
        ...item,
        isPriceChanged: item.salePriceAtPurchase !== originalPrice,
        originalPrice, // price when the checkout session was created
      };
    });
    return {
      ...summary,
      processedItems: finalItems,
      sessionId: checkoutSession._id,
      orderType: checkoutSession.orderType,
    };
  }
}

export default new CheckoutSessionService();
