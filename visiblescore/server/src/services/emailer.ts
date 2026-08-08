import nodemailer from "nodemailer";
import fs from "node:fs";

export interface SendReportEmailArgs {
  to: string;
  clientName: string;
  overallScore: number;
  pdfPath: string;
}

export interface SendResult {
  sent: boolean;
  reason?: string;
}

export async function sendReportEmail(args: SendReportEmailArgs): Promise<SendResult> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`[emailer] SMTP not configured — skipping send. Report ready at ${args.pdfPath}`);
    return { sent: false, reason: "SMTP not configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS in .env." };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: SMTP_FROM ?? SMTP_USER,
    to: args.to,
    subject: `${args.clientName} — AI Search Visibility Report (${args.overallScore}%)`,
    text: `Hi,\n\nAttached is the latest AI search visibility report for ${args.clientName}, showing an overall visibility score of ${args.overallScore}%.\n\nBest,\nYour team`,
    attachments: [{ filename: "ai-visibility-report.pdf", content: fs.createReadStream(args.pdfPath) }],
  });

  return { sent: true };
}
