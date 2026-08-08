export const calculateStreak = (dates) => {
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

    if (uniqueDatesSet.size === 0) return 0;

    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;
    const todayStr = (new Date(now.getTime() + offset)).toISOString().split('T')[0];

    const yesterday = new Date(now.getTime() + offset);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const hasToday = uniqueDatesSet.has(todayStr);
    const hasYesterday = uniqueDatesSet.has(yesterdayStr);

    if (!hasToday && !hasYesterday) {
        return 0;
    }

    let checkDate = new Date(hasToday ? todayStr : yesterdayStr);
    let streak = 0;

    while (true) {
        const curStr = checkDate.toISOString().split('T')[0];
        if (uniqueDatesSet.has(curStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

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
