import { Transporter, createTransport } from "nodemailer";
import { MailParams } from "../types/Mail";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class Mailer {
  private static instance: Mailer;
  private transporter!: Transporter;

  private constructor() {}

  static getInstance() {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer();
    }
    return Mailer.instance;
  }

  async createConnection() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_TLS === "yes" ? true : false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    } as SMTPTransport.Options);
  }

  async sendMail(options: MailParams) {
    return await this.transporter.sendMail({
      from: `${process.env.SMTP_SENDER_NAME} ${
        process.env.SMTP_SENDER_EMAIL || options?.from
      }`,
      to: options?.to,
      cc: options?.cc,
      bcc: options?.bcc,
      subject: options?.subject,
      text: options?.text,
      html: options?.html,
    });
  }
}
