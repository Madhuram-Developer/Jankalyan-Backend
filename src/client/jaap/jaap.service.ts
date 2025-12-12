import { create } from 'domain';
import prisma from '../../lib/prisma.js';

export const increaseJaapCountService = async (deviceId: string, location?: string, ipAddress?: string, deviceInfo?: string, requestTime? : string) => {

    console.log('Increasing Jaap Count for Device ID:', deviceId, location, ipAddress, deviceInfo, requestTime);
  const existing = await prisma.jaapCount.findUnique({
    where: { deviceId },
  });

  if (existing) {
    const updateData: any = {
      jaapCount: { increment: 1 },
      updatedAt: requestTime,
    };
    if (location !== undefined) updateData.location = location || null;
    if (ipAddress !== undefined) updateData.ipAddress = ipAddress;
    if (deviceInfo !== undefined) updateData.deviceInfo = deviceInfo;

    return await prisma.jaapCount.update({
      where: { deviceId },
      data: updateData,
    });
  } else {
    const createData: any = {
      deviceId,
      jaapCount: 1,
      createdAt: requestTime,
      updatedAt: requestTime,
    };
    if (location !== undefined) createData.location = location || null;
    if (ipAddress !== undefined) createData.ipAddress = ipAddress;
    if (deviceInfo !== undefined) createData.deviceInfo = deviceInfo;

    return await prisma.jaapCount.create({
      data: createData,
    });
  }
};
