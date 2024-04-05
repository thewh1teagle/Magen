import { PrismaClient } from "@prisma/client";
import { test } from "tap";
import { sendPush } from "./firebase";

const prisma = new PrismaClient();

test("send push", async (t) => {
  const users = await prisma.user.findMany({});
  const tokens = users.map((u) => u.fcm_token);
  await sendPush({ data: { hello: "world" }, token: tokens });
});
