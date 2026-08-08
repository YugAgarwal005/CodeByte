import Quiz from '../models/quiz.model.js';
import { Users } from '../models/user.model.js';
import { calculateStreak, calculateMaxStreak } from '../utils/streak.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coursesPath = path.join(__dirname, '../data/courses.json');

const getCourseDataFromFile = () => {
    try {
        const raw = fs.readFileSync(coursesPath, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('Failed to read courses.json:', err);
        return {};
    }
};

export const createUnits = async (req, res, next) => {
    try {
        const { topic, unitnum, heading, guidebook } = req.body.formdata;

        // Check if the topic exists
        let existingTopic = await Quiz.findOne({ name: topic });

        if (!existingTopic) {
            // If the topic doesn't exist, create it
            existingTopic = await Quiz.create({ name: topic, units: [] });
        }
        // Check if the unit exists within the topic
        const existingUnit = existingTopic.units.find(unit => unit.unitNumber == unitnum);

        if (existingUnit) {
            // If the unit exists, update other unit data
            existingUnit.heading = heading;
            existingUnit.guideBook = guidebook;
        } else {
            // If the unit doesn't exist, create it within the topic
            existingTopic.units.push({ unitNumber: unitnum, heading: heading, guideBook: guidebook });
        }

        // Save the changes to the database
        await existingTopic.save();
        return res.json({ status: true, msg: 'Unit created or updated successfully' });
    } catch (error) {
        return res.json({ status: false, msg: 'Failed to Create or Update Unit' });
        next(error);
    }
};

export const createQuestions = async (req, res, next) => {
    try {
        const { topic, unitnum, level, question, one, two, three, four, correctoption } = req.body.formdata;

        let existingTopic = await Quiz.findOne({ name: topic });
        let existingUnit = null;
        if (existingTopic) {
            existingUnit = existingTopic.units.find(unit => unit.unitNumber == unitnum);
        }

        if (!existingUnit) {
            return res.json({ status: false, msg: ' Create Unit first before adding questions' })
        }

        // Find the lesson with the specified level in the unit
        const existingLesson = existingUnit.lessons.find(lesson => lesson.lessonNumber == level);

        // If the lesson doesn't exist, create it; otherwise, update its questions
        if (!existingLesson) {
            existingUnit.lessons.push({ lessonNumber: level, questions: [{ question, options: [one, two, three, four], correctAnswer: correctoption }] });
        } else {
            existingLesson.questions.push({ question, options: [one, two, three, four], correctAnswer: correctoption });
        }
        // Save the changes to the database
        await existingTopic.save();
        return res.json({ status: true, msg: 'Question Added to lesson successfully' });

    } catch (error) {
        return res.json({ status: false, msg: 'Failed to Create Question' });
        next(error)
    }
}

const seedCourseIfNeeded = async (topic) => {
    let quiz = await Quiz.findOne({ name: topic });
    const needsReseed = !quiz || quiz.units.length !== 5 || quiz.units.some(u => u.lessons.length !== 6);
    if (needsReseed) {
        if (quiz) {
            await Quiz.deleteOne({ name: topic });
        }
        const courseData = getCourseDataFromFile();
        const units = courseData[topic] || courseData['java'] || [];

        quiz = await Quiz.create({
            name: topic,
            units: units
        });
    }
    return quiz;
};

export const getQuestions = async (req, res, next) => {
    try {
        const { unitnum, levelnum } = req.params;
        const course = req.query.course;
        const id = req.query.id;

        const quizDoc = await seedCourseIfNeeded(course);

        const Topic = await Quiz.findOne({ name: course });
        if (!Topic) {
            return res.status(404).json({ message: "Course topic not found" });
        }
        const Unit = Topic.units.find(unit => unit.unitNumber == unitnum);
        if (!Unit) {
            return res.status(404).json({ message: "Unit not found" });
        }
        const Lesson = Unit.lessons.find(lesson => lesson.lessonNumber == levelnum);
        if (!Lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const quiz = {
            questions: Lesson.questions.map(question => ({
                question: question.question,
                choices: question.options,
                correctAnswer: question.correctAnswer,
            })),
        }

        //locked or unlocked level check
        let User = await Users.findOne({ _id: id, 'courseProgress.courseName': course });
        if (!User) {
            User = await Users.findOne({ _id: id });
            if (User) {
                const hasCourse = User.courseProgress && User.courseProgress.some(c => c.courseName === course);
                if (!hasCourse) {
                    await Users.updateOne(
                        { _id: id },
                        {
                            $push: {
                                courseProgress: {
                                    courseName: course,
                                    units: quizDoc.units.map(unit => ({
                                        unitNumber: unit.unitNumber,
                                        level: 0,
                                    })),
                                },
                            },
                        }
                    );
                    User = await Users.findOne({ _id: id });
                }
            }
        }

        if (!User) {
            return res.json(quiz);
        }

        const progress = User.courseProgress.find(c => c.courseName === course);
        if (progress) {
            const unit = progress.units.find(u => u.unitNumber == unitnum);
            if (unit && levelnum > unit.level + 1) {
                return res.json(null);
            }
        }

        return res.json(quiz);
    } catch (error) {
        next(error)
    }
}

export const getcourse = async (req, res, next) => {
    try {
        const { topic, id } = req.params;

        const quiz = await seedCourseIfNeeded(topic);

        const Topic = await Quiz.findOne({ name: topic }, { 'units.lessons.questions': 0 }).lean();
        // Search for the user with the given course name
        let user = await Users.findOne({ _id: id, 'courseProgress.courseName': topic });

        if (!user) {
            user = await Users.findOne({ _id: id });
            if (user) {
                const hasCourse = user.courseProgress && user.courseProgress.some(course => course.courseName === topic);
                if (!hasCourse) {
                    await Users.updateOne(
                        { _id: id },
                        {
                            $push: {
                                courseProgress: {
                                    courseName: topic,
                                    units: quiz.units.map(unit => ({
                                        unitNumber: unit.unitNumber,
                                        level: 0,
                                    })),
                                },
                            },
                        }
                    );
                }
            }
        } else {
            // If the user has the course, update the progress for new units
            const existingUnits = user.courseProgress.find(course => course.courseName === topic)?.units || [];

            for (const unit of quiz.units) {
                const existingUnit = existingUnits.find(userUnit => userUnit.unitNumber === unit.unitNumber);

                if (!existingUnit) {
                    await Users.updateOne(
                        { _id: id, 'courseProgress.courseName': topic },
                        {
                            $push: {
                                'courseProgress.$.units': {
                                    unitNumber: unit.unitNumber,
                                    level: 0,
                                },
                            },
                        }
                    );
                }
            }
        }

        // Retrieve and send the user's courseProgress
        const updatedUser = await Users.findOne({ _id: id });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let progress = updatedUser.courseProgress.find(course => course.courseName === topic);
        if (!progress) {
            progress = {
                courseName: topic,
                units: quiz.units.map(unit => ({
                    unitNumber: unit.unitNumber,
                    level: 0,
                }))
            };
        }

        const combineCourseData = (Topic, progress) => {
            const updatedUnits = Topic.units.map(courseUnit => {
                const progressUnit = progress.units.find(progressUnit => progressUnit.unitNumber === courseUnit.unitNumber);
                return {
                    ...courseUnit,
                    level: progressUnit ? progressUnit.level : 0, // Adding progress level data to the courseUnit or default to 0
                };
            });
            // Return the updated Topic object
            return {
                ...Topic,
                units: updatedUnits,
            };
        };
        const CombinedData = combineCourseData(Topic, progress);
        return res.json(CombinedData);
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const submitResults = async (req, res, next) => {
    try {
        const { xp, noofques, level, gems, unitnum, topic, id, totalques } = JSON.parse(req.body.postDataString);
        
        const quizDoc = await seedCourseIfNeeded(topic);

        let User = await Users.findOne({ _id: id, 'courseProgress.courseName': topic });
        if (!User) {
            User = await Users.findOne({ _id: id });
            if (User) {
                const hasCourse = User.courseProgress && User.courseProgress.some(c => c.courseName === topic);
                if (!hasCourse) {
                    await Users.updateOne(
                        { _id: id },
                        {
                            $push: {
                                courseProgress: {
                                    courseName: topic,
                                    units: quizDoc.units.map(unit => ({
                                        unitNumber: unit.unitNumber,
                                        level: 0,
                                    })),
                                },
                            },
                        }
                    );
                    User = await Users.findOne({ _id: id });
                }
            }
        }

        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }

        const progress = User.courseProgress.find(course => course.courseName === topic);
        if (progress) {
            const unit = progress.units.find(unit => unit.unitNumber == unitnum);
            if (unit) {
                if ((unit.level + 1 == level) && noofques > 0) {
                    unit.level += 1;
                }
            }
        }

        // Add today's date to streak.dates array if not already present
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000;
        const today = (new Date(now.getTime() + offset)).toISOString().split('T')[0];

        if (!User.userData) {
            User.userData = {
                xp: 100,
                gems: 200,
                correctQues: 0,
                streak: { dates: [], days: 0 },
                dailyChallenges: { xp: 0, correctQuestions: 0, lessonsNumber: 0, date: today }
            };
        }
        if (!User.userData.streak) {
            User.userData.streak = { dates: [], days: 0 };
        }
        if (!User.userData.streak.dates) {
            User.userData.streak.dates = [];
        }
        if (!User.userData.dailyChallenges) {
            User.userData.dailyChallenges = { xp: 0, correctQuestions: 0, lessonsNumber: 0, date: today };
        }

        if (!User.userData.streak.dates.some(date => {
            try {
                return new Date(date).toISOString().split('T')[0] === today;
            } catch (e) {
                return false;
            }
        })) {
            User.userData.streak.dates.push(today);
        }

        User.userData.streak.days = calculateStreak(User.userData.streak.dates);
        User.userData.streak.maxStreak = calculateMaxStreak(User.userData.streak.dates);

        User.userData.xp += xp;
        User.userData.dailyChallenges.xp += xp;
        User.userData.dailyChallenges.correctQuestions += noofques;
        if (totalques == noofques) {
            User.userData.dailyChallenges.lessonsNumber += 1;
        }
        User.userData.gems += gems;
        User.userData.correctQues += noofques;
        // Save the changes to the database
        await User.save();
        res.send({ msg: "result submission successful" });
    } catch (error) {
        console.error("submitResults error:", error);
        next(error)
    }
}



