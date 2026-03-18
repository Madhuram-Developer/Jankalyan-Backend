import prisma from '../../lib/prisma.js';

export const increaseJaapCountService = async (identifier: string, isPhone: boolean, deviceId: string, name?: string, city?: string, location?: string, ipAddress?: string, deviceInfo?: string, requestTime?: string) => {

  const whereClause = isPhone ? { phone: identifier } : { deviceId: identifier };
  const existing = await prisma.jaapCount.findFirst({
    where: {
      OR: [
        { phone: identifier },
        { deviceId: identifier }
      ]
    },
  });

  if (existing) {
    const updateData: any = {
      jaapCount: { increment: 5 },
      updatedAt: requestTime,
    };
    if (name !== undefined) updateData.name = name;
    if (city !== undefined) updateData.city = city;
    if (location !== undefined) updateData.location = location || null;
    if (ipAddress !== undefined) updateData.ipAddress = ipAddress;
    if (deviceInfo !== undefined) updateData.deviceInfo = deviceInfo;

    return await prisma.jaapCount.update({
      where: { id: existing.id },
      data: updateData,
    });
  } else {
    const createData: any = {
      deviceId,
      jaapCount: 5,
      createdAt: requestTime,
      updatedAt: requestTime,
    };
    if (isPhone) {
      createData.phone = identifier;
    }
    if (name !== undefined) createData.name = name;
    if (city !== undefined) createData.city = city;
    if (location !== undefined) createData.location = location || null;
    if (ipAddress !== undefined) createData.ipAddress = ipAddress;
    if (deviceInfo !== undefined) createData.deviceInfo = deviceInfo;

    return await prisma.jaapCount.create({
      data: createData,
    });
  }
};
