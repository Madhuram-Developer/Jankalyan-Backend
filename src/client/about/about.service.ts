import prisma from '../../lib/prisma.js';

export const getAppSettingsService = async () => {
  let settings = await prisma.appSettings.findUnique({
    where: { id: 'singleton' },
  });

  if (!settings) {
    // Create default settings if not exists
    settings = await prisma.appSettings.create({
      data: {
        id: 'singleton',
        description: '',
        paymentQR: '',
        bankName: '',
        ifscCode: '',
        accountNumber: '',
        accountName: '',
        videoUrl: '',
        title: '',
        upiId: '',
        TransactionNote: '',
        titleHindi: '',
        descriptionHindi: '',
        targetAmount: 0,
        collectedAmount: 0,
        totalAmount: 0,
      },
    });
  }

  return settings;
};

export const updateAppSettingsService = async (data: {
  description?: string;
  paymentQR?: string;
  bankName?: string;
  ifscCode?: string;
  accountNumber?: string;
  accountName?: string;
  videoUrl?: string;
  title?: string;
  upiId?: string;
  TransactionNote?: string;
  titleHindi?: string;
  descriptionHindi?: string;
  targetAmount?: number | null;
  collectedAmount?: number | null;
  totalAmount?: number | null;
}) => {

  return await prisma.appSettings.upsert({
    where: { id: 'singleton' },
    update: {
      ...data,
      updatedAt: new Date(),
    },
    create: {
      id: 'singleton',
      description: data.description || '',
      paymentQR: data.paymentQR || '',
      bankName: data.bankName || '',
      ifscCode: data.ifscCode || '',
      accountNumber: data.accountNumber || '',
      accountName: data.accountName || '',
      videoUrl: data.videoUrl || '',
      title: data.title || '',
      upiId: data.upiId || '',
      TransactionNote: data.TransactionNote || '',
      titleHindi: data.titleHindi || '',
      descriptionHindi: data.descriptionHindi || '',
      targetAmount: data.targetAmount ?? 0,
      collectedAmount: data.collectedAmount ?? 0,
      totalAmount: data.totalAmount ?? 0,
    },
  });
};

