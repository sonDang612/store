/* eslint-disable class-methods-use-this */
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import fs from "fs";
import { convert } from "html-to-text";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { Order } from "../types/order";
import { User } from "../types/user";

dayjs.extend(advancedFormat);
type PaymentMethod = "cash" | "zaloPay" | "MoMo" | "paypal" | "stripe";
export default class Email {
  to: string;

  name: string;

  url: string;

  from: string;

  constructor(user: any, url: string) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = process.env.EMAIL;
  }

  async newTransport(options: SMTPTransport.Options = {}) {
    // const tranporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.PASSWORD,
    //   },
    // });
    // return tranporter;

    return nodemailer.createTransport({
      host: options.host || "smtp.office365.com", // Office 365 server
      port: options.port || 587, // secure SMTP
      secure: options.secure || false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: options.tls || { ciphers: "SSLv3" },
    });
  }

  // Send the actual email
  async send(subject: string, html: string) {
    const mailOptions: Mail.Options = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    const transporter = await this.newTransport();
    return transporter.sendMail(mailOptions);
  }

  async sendPasswordReset() {
    const html = (
      await fs.promises.readFile(
        "public/emailTemplate/resetPassword.html",
        "utf8",
      )
    )
      .replace("{{name}}", this.name)
      .replace("{{url}}", this.url)
      .replace("{{rootURL}}", process.env.ROOT_URL);
    return this.send("Your password reset (valid for only 10 minutes)", html);
  }

  async sendConfirmOrder(user: User, order: Order) {
    let orderProducts = "";
    const orderProduct = await fs.promises.readFile(
      "public/emailTemplate/orderProduct.html",
      "utf8",
    );
    const { orderItems } = order;
    orderItems.forEach((item) => {
      orderProducts += orderProduct
        .replace("{{productName}}", item.name)
        .replace("{{productPrice}}", `$ ${item.price.toString()}`)
        .replace("{{productQuantity}}", item.quantity.toString())
        .replace(
          "{{productTotal}}",
          `$ ${(+item.price * +item.quantity).toString()}`,
        );
    });
    const method = order.paymentMethod;
    let paymentMethod = method;
    if (method === "cash") {
      paymentMethod = "Cash payment on delivery";
    } else if (method === "paypal") {
      paymentMethod = "Paypal";
    }

    const html = (
      await fs.promises.readFile("public/emailTemplate/orderEmail.html", "utf8")
    )
      .replace(/{{orderId}}/g, order._id.toString())
      .replace(
        /{{orderCreated}}/g,
        dayjs(order.createdAt).format("dddd, MMMM D, YYYY HH:mm:ss"),
        // dayjs(order.createdAt)
        //   .format("kk:mm - DD/MM/YYYY")
        //   .replace("24:", "00:"),
      )
      .replace(/{{customerName}}/g, user.name)
      .replace(/{{userName}}/g, user.name)
      .replace(/{{userEmail}}/g, user.email)
      .replace(/{{userPhone}}/g, user.phone)
      .replace(/{{userAddressName}}/g, order.paymentResult.receipt_name)
      .replace(/{{userAddressEmail}}/g, order.paymentResult.receipt_email)
      .replace(/{{userAddressDetail}}/g, order.address)
      .replace(/{{userAddressPhone}}/g, order.phone)
      .replace(/{{paymentMethod}}/g, paymentMethod)
      .replace(/{{orderProducts}}/g, orderProducts)
      .replace(/{{totalPrice}}/g, `$ ${order.totalPrice.toString()}`)
      .replace(
        /{{discountPrice}}/g,
        `${
          order.discountPrice > 0
            ? `-$ ${order.discountPrice.toString()}`
            : "$ 0"
        }`,
      )
      .replace(/{{shippingPrice}}/g, `$ ${order.shippingPrice.toString()}`)
      .replace(/{{total}}/g, `$ ${order.total.toString()}`)
      .replace(/{{orderDetailUrl}}/g, this.url);
    // await fs.promises.writeFile("aa.html", html);
    return this.send(
      `Order confirmation
    #${order._id}`,
      html,
    );
  }
}
