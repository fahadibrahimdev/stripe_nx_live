import { NextResponse } from "next/server";
import Stripe from "stripe";

const mySecret: string = process.env.STRIPE_SECRET
  ? process.env.STRIPE_SECRET
  : "";
const stripe = new Stripe(mySecret);

export async function POST(request: Request) {
  try {
    const { amount, currency, paymentMethodId } = await request.json();

    // // Log the received data for debugging purposes
    // console.log("Received data:", { paymentMethodId, amount, currency });

    // Validate the input
    if (!paymentMethodId || !amount || !currency) {
      return NextResponse.json(
        { status: false, error: "Required payment details not provided" },
        { status: 400 }
      );
    }

    // Ensure amount is a number and greater than zero can't be a negative or floating point
    if(typeof amount !== 'number' || amount < 0) {
        return NextResponse.json(
            { status: false, error: "amount can't be negative or floating point value" },
            { status: 400 }
          );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      amount,
      return_url: "https://dev-profiles-omega.vercel.app/profile/3",
      currency, // Specify the currency
      confirm: true, // Confirm the payment immediately
    });

    return NextResponse.json({ status: true, data: paymentIntent });
  } catch (error) {
    console.log("Error creating charge:", error);
    return NextResponse.json(
      { status: false, error: "Failed to create charge" },
      { status: 500 }
    );
  }
}
