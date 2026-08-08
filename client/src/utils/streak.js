export const calculateMaxStreak = (dates) => {
  if (!dates || !Array.isArray(dates) || dates.length === 0) return 0;

  const uniqueDatesSet = new Set();
  dates.forEach(d => {
    try {
      const dateStr = new Date(d).toISOString().split('T')[0];
      if (dateStr && dateStr !== 'Invalid Date') {
        uniqueDatesSet.add(dateStr);
      }
    } catch (e) {}
  });

  const sortedDates = Array.from(uniqueDatesSet).sort();
  if (sortedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
  }

  return maxStreak;
};

export const getMaxStreakDisplay = (userObj) => {
  if (!userObj || !userObj.userData || !userObj.userData.streak) return 0;
  const streakObj = userObj.userData.streak;
  const computedMax = calculateMaxStreak(streakObj.dates);
  const storedMax = streakObj.maxStreak || 0;
  const currentDays = streakObj.days || 0;
  return Math.max(currentDays, storedMax, computedMax);
};
