import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function identifyThread(phoneNumber: string) {
  return prisma.conversation.findFirst({
    where: { phoneNumber },
  });
}

export async function identifyPhoneNumber(threadId: string) {
  return prisma.conversation.findFirst({
    where: { threadId },
  });
}

export async function associateThread(phoneNumber: string, threadId: string) {
  return prisma.conversation.create({
    data: { phoneNumber, threadId },
  });
}
