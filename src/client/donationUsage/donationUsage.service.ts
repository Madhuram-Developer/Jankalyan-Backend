import prisma from '../../lib/prisma.js';
import { randomUUID } from 'crypto';

export const createDonationUsageService = async (data: {
  title: string;
  description: string;
  titleHindi: string;
  descriptionHindi: string;
  images: string[];
}) => {
  const id = randomUUID();
  return await prisma.donationUsage.create({
    data: {
      id,
      ...data,
    },
  });
};

export const getAllDonationUsagesService = async () => {
  return await prisma.donationUsage.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getDonationUsageByIdService = async (id: string) => {
  return await prisma.donationUsage.findUnique({
    where: { id },
  });
};

export const updateDonationUsageService = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    titleHindi?: string;
    descriptionHindi?: string;
    images?: string[];
  }
) => {
  return await prisma.donationUsage.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

export const deleteDonationUsageService = async (id: string) => {
  return await prisma.donationUsage.delete({
    where: { id },
  });
};