import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

import PaymentForm from "./PaymentForm";

const stripeTestPromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const PaymentStripe = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
};

export default PaymentStripe;
