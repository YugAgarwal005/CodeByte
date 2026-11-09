import Quiz from '../models/quiz.model.js';
import { Users } from '../models/user.model.js';
import { awardXPAndStreak } from '../utils/gamification.js';
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
    const courseData = getCourseDataFromFile();
    const fileUnits = courseData[topic] || courseData['java'] || [];

    const needsReseed = !quiz || quiz.units.length !== 5 || quiz.units.some(u => u.lessons.length !== 6);
    if (needsReseed) {
        if (quiz) {
            await Quiz.deleteOne({ name: topic });
        }
        quiz = await Quiz.create({
            name: topic,
            units: fileUnits
        });
        return quiz;
    }

    // Ensure all existing units retain their codingExercise from courses.json
    let modified = false;
    for (const unit of quiz.units) {
        const fileUnit = fileUnits.find(fu => fu.unitNumber === unit.unitNumber);
        if (fileUnit?.codingExercise && unit.codingExercise !== fileUnit.codingExercise) {
            unit.codingExercise = fileUnit.codingExercise;
            modified = true;
        }
    }
    if (modified) {
        await quiz.save();
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

            // Standard lesson-level gate: can't jump more than one level ahead
            if (unit && levelnum > unit.level + 1) {
                return res.json(null);
            }

            // Coding-exercise gate: the PREVIOUS unit's exercise must be solved
            // before lessons in the CURRENT unit are accessible (unitnum > 1).
            if (unitnum > 1) {
                const prevUnitProgress = progress.units.find(u => u.unitNumber == unitnum - 1);
                const prevUnitCourse   = Topic.units.find(u => u.unitNumber == unitnum - 1);
                if (
                    prevUnitCourse?.codingExercise &&   // previous unit has a coding exercise
                    prevUnitProgress &&
                    !prevUnitProgress.exerciseSolved    // and the user hasn't solved it yet
                ) {
                    return res.json(null); // lock the entire current unit
                }
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
                    // Progress fields merged into the course structure:
                    level:          progressUnit?.level          ?? 0,
                    exerciseSolved: progressUnit?.exerciseSolved ?? false, // Phase 2
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

        // ── Ensure the user has a courseProgress entry for this topic ────────────
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

        // ── Advance lesson level if the user just completed it ───────────────────
        const progress = User.courseProgress.find(course => course.courseName === topic);
        if (progress) {
            const unit = progress.units.find(unit => unit.unitNumber == unitnum);
            if (unit) {
                if ((unit.level + 1 == level) && noofques > 0) {
                    unit.level += 1;
                }
            }
        }

        // ── Update gems (quiz-specific reward; not part of shared helper) ─────────
        User.userData.gems = (User.userData.gems || 0) + gems;
        await User.save();

        // ── Award XP + streak via shared helper ─────────────────────────────────
        // lessonsCompleted = 1 only if the user answered ALL questions correctly
        await awardXPAndStreak(id, xp, noofques, totalques == noofques ? 1 : 0);

        res.send({ msg: "result submission successful" });
    } catch (error) {
        console.error("submitResults error:", error);
        next(error);
    }
};

/**
 * setExercise (admin only)
 * POST /api/quiz/setexercise
 *
 * Attaches a coding problem (by slug) to a specific unit in a course.
 * Body: { topic, unitNumber, problemSlug }
 * Pass problemSlug as null to detach an existing exercise.
 */
export const setExercise = async (req, res, next) => {
    try {
        const { topic, unitNumber, problemSlug } = req.body;
        if (!topic || !unitNumber) {
            return res.status(400).json({ status: false, message: 'topic and unitNumber are required' });
        }

        const quiz = await Quiz.findOne({ name: topic });
        if (!quiz) {
            return res.status(404).json({ status: false, message: `Course "${topic}" not found` });
        }

        const unit = quiz.units.find(u => u.unitNumber == unitNumber);
        if (!unit) {
            return res.status(404).json({ status: false, message: `Unit ${unitNumber} not found in course "${topic}"` });
        }

        // null means "remove the exercise"
        unit.codingExercise = problemSlug || null;
        await quiz.save();

        return res.json({
            status: true,
            message: problemSlug
                ? `Coding exercise "${problemSlug}" attached to Unit ${unitNumber} of "${topic}"`
                : `Coding exercise detached from Unit ${unitNumber} of "${topic}"`,
        });
    } catch (error) {
        next(error);
    }
};
