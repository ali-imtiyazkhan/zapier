import "dotenv/config";
import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import nodemailer from "nodemailer";
import twilio from "twilio";

/* ------------------ DATABASE ------------------ */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/* ------------------ KAFKA ------------------ */

const kafka = new Kafka({
  clientId: "zap-worker",
  brokers: ["localhost:9092"],
});

const TOPIC = "zap-runs";
const GROUP_ID = "zap-worker-group-v3";

/* ------------------ HELPERS ------------------ */

/**
 * Resolves {{variable.path}} from metadata
 */
function resolve(template: string, data: unknown): string {
  if (!template || typeof data !== "object" || data === null) return "";

  return template.replace(/{{(.*?)}}/g, (_: string, path: string) => {
    return (
      path
        .trim()
        .split(".")
        .reduce<any>((acc, key: string) => acc?.[key], data as any) ?? ""
    );
  });
}

/* ------------------ EMAIL (NODEMAILER) ------------------ */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(payload: {
  to: string;
  subject: string;
  body: string;
}) {
  if (!payload.to) throw new Error("Email recipient missing");

  await transporter.sendMail({
    from: `"Zapier Clone" <${process.env.EMAIL_USER}>`,
    to: payload.to,
    subject: payload.subject || "Zap Notification",
    html: payload.body || "<p>No content</p>",
  });

  console.log("📧 Email sent to:", payload.to);
}

/* ------------------ SMS (TWILIO) ------------------ */

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

async function sendSms(payload: { to: string; message: string }) {
  if (!payload.to) throw new Error("SMS recipient missing");

  const res = await twilioClient.messages.create({
    body: payload.message || "Zap notification",
    from: process.env.TWILIO_PHONE,
    to: payload.to,
  });

  console.log("📩 SMS sent:", res.sid);
}

/* ------------------ WORKER ------------------ */

async function startWorker() {
  const consumer = kafka.consumer({ groupId: GROUP_ID });

  await consumer.connect();
  await consumer.subscribe({
    topic: TOPIC,
    fromBeginning: false,
  });

  console.log("⚙️ Worker connected");

  await consumer.run({
    autoCommit: false,

    eachMessage: async ({ topic, partition, message }) => {
      const raw = message.value?.toString();
      if (!raw) return;

      console.log("📨 Kafka message:", raw);

      const { zapRunId } = JSON.parse(raw);

      const zapRun = await prisma.zapRun.findUnique({
        where: { id: zapRunId },
        include: {
          zap: {
            include: {
              actions: {
                orderBy: { order: "asc" },
                include: { availableAction: true },
              },
            },
          },
        },
      });

      if (!zapRun || zapRun.executed) {
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);
        return;
      }

      try {
        const metadata = zapRun.metadata;
        console.log("🧩 Metadata:", metadata);

        // Execute actions in sequence
        for (const action of zapRun.zap.actions) {
          const config = (action.config ?? {}) as Record<string, any>;
          const actionName = action.availableAction.name.toLowerCase();

          console.log(`▶ Executing: ${action.availableAction.name}`, config);

          /* -------- EMAIL ACTION -------- */
          if (actionName.includes("email")) {
            await sendEmail({
              to: resolve(config.to, metadata),
              subject: resolve(config.subject, metadata),
              body: resolve(config.body, metadata),
            });
          }

          /* -------- SMS ACTION -------- */
          if (actionName.includes("sms")) {
            await sendSms({
              to: resolve(config.to, metadata),
              message: resolve(config.message, metadata),
            });
          }
        }

        /* ------------------ UPDATE STATUS ------------------ */

        await prisma.zapRun.update({
          where: { id: zapRunId, executed: false },
          data: { executed: true },
        });

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString(),
          },
        ]);

        console.log(`✅ ZapRun ${zapRunId} executed successfully`);
      } catch (err) {
        console.error("❌ Worker execution error:", err);
        // Don't commit offset if it's a transient error? 
        // For now, we'll log it. In production, you'd want a dead-letter queue.
      }
    },
  });
}

/* ------------------ START ------------------ */

startWorker().catch((err) => {
  console.error("❌ Worker crashed:", err);
  process.exit(1);
});
