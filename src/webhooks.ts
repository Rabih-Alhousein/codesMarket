import express from "express";
import nodemailer from "nodemailer";
import type Stripe from "stripe";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";
import { getPayloadClient } from "./get-payload";
import { stripe } from "./lib/stripe";
import { Product } from "./payload-types";
import { WebhookRequest } from "./server";

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  service: "gmail",
  requireTLS: true,
  secure: false,
  port: 578,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  // make sure the request is from stripe
  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`);
  }

  // update order to isPaid: true
  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users;

    if (!user) return res.status(404).json({ error: "No such user exists." });

    const { docs: orders } = await payload.find({
      collection: "orders",
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    const [order] = orders;

    if (!order) return res.status(404).json({ error: "No such order exists." });

    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // send receipt
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Thanks for your order! This is your receipt.",
      html: ReceiptEmailHtml({
        date: new Date(),
        email: user.email,
        orderId: session.metadata.orderId,
        products: order.products as Product[],
      }),
    };

    transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res.status(200).json({
          data,
        });
      }
    });
  }

  return res.status(200).send();
};
