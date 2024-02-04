import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { asyncHandler } from "@/utils/asyncHandler";
import base from "@/utils/base";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
  apiVersion: "2022-08-01",
});

const handler = base().post(
  asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    //------------------
    const { amount, id, email } = req.body;

    try {
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Pay to buy products",
        payment_method: id,
        confirm: true,
        receipt_email: email,
      });

      res.json(payment);
    } catch (error) {
      console.log("Error", error);
      res.json({
        message: "Payment failed",
        success: false,
      });
    }
  }),
);

export default handler;
