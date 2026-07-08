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
    const needsReseed = !quiz || quiz.units.length !== 5 || quiz.units.some(u => u.lessons.length !== 6);
    if (needsReseed) {
        if (quiz) {
            await Quiz.deleteOne({ name: topic });
        }
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
                                    question: "Which operator is used to start a preprocessor directive in C/C++?",
                                    options: ["$", "#", "@", "&"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "Which data type is used to store fractional numbers in C++?",
                                    options: ["int", "char", "double", "bool"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "What is the size of the 'char' data type in C++ (typically)?",
                                    options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
                                    correctAnswer: 1
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
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
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "Which loop is guaranteed to execute at least once?",
                                    options: ["for", "while", "do-while", "foreach"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which keyword is used to skip the current iteration of a loop?",
                                    options: ["break", "continue", "skip", "pass"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "What is the return type of a function that does not return a value?",
                                    options: ["int", "void", "null", "empty"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which parameter passing method copies the actual value of an argument into the formal parameter?",
                                    options: ["Pass by value", "Pass by reference", "Pass by pointer", "Pass by address"],
                                    correctAnswer: 1
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which operator is used to access members of a structure through a pointer?",
                                    options: [".", "->", "*", "&"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which keyword is used to create a class in C++?",
                                    options: ["class", "struct", "object", "define"],
                                    correctAnswer: 1
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 2,
                    heading: "Pointers & Memory Management",
                    guideBook: "Master pointer syntax, dereferencing, dynamic allocation with new/delete, and C-style versus C++ references.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "Which of the following correctly declares a pointer to an integer in C++?",
                                    options: ["int p*;", "int* p;", "pointer int p;", "int &p;"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "What operator is used to dereference a pointer to access the value?",
                                    options: ["&", "->", "*", "."],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "What is a null pointer in C/C++?",
                                    options: ["A pointer pointing to address 0", "An uninitialized pointer", "A pointer that points to a function", "A pointer pointing to multiple values"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "What is the size of a pointer on a 64-bit operating system?",
                                    options: ["2 bytes", "4 bytes", "8 bytes", "16 bytes"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which keyword is used to allocate memory dynamically on the heap in C++?",
                                    options: ["malloc", "new", "alloc", "create"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which keyword is used to release dynamically allocated memory in C++?",
                                    options: ["delete", "free", "destruct", "remove"],
                                    correctAnswer: 1
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "What happens if you allocate memory with 'new' but never delete it?",
                                    options: ["Memory leak", "Segmentation fault", "Compiler error", "Automatic garbage collection"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "What is the correct syntax to allocate a dynamic array of 10 integers in C++?",
                                    options: ["int* arr = new int(10);", "int* arr = new int[10];", "int arr = dynamic int[10];", "int* arr = malloc(10);"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "If 'arr' is an array of size 5, what does standard pointer arithmetic *(arr + 1) refer to?",
                                    options: ["First element", "Second element", "Address of the array", "Size of the array"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "If 'p' is an int pointer pointing to address 1000, what is address 'p + 1' if int is 4 bytes?",
                                    options: ["1001", "1002", "1004", "1008"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which of the following statements is true about references in C++?",
                                    options: ["They can be null", "They can be reassigned to refer to another variable", "They must be initialized when declared", "They use dereferencing operators"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which symbol is used to declare a reference variable in C++?",
                                    options: ["*", "&", "->", "ref"],
                                    correctAnswer: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 3,
                    heading: "Object-Oriented C++ (OOP)",
                    guideBook: "Learn OOP principles: classes, objects, protected visibility, constructors, inheritance, and virtual functions.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "Which access specifier makes members accessible only within the class and its derived classes?",
                                    options: ["private", "public", "protected", "friend"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "What is a constructor in C++?",
                                    options: ["A function to destroy objects", "A special member function to initialize objects", "A tool to compile class headers", "A class definition syntax"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "What is a destructor in C++?",
                                    options: ["A function to copy an object", "A special member function called when an object is destroyed", "An operator to delete classes", "A function that has arguments"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which access specifier is the default for members of a class in C++?",
                                    options: ["public", "private", "protected", "friend"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which symbol is used to inherit from a base class in C++?",
                                    options: ["extends", "inherits", ":", "implements"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which type of inheritance is NOT supported in Java but is supported in C++?",
                                    options: ["Single inheritance", "Multilevel inheritance", "Multiple inheritance", "Hierarchical inheritance"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "What does the protected access specifier do in inheritance?",
                                    options: ["Makes members invisible to everyone", "Makes members public to everyone", "Makes members accessible only to the class and its derived classes", "Prevents class from being inherited"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "What keyword is used to enable dynamic binding/polymorphism for a member function?",
                                    options: ["dynamic", "virtual", "polymorphic", "override"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "What is a pure virtual function?",
                                    options: ["A function with no arguments", "A function defined with '= 0'", "A function in a friend class", "A function that cannot be overridden"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "What is the name of the table used to resolve virtual function calls at runtime?",
                                    options: ["Symbol table", "Vtable", "Hash table", "Lookup table"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "A class containing at least one pure virtual function (= 0) is called:",
                                    options: ["Concrete class", "Static class", "Abstract class", "Friend class"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Can you instantiate an abstract class in C++?",
                                    options: ["Yes, always", "No, never", "Yes, if it has a constructor", "Yes, using the new keyword"],
                                    correctAnswer: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 4,
                    heading: "Data Structures & STL",
                    guideBook: "Learn vector arrays, FIFO queues, stack ordering, set unique storage, and search/sort STL algorithms.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "Which STL container is implemented as a contiguous dynamic array?",
                                    options: ["std::list", "std::vector", "std::deque", "std::forward_list"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which STL container represents a first-in, first-out (FIFO) structure?",
                                    options: ["std::stack", "std::queue", "std::vector", "std::map"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "Which container is a last-in, first-out (LIFO) structure?",
                                    options: ["std::queue", "std::stack", "std::list", "std::vector"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which container is implemented as a doubly linked list?",
                                    options: ["std::vector", "std::list", "std::set", "std::forward_list"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which method of std::vector returns an iterator pointing to the first element?",
                                    options: ["first()", "start()", "begin()", "front()"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which method is used to add an element to the end of a std::vector?",
                                    options: ["add()", "push_back()", "append()", "insert()"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "Which container stores unique elements sorted automatically in logarithmic time?",
                                    options: ["std::vector", "std::set", "std::list", "std::unordered_map"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which key-value associative container stores elements ordered by key?",
                                    options: ["std::unordered_map", "std::map", "std::set", "std::vector"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "What is the average time complexity for searching an element in std::unordered_map?",
                                    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "What is the average time complexity for searching in std::map?",
                                    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which template function is used to sort a vector 'v' from start to finish?",
                                    options: ["std::sort(v.begin(), v.end())", "v.sort()", "std::order(v)", "sort(v)"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "Which algorithm can be used to search for an element in a sorted container in logarithmic time?",
                                    options: ["std::find", "std::binary_search", "std::count", "std::search"],
                                    correctAnswer: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 5,
                    heading: "Advanced C/C++ Concepts",
                    guideBook: "Understand generic templates, exception throw/catch blocks, file writing streams, and modern unique smart pointers.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "What is the primary purpose of templates in C++?",
                                    options: ["To create code layouts", "To support generic programming", "To define class structures", "To compile faster"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which keyword is used to declare a template function?",
                                    options: ["generic", "template", "typename", "class"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "How are templates instantiated in C++?",
                                    options: ["At runtime", "At compile-time", "By the linker", "Manually by the programmer"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which keyword can be used interchangeably with 'typename' in a template parameter list?",
                                    options: ["struct", "class", "auto", "template"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which block is used to group code that may throw an exception in C++?",
                                    options: ["throw", "catch", "try", "finally"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "What keyword is used to raise an exception in C++?",
                                    options: ["raise", "throw", "except", "signal"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "What is the base class for standard C++ exceptions?",
                                    options: ["std::error", "std::exception", "std::throwable", "std::failure"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which standard C++ stream class is used for file writing operations?",
                                    options: ["ifstream", "ofstream", "fstream", "iostream"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "Which stream class is used to read data from a file?",
                                    options: ["ofstream", "ifstream", "fstream", "iostream"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which method is used to close an open file stream?",
                                    options: ["stop()", "close()", "exit()", "terminate()"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which smart pointer type in C++11 represents exclusive ownership of a heap resource?",
                                    options: ["std::shared_ptr", "std::unique_ptr", "std::weak_ptr", "std::auto_ptr"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which smart pointer keeps a reference count of owners?",
                                    options: ["std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "std::auto_ptr"],
                                    correctAnswer: 2
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
                                },
                                {
                                    question: "Which data type is used to store a single 16-bit Unicode character in Java?",
                                    options: ["byte", "char", "String", "short"],
                                    correctAnswer: 2
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
                                },
                                {
                                    question: "Which method is used to compare two strings lexicographically in Java?",
                                    options: ["equals()", "compare()", "compareTo()", "equalsString()"],
                                    correctAnswer: 3
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
                                },
                                {
                                    question: "Which exception is thrown when accessing an invalid array index?",
                                    options: ["NullPointerException", "ArrayIndexOutOfBoundsException", "IndexOutOfBoundsException", "ArithmeticException"],
                                    correctAnswer: 2
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
                                },
                                {
                                    question: "What keyword is used to represent the current instance of a class?",
                                    options: ["this", "super", "self", "me"],
                                    correctAnswer: 1
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
                                },
                                {
                                    question: "Which block is used to execute cleanup code regardless of exceptions?",
                                    options: ["try", "catch", "finally", "cleanup"],
                                    correctAnswer: 3
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 2,
                    heading: "Java Object-Oriented OOP",
                    guideBook: "Understand extends keyword, super parent calls, interfaces, method overloading vs overriding, and class encapsulation.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "Which keyword is used to refer to the direct parent class constructor or methods?",
                                    options: ["this", "super", "parent", "base"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which class is the ultimate superclass of all classes in Java?",
                                    options: ["Class", "Object", "System", "String"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "Does Java support multiple inheritance of classes?",
                                    options: ["Yes", "No", "Only for abstract classes", "Only using final classes"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which keyword is used to define a completely abstract type (interface) in Java?",
                                    options: ["class", "interface", "abstract", "implements"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which keyword is used by a class to use/implement an interface?",
                                    options: ["extends", "implements", "uses", "inherits"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Can an interface in Java 8 or later contain method implementations?",
                                    options: ["No, never", "Yes, using default or static keywords", "Yes, any standard method", "Yes, only abstract methods"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "Having multiple methods with the same name but different signatures in the same class is:",
                                    options: ["Method overriding", "Method overloading", "Method hiding", "Method polymorphism"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "What annotation is recommended when overriding a parent class method?",
                                    options: ["@Overload", "@Override", "@Inherit", "@Replace"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "Can you override a static method in Java?",
                                    options: ["Yes, always", "No, static methods can only be hidden", "Yes, if it is public", "Yes, using super"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which keyword is used to make a method non-overridable in subclasses?",
                                    options: ["static", "final", "private", "synchronized"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which keyword modifier prevents a class from being inherited or subclassed in Java?",
                                    options: ["static", "final", "abstract", "private"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "What happens if you declare a variable as 'final' in Java?",
                                    options: ["It cannot be accessed", "Its value cannot be changed after initialization", "It becomes static", "It is stored on the stack"],
                                    correctAnswer: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 3,
                    heading: "Java Collections Framework",
                    guideBook: "Learn ArrayList operations, HashSet unique sets, HashMap key-value mappings, and iterator element traversal.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "Which class provides a resizable-array implementation of the List interface in Java?",
                                    options: ["LinkedList", "ArrayList", "Vector", "HashSet"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which method is used to append an element to an ArrayList?",
                                    options: ["add()", "push()", "insert()", "append()"],
                                    correctAnswer: 1
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "What is the initial default capacity of an ArrayList in Java?",
                                    options: ["5", "10", "16", "20"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which method is used to retrieve an element at a specific index in an ArrayList?",
                                    options: ["get(index)", "at(index)", "element(index)", "index(index)"],
                                    correctAnswer: 1
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which Set implementation does not allow duplicate elements and does not guarantee insertion order?",
                                    options: ["TreeSet", "HashSet", "LinkedHashSet", "ArrayList"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which Set implementation maintains insertion order of elements?",
                                    options: ["HashSet", "TreeSet", "LinkedHashSet", "ArrayList"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "Which interface class represents key-value associations in Java?",
                                    options: ["HashMap", "HashSet", "TreeMap", "ArrayList"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "Which method is used to associate a key with a value in a HashMap?",
                                    options: ["add(key, value)", "put(key, value)", "set(key, value)", "insert(key, value)"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "What does a HashMap return if you call get(key) with a key that does not exist?",
                                    options: ["Throws NoSuchElementException", "Returns null", "Returns 0", "Throws NullPointerException"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which method can be used to safely get a value from a HashMap or return a default if it's missing?",
                                    options: ["get()", "getOrDefault()", "find()", "retrieve()"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "Which standard interface is used to iterate over elements of any Java Collection?",
                                    options: ["Iterator", "Iterable", "ListIterator", "Enumerator"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "Which method of the Iterator interface returns true if there are more elements?",
                                    options: ["next()", "hasNext()", "hasMore()", "checkNext()"],
                                    correctAnswer: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 4,
                    heading: "Exceptions & Multithreading",
                    guideBook: "Master the exception Throwable tree, finally blocks execution, Runnable task creation, and synchronized execution blocks.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "Which class is the ultimate root of the Java exception hierarchy?",
                                    options: ["Exception", "RuntimeException", "Throwable", "Error"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which of the following is a checked exception in Java?",
                                    options: ["NullPointerException", "ArithmeticException", "IOException", "ArrayIndexOutOfBoundsException"],
                                    correctAnswer: 3
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "What keyword is used to declare that a method might throw certain exceptions?",
                                    options: ["throw", "throws", "try", "catch"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which interface should be implemented to define a task executable by a Thread class?",
                                    options: ["Runnable", "Thread", "Callable", "Executor"],
                                    correctAnswer: 1
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which class in Java represents a thread of execution?",
                                    options: ["Thread", "Process", "Runnable", "Task"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "What is the state of a thread that has been created but not yet started?",
                                    options: ["RUNNABLE", "NEW", "BLOCKED", "TERMINATED"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "Which keyword prevents multiple threads from concurrently entering a block or method?",
                                    options: ["static", "synchronized", "volatile", "locked"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "What is a deadlock in multithreading?",
                                    options: ["A thread terminates unexpectedly", "Two or more threads are blocked forever, waiting for each other", "A thread runs out of memory", "The CPU usage reaches 100%"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "Which method is used to pause thread execution for a specified duration?",
                                    options: ["Thread.sleep()", "Thread.pause()", "Thread.wait()", "Thread.stop()"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "Which method is called on a Thread object to begin its concurrent execution?",
                                    options: ["run()", "start()", "init()", "execute()"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "What happens if you call run() directly instead of start() on a Thread object?",
                                    options: ["A new thread is started", "The run() method executes in the current thread instead of a new one", "An IllegalThreadStateException is thrown", "The thread is paused"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which keyword can be used to make a variable's updates visible to all threads immediately?",
                                    options: ["synchronized", "volatile", "transient", "final"],
                                    correctAnswer: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    unitNumber: 5,
                    heading: "Java Modern Features",
                    guideBook: "Dive into Java NIO non-blocking packets, BufferedReader lines, Lambda arrow notation, and Stream collect terminal operators.",
                    lessons: [
                        {
                            lessonNumber: 1,
                            questions: [
                                {
                                    question: "Which package provides modern File Input/Output (NIO) features in Java?",
                                    options: ["java.io", "java.nio", "java.file", "java.util"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which class is used to read text from a character-input stream with efficient buffering?",
                                    options: ["FileReader", "BufferedReader", "InputStreamReader", "Scanner"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 2,
                            questions: [
                                {
                                    question: "Which class in java.nio represents a path in the file system?",
                                    options: ["File", "Path", "Paths", "FilePath"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which class was introduced in Java 7 to utility-read all lines from a file easily?",
                                    options: ["FileReader", "Files", "BufferedReader", "Scanner"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 3,
                            questions: [
                                {
                                    question: "Which operator symbol is used to denote Java Lambda expressions?",
                                    options: ["->", "=>", "::", "::>"],
                                    correctAnswer: 1
                                },
                                {
                                    question: "What type of interfaces can be target types for lambda expressions?",
                                    options: ["Marker interfaces", "Functional interfaces", "Abstract interfaces", "Any interface"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 4,
                            questions: [
                                {
                                    question: "Which symbol is used for method references in Java?",
                                    options: [".", "->", "::", "=>"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which terminal stream operation is used to collect elements into a List collection?",
                                    options: ["collect()", "toList()", "map()", "filter()"],
                                    correctAnswer: 1
                                }
                            ]
                        },
                        {
                            lessonNumber: 5,
                            questions: [
                                {
                                    question: "Is a Java Stream operation executed lazily or eagerly by default for intermediate operations?",
                                    options: ["Eagerly", "Lazily", "Asynchronously", "Immediately"],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which Stream intermediate operation is used to transform elements from one type to another?",
                                    options: ["filter", "map", "reduce", "collect"],
                                    correctAnswer: 2
                                }
                            ]
                        },
                        {
                            lessonNumber: 6,
                            questions: [
                                {
                                    question: "An interface containing exactly one single abstract method is called a:",
                                    options: ["Marker interface", "Single interface", "Functional interface", "Abstract interface"],
                                    correctAnswer: 3
                                },
                                {
                                    question: "Which functional interface in java.util.function takes one argument and returns a boolean?",
                                    options: ["Function", "Consumer", "Predicate", "Supplier"],
                                    correctAnswer: 3
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



