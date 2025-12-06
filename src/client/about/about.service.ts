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
  videoUrl?: string;
  title?: string;
}) => {
    console.log('Updating App Settings with data:', data);
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
      videoUrl: data.videoUrl || '',
      title: data.title || '',
    },
  });
};