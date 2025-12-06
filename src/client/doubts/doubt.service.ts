import prisma from '../../lib/prisma.js';
import type { CreateDoubtData } from './doubt.types.js';
import type { Prisma } from '../../lib/prisma.js';

export const createDoubtService = async (data: CreateDoubtData) => {

  const { fullName, dob, phoneNumber, gender, questionCategory, questionDescription, location, ipAddress, deviceInfo, requestTime } = data;

  const requestDate = requestTime ? new Date(requestTime) : new Date();

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    let user = await tx.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      user = await tx.user.create({
        data: {
          phoneNumber,
          fullName: fullName || '',
          dateOfBirth: dob ? new Date(dob) : null,
          gender: gender || null,
          location: location || null,
          createdAt: requestDate,
          updatedAt: requestDate,
        }
      });
    }

    const query = await tx.query.create({
      data: {
        userId: user.id,
        category: questionCategory,
        question: questionDescription,
        answer: '',
        location: location || null,
        ipAddress: ipAddress || null,
        deviceInfo: deviceInfo || null,
        createdAt: requestDate,
        updatedAt: requestDate,
      }
    });

    return { userId: user.id, queryId: query.id };
  });
};

export const getAllDoubtsService = async (page: number = 1, limit: number = 10, filters?: { date?: string | undefined; status?: string | undefined; category?: string | undefined }) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters?.date) {
    const filterDate = new Date(filters.date);
    const startOfDay = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
    console.log('Start of Day:', startOfDay);
    where.createdAt = {
      gte: startOfDay,
      lt: new Date(),
    };
  }

  if (filters?.status) {
    if (filters.status === 'pending') {
      where.answer = '';
    } else if (filters.status === 'answered') {
      where.NOT = { answer: '' };
    }
  }

  if (filters?.category) {
    where.category = filters.category;
  }

  const [doubts, total] = await Promise.all([
    prisma.query.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            fullName: true,
            dateOfBirth: true,
            gender: true,
            phoneNumber: true,
          }
        }
      }
    }),
    prisma.query.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const formattedDoubts = doubts.map((doubt: any) => ({
    id: doubt.id,
    fullName: doubt.user.fullName,
    dob: doubt.user.dateOfBirth,
    gender: doubt.user.gender,
    phoneNumber: doubt.user.phoneNumber,
    question: doubt.question,
    category: doubt.category,
    answer: doubt.answer,
    createdAt: doubt.createdAt,
  }));

  return {
    data : formattedDoubts,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getDoubtByIdService = async (id: string) => {
  return await prisma.query.findUnique({
    where: { id },
  });
};

export const addAnswerService = async (id: string, answer: string) => {
  return await prisma.query.update({
    where: { id },
    data: { answer },
  });
};

export const getDoubtsByIdsService = async (ids: { userId: string; queryId: string }[]) => {
  const results = await Promise.all(
    ids.map(async ({ userId, queryId }) => {
      const query = await prisma.query.findFirst({
        where: { id: queryId, userId },
        select: {
          id: true,
          question: true,
          answer: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              fullName: true,
              phoneNumber: true,
            },
          },
        },
      });
      return query ? { ...query, userId, queryId } : null;
    })
  );

  return results.filter(Boolean);
};