import Quiz from '../models/quiz.model.js';
import { Users } from '../models/user.model.js';

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
    if (!quiz) {
        let units = [];
        if (topic === "c&c++") {
            units = [
                {
                    unitNumber: 1,
                    heading: "C & C++ Basics",
                    guideBook: "Learn C & C++ basic syntax, data types, control flow, loops, functions, and standard libraries.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "What is the correct syntax to output 'Hello World' in C++?",
                                    options: ["cout << 'Hello World';", "printf('Hello World');", "std::cout << \"Hello World\";", "System.out.println(\"Hello World\");"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which of the following is the address-of operator in C/C++?",
                                    options: ["*", "&", "%", "&&"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "How do you start an 'if' statement in C++?",
                                    options: ["if (x > y)", "if x > y then:", "if x > y", "if (x > y) then"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "Which expression represents logical AND in C++?",
                                    options: ["&", "and", "&&", "||"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which loop is guaranteed to execute at least once?",
                                    options: ["for", "while", "do-while", "foreach"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "What is the return type of a function that does not return a value?",
                                    options: ["int", "void", "null", "empty"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "Which operator is used to access members of a structure through a pointer?",
                                    options: [".", "->", "*", "&"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which keyword is used to create a class in C++?",
                                    options: ["class", "struct", "object", "define"],
                                    correctAnswer: 1
                                }
                            ]
                        }
                    ]
                }
            ];
        } else {
            // Default "java" or any other topic
            units = [
                {
                    unitNumber: 1,
                    heading: "Java Fundamentals",
                    guideBook: "Learn Java basic concepts, class definitions, JVM, objects, loops, and basic exception handling.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "What is the entry point of a Java program?",
                                    options: ["public static void main(String[] args)", "void main()", "public void start()", "init()"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "Which tool is used to compile Java code?",
                                    options: ["java", "javac", "javap", "javadoc"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "Which of the following is not a primitive data type in Java?",
                                    options: ["int", "double", "String", "boolean"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "How do you check for equality between two objects in Java?",
                                    options: ["==", "equals()", "===", "compare()"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "How do you find the length of an array named 'arr' in Java?",
                                    options: ["arr.size()", "arr.length()", "arr.length", "length(arr)"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "Which keyword is used to inherit a class in Java?",
                                    options: ["implements", "extends", "inherits", "using"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which block is used to catch exceptions in Java?",
                                    options: ["try", "catch", "finally", "throw"],
                                    correctAnswer: 2
                                }
                            ]
                        }
                    ]
                }
            ];
        }

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
            User.userData.streak.days += 1;
        }

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



