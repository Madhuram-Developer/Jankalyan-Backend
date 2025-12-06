import prisma from '../../lib/prisma.js';
import type { AnalyticsResponse } from './analytics.types.js';

export const getAnalyticsService = async (): Promise<AnalyticsResponse> => {
  // Total questions count
  const totalQuestions = await prisma.query.count();

  // Total answered questions (assuming answered if answer is not empty)
  const totalAnsweredQuestions = await prisma.query.count({
    where: {
      answer: {
        not: '',
      },
    },
  });

  // Age range counts
  const queries = await prisma.query.findMany({
    where: {
      dateOfBirth: {
        not: null,
      },
    },
    select: {
      phoneNumber: true,
      dateOfBirth: true,
    },
  });

  // Get unique users by phoneNumber
  const uniqueUsers = new Map<string, Date>();
  queries.forEach(query => {
    if (query.dateOfBirth && !uniqueUsers.has(query.phoneNumber)) {
      uniqueUsers.set(query.phoneNumber, query.dateOfBirth);
    }
  });

  const users = Array.from(uniqueUsers.values()).map(dateOfBirth => ({ dateOfBirth }));

  const ageRangeCounts = calculateAgeRangeCounts(users);

  return {
    totalQuestions,
    totalAnsweredQuestions,
    ageRangeCounts,
  };
};

const calculateAgeRangeCounts = (users: { dateOfBirth: Date | null }[]): { range: string; count: number }[] => {
  const ranges = [
    { min: 13, max: 17, label: '13-17' },
    { min: 18, max: 24, label: '18-24' },
    { min: 25, max: 34, label: '25-34' },
    { min: 35, max: 44, label: '35-44' },
    { min: 45, max: 54, label: '45-54' },
    { min: 55, max: 64, label: '55-64' },
    { min: 65, max: Infinity, label: '65+' },
  ];

  const counts = ranges.map(range => ({ range: range.label, count: 0 }));

  users.forEach(user => {
    if (!user.dateOfBirth) return;
    const age = new Date().getFullYear() - user.dateOfBirth.getFullYear();
    const rangeIndex = ranges.findIndex(r => age >= r.min && age <= r.max);
    if (rangeIndex >= 0 && rangeIndex < counts.length) {
      counts[rangeIndex]!.count++;
    }
  });

  return counts;
};