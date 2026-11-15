// Chapters added to cover the full Robotics & AI syllabus for Classes 9–11.
// Keyed by class → subject id; appended to the end of each subject.
export const NEW_LESSONS = {
  class_9: {
    robotics: [
      { id: 'c9_r_14', title: 'Robot Anatomy', subject: 'Robotics', difficulty: 'Intermediate', readingTime: 16,
        objectives: ['Name the main parts of a robot arm and a mobile robot', 'Explain the job of each part', 'Relate robot parts to the human body'],
        theory: `What is Robot Anatomy?
Robot anatomy is the study of the physical parts of a robot and how they are arranged and connected — just as human anatomy studies bones, muscles and organs. Knowing the anatomy helps you understand what a robot can reach, how it moves and what it can carry.

The Manipulator (Arm):
The manipulator is the arm of the robot. It is a chain of rigid links joined by joints. Each joint is moved by an actuator (motor). The manipulator is divided into:
• Base — the fixed part bolted to the floor or a table.
• Arm (body) — the big links (upper arm and forearm) that move the wrist to the right position.
• Wrist — two or three small joints near the end that point (orient) the tool in the right direction.
• End-effector — the tool fixed to the wrist: a gripper, suction cup, welding torch, spray gun or screwdriver.

Joints and Links:
Links are the rigid "bones"; joints are the movable connections. Most industrial arms use revolute (rotating) joints, named after the human arm: waist, shoulder, elbow, wrist.

Drives (Actuators):
The drive system moves the joints. It can be electric (servo/stepper motors), hydraulic (oil pressure, very strong) or pneumatic (compressed air, fast).

Controller:
The controller is the robot's brain. It stores programs, reads sensors and sends signals to the drives. Industrial robots are taught positions using a hand-held teach pendant.

Sensors:
Internal sensors (encoders) measure each joint angle; external sensors (cameras, force sensors, proximity sensors) sense objects and people.

Power Supply:
Supplies electrical, hydraulic or pneumatic energy.

Robot anatomy and the human body:
Base ↔ trunk, shoulder/elbow ↔ shoulder/elbow, wrist ↔ wrist, gripper ↔ hand, controller ↔ brain, sensors ↔ eyes and skin, drives ↔ muscles, power ↔ food/energy.`,
        keyConcepts: ['Manipulator', 'Base, arm, wrist', 'End-effector', 'Drive system', 'Controller and teach pendant', 'Internal and external sensors'],
        examples: ['A six-axis welding robot in a car factory', 'A pick-and-place SCARA robot on an electronics line', 'A rover with a robotic arm collecting rock samples on Mars'],
        summary: 'A robot is made of a manipulator (base, arm, wrist), an end-effector, drives, sensors, a controller and a power supply — similar to bones, muscles, senses and brain in the human body.',
        activity: 'Look at a picture of an industrial robot arm. Label the base, waist, shoulder, elbow, wrist and end-effector, and count its joints.',
        miniProject: 'Make a cardboard robot arm with straws as links and paper fasteners as revolute joints. Label each part with its robot-anatomy name.',
        notes: 'The wrist decides the orientation of the tool, the arm decides its position. Grippers are usually not counted as a degree of freedom.',
        relatedLessons: ['c9_r_8', 'c9_r_12', 'c9_r_13'] },
    ],
    python: [
      { id: 'c9_p_9', title: 'Strings in Python', subject: 'Python Programming', difficulty: 'Beginner', readingTime: 16,
        objectives: ['Create strings with different quotes', 'Use indexing and slicing', 'Apply string operators and common string methods'],
        theory: `What is a String?
A string (str) is a sequence of characters — letters, digits, spaces and symbols — written inside quotes. Python accepts single quotes 'robot', double quotes "robot" and triple quotes '''...''' or """...""" for text over several lines.

Strings are immutable:
Once a string is created, its characters cannot be changed. Methods like upper() return a new string.

Indexing:
Each character has a position called an index. Forward indexing starts at 0 from the left; backward (negative) indexing starts at -1 from the right. For word = "PYTHON": word[0] is 'P' and word[-1] is 'N'.

Slicing:
word[start:stop:step] gives part of a string. The stop index is not included. word[1:4] gives 'YTH'; word[:3] gives 'PYT'; word[::-1] reverses the string.

String Operators:
• + joins (concatenates): "Robo" + "Craft" → "RoboCraft"
• * repeats: "ha" * 3 → "hahaha"
• in / not in check membership: "bot" in "robot" → True
• Comparison operators compare alphabetically (by Unicode value).

Common Built-in Functions and Methods:
• len(s) — number of characters
• s.upper(), s.lower(), s.title(), s.capitalize()
• s.strip() — removes spaces from both ends
• s.find(x), s.count(x), s.replace(old, new)
• s.split() — breaks into a list of words; " ".join(list) — joins a list into a string
• s.isdigit(), s.isalpha(), s.isalnum(), s.startswith(x), s.endswith(x)

Traversing a String:
A for loop visits each character in turn: for ch in "robot": print(ch).`,
        keyConcepts: ['String creation', 'Indexing (positive and negative)', 'Slicing', 'Concatenation and repetition', 'String methods', 'Immutability', 'Traversal'],
        examples: ['word = "PYTHON"; print(word[0], word[-1])  # P N', 'print("Robo" + "Craft")  # RoboCraft', 'print("hello world".title())  # Hello World', 'for ch in "bot": print(ch)'],
        summary: 'Strings are immutable sequences of characters. You can index, slice, join, repeat and search them, and use methods such as upper(), split() and replace().',
        activity: 'Write a program that takes your full name and prints your initials, the number of vowels and the name in reverse.',
        notes: 'The stop index in a slice is never included. Strings cannot be changed in place — methods return new strings.',
        relatedLessons: ['c9_p_3', 'c9_p_5', 'c9_p_7'] },
    ],
    ai: [
      { id: 'c9_a_9', title: 'AI Domain: Computer Vision', subject: 'Artificial Intelligence', difficulty: 'Intermediate', readingTime: 15,
        objectives: ['Define computer vision', 'Explain how images are stored as numbers', 'Describe common computer vision tasks and applications'],
        theory: `What is Computer Vision?
Computer Vision (CV) is the domain of AI that enables machines to see, understand and interpret images and videos, and take decisions based on them — like human eyes plus the brain.

How does a computer "see"?
A digital image is a grid of tiny squares called pixels. Each pixel stores numbers: in a greyscale image, one number from 0 (black) to 255 (white); in a colour image, three numbers for Red, Green and Blue (RGB). A 1920 × 1080 photo has over 2 million pixels. So for a computer, an image is just a big table of numbers. The AI looks for patterns in these numbers — edges, shapes, textures, colours.

Common Computer Vision Tasks:
• Image classification — what is in the image? ("cat")
• Object detection — what objects are present and where? (boxes around each car)
• Image segmentation — which pixels belong to which object?
• Face recognition — whose face is it?
• Optical Character Recognition (OCR) — reading printed or handwritten text.
• Pose estimation — finding body joints in a video.

Applications:
• Face unlock on phones and attendance systems.
• Self-driving cars detecting lanes, signs and pedestrians.
• Medical imaging — finding tumours in X-rays and MRI scans.
• Agriculture — detecting crop disease from leaf photos.
• Traffic police cameras reading number plates (ANPR).
• Retail — automatic checkout and shelf monitoring.
• Robots — picking objects, line following with cameras, navigation.

Challenges:
Lighting changes, objects hidden behind others, different angles, low-quality images and bias in training data can all confuse a CV system.`,
        keyConcepts: ['Pixels and RGB', 'Image classification', 'Object detection', 'Segmentation', 'Face recognition and OCR', 'CV applications'],
        examples: ['Phone face unlock', 'Self-driving car spotting pedestrians', 'Leaf photo app identifying plant disease', 'Number-plate recognition cameras'],
        summary: 'Computer Vision lets machines understand images by treating them as grids of pixel numbers and finding patterns. It powers face unlock, self-driving cars, medical scans and more.',
        activity: 'List five places where you see computer vision being used around you. For each, write which CV task it uses (classification, detection, OCR…).',
        notes: 'To a computer an image is only numbers. CV models learn which number patterns mean "cat", "car" or "crack".',
        relatedLessons: ['c9_a_7', 'c9_a_10', 'c9_a_11'] },
      { id: 'c9_a_10', title: 'AI Domain: Natural Language Processing', subject: 'Artificial Intelligence', difficulty: 'Intermediate', readingTime: 15,
        objectives: ['Define NLP', 'Explain the main steps of processing text', 'Identify NLP applications and challenges'],
        theory: `What is NLP?
Natural Language Processing (NLP) is the domain of AI that enables computers to understand, interpret and generate human languages such as English, Hindi or Tamil — in text or speech.

Why is human language hard for computers?
• Ambiguity — "I saw a man with a telescope" has two meanings.
• Same word, different meanings — "bank" of a river vs a money bank.
• Different words, same meaning — "big" and "large".
• Slang, spelling mistakes, sarcasm and emotions.
• Thousands of languages and dialects.

How NLP processes text:
1. Text normalisation — make text consistent.
2. Sentence segmentation — split text into sentences.
3. Tokenisation — split sentences into words/tokens.
4. Removing stopwords — drop very common words like "is", "the", "a" that carry little meaning.
5. Lower-casing — "Robot" and "robot" become the same.
6. Stemming / lemmatisation — reduce words to their root: "playing", "played" → "play".
7. Bag of Words / features — count how often each word appears so a model can work with numbers.
8. A model then classifies, translates or generates text.

Applications of NLP:
• Chatbots and virtual assistants (Alexa, Siri, Google Assistant).
• Machine translation (Google Translate, Bhashini).
• Sentiment analysis — is a review positive or negative?
• Spam filtering and email auto-complete.
• Speech-to-text and text-to-speech.
• Text summarisation and grammar checking.`,
        keyConcepts: ['Natural language', 'Tokenisation', 'Stopwords', 'Stemming and lemmatisation', 'Bag of Words', 'Sentiment analysis', 'Chatbots'],
        examples: ['Voice assistants answering questions', 'Google Translate', 'Movie review sentiment analysis', 'Spam filters'],
        summary: 'NLP lets computers understand and produce human language by cleaning text, breaking it into tokens, turning words into numbers and using models to translate, classify or reply.',
        activity: 'Take the sentence "The robots are learning to play football!" and show tokenisation, stopword removal and stemming step by step.',
        notes: 'Computers do not understand words directly — NLP converts words into numbers that models can process.',
        relatedLessons: ['c9_a_7', 'c9_a_9', 'c9_a_11'] },
      { id: 'c9_a_11', title: 'AI Domain: Neural Networks', subject: 'Artificial Intelligence', difficulty: 'Intermediate', readingTime: 15,
        objectives: ['Relate artificial neurons to brain neurons', 'Describe input, hidden and output layers', 'Explain how a neural network learns'],
        theory: `What is a Neural Network?
An Artificial Neural Network (ANN) is a computing model inspired by the human brain. The brain has about 86 billion neurons connected to each other; each neuron receives signals, and if they are strong enough it "fires" and passes a signal on. An ANN copies this idea with simple mathematical units called artificial neurons (nodes).

Structure of a Neural Network:
• Input layer — receives the data (for an image, one input for each pixel value).
• Hidden layer(s) — one or more layers between input and output where patterns are found. Each node combines its inputs.
• Output layer — gives the final answer (e.g. "cat" or "dog", or a number).
A network with many hidden layers is called a deep neural network — this is deep learning.

How one artificial neuron works:
1. Each input (x) is multiplied by a weight (w) that shows how important that input is.
2. The weighted inputs are added together, plus a bias (b).
3. The total passes through an activation function, which decides how strongly the neuron "fires".
Output = activation(x1·w1 + x2·w2 + … + b)

How does the network learn?
At first the weights are random, so answers are wrong. The network is shown many labelled examples. Each time, it compares its answer with the correct answer, calculates the error, and adjusts the weights a little to reduce the error (this process is called backpropagation). After thousands of examples, the weights encode useful patterns.

Applications:
Image recognition, speech recognition, language translation, chatbots, recommendation systems, self-driving cars, medical diagnosis and weather forecasting.

Advantages and limitations:
Neural networks learn complex patterns automatically and handle images, sound and text. But they need a lot of data and computing power, and it is hard to explain why they made a particular decision (the "black box" problem).`,
        keyConcepts: ['Artificial neuron', 'Weights and bias', 'Activation function', 'Input, hidden and output layers', 'Deep learning', 'Training with examples'],
        examples: ['Handwritten digit recognition', 'Face detection in photos', 'Voice assistants recognising speech', 'Language translation apps'],
        summary: 'A neural network is layers of artificial neurons connected by weights. It learns by adjusting the weights to reduce errors on many examples and powers modern deep learning.',
        activity: 'Draw a neural network with 3 inputs (size, colour, weight of a fruit), one hidden layer of 4 nodes and 2 outputs (apple, orange). Label every layer.',
        notes: 'Learning in a neural network means changing the weights. More hidden layers = deeper network = deep learning.',
        relatedLessons: ['c9_a_7', 'c9_a_9', 'c9_a_10'] },
    ],
    computing: [
      { id: 'c9_c_7', title: 'Deterministic vs Probabilistic Problems: Why We Need AI', subject: 'Computing Fundamentals', difficulty: 'Intermediate', readingTime: 12,
        objectives: ['Define deterministic and probabilistic problems', 'Explain why traditional computing struggles with uncertainty', 'Explain the need for AI'],
        theory: `Pre-AI Computing:
Traditional computers work on binary logic: every value is 0 or 1, and logic gates make fixed decisions. A traditional program is a list of exact rules written by a programmer: IF this THEN that.

Deterministic Problems:
A deterministic problem always gives the same output for the same input. There is no uncertainty. Every step can be written as an exact rule.
Examples: adding two numbers, calculating simple interest, sorting a list of names, converting Celsius to Fahrenheit, a traffic light that changes every 60 seconds.
Traditional (rule-based) programs are perfect for these.

Probabilistic Problems:
In a probabilistic problem, the outcome is uncertain, so the best we can give is a likelihood (probability). The input may be incomplete, noisy or keep changing.
Examples: Will it rain tomorrow? Is this email spam? Is this photo of a cat or a dog? Which song will a user like next? Will this patient develop diabetes? Which route will be fastest at 6 pm?
Writing exact rules for these is almost impossible — there are too many situations and exceptions.

Why do we need AI?
AI (especially machine learning) handles probabilistic problems by learning patterns from many past examples instead of following fixed rules. It gives answers with a confidence, for example "92% likely to be a cat" or "70% chance of rain". It also improves as it gets more data.

Comparison:
• Deterministic: exact answer, fixed rules, same output every time, no learning needed — calculator, payroll.
• Probabilistic: likely answer with probability, learns from data, output can change as data changes — weather forecast, face recognition, spam filter.`,
        keyConcepts: ['Binary logic', 'Deterministic problems', 'Probabilistic problems', 'Uncertainty', 'Rule-based vs learning-based', 'Need for AI'],
        examples: ['Calculator (deterministic)', 'Weather forecast (probabilistic)', 'Spam filter (probabilistic)', 'Fixed-timer traffic light (deterministic)'],
        summary: 'Deterministic problems have one certain answer and suit rule-based programs; probabilistic problems involve uncertainty and need AI that learns from data and gives answers with probabilities.',
        activity: 'Make a two-column list of 5 deterministic and 5 probabilistic problems from your daily life.',
        notes: 'If you can write the complete rule, it is deterministic. If you can only say "probably", it is probabilistic and a job for AI.',
        relatedLessons: ['c9_c_1', 'c9_c_3', 'c9_a_6'] },
    ],
  },

  class_10: {
    robotics: [
      { id: 'c10_r_15', title: 'Building a Four-Wheeled Mobile Robot', subject: 'Robotics', difficulty: 'Intermediate', readingTime: 18,
        objectives: ['Integrate chassis, motors, driver, sensors and controller into one system', 'Write single-board-computer code to drive the robot', 'Test and improve the robot step by step'],
        theory: `Integrating a Robot as a System:
A simple robotic system is built by connecting mechanical, electronic and computational blocks so that they work together. The four-wheeled mobile robot is the standard project in your syllabus.

Parts of a Four-Wheeled Robot:
• Chassis — the base plate (acrylic, MDF or aluminium) that holds everything.
• Four DC gear motors with wheels — two on the left side and two on the right side.
• Motor driver (L298N or L293D) — an H-bridge board that lets the controller set the speed and direction of the motors.
• Controller — a microcontroller board (Arduino) or a single board computer (Raspberry Pi).
• Sensors — an ultrasonic sensor (HC-SR04) for obstacles, IR sensors for line following.
• Power — a battery pack (e.g. 2 × 18650 Li-ion cells = 7.4 V) with an on/off switch; the controller gets a regulated 5 V supply.
• Optional — Bluetooth module (HC-05) for phone control.

How it Steers (Skid Steering):
A four-wheeled robot of this type turns like a tank:
• Forward — all wheels forward.
• Backward — all wheels backward.
• Turn left — left wheels slower or backward, right wheels forward.
• Spin on the spot — left wheels backward, right wheels forward.

Wiring Plan:
• Left motors → driver output A; right motors → driver output B.
• Driver inputs IN1–IN4 → four digital pins of the controller; ENA/ENB → PWM pins for speed.
• Ultrasonic Trig → output pin, Echo → input pin (use a voltage divider for a 3.3 V Raspberry Pi pin).
• All grounds (battery, driver, controller, sensors) connected together — common ground.

Programming Logic (obstacle avoidance):
1. Measure distance in front.
2. If distance > 25 cm → move forward.
3. Else → stop, reverse a little, turn right, measure again.
4. Repeat forever.

Testing:
Test each block separately first (motors alone, then the sensor alone), then combine. Check wheel directions, battery charge and loose wires. Improve by tuning speed and the distance threshold.`,
        keyConcepts: ['System integration', 'Skid steering', 'Motor driver wiring', 'Common ground', 'Single board computer coding', 'Incremental testing'],
        examples: ['Obstacle-avoiding robot car', 'Line-following robot with IR sensors', 'Bluetooth-controlled robot car', 'Edge-detecting robot that does not fall off a table'],
        summary: 'A four-wheeled robot integrates a chassis, four motors, a motor driver, sensors, a controller and a battery. It steers by changing the speed of its left and right wheels and is coded to sense, decide and act in a loop.',
        activity: 'Draw the wiring diagram of a four-wheeled robot with an L298N motor driver and an ultrasonic sensor. Label every connection.',
        miniProject: 'Build or simulate (in the RoboCraft Lab or Tinkercad) a four-wheeled obstacle-avoiding robot and record how often it touches an obstacle in 2 minutes.',
        notes: 'Always connect a common ground and test each subsystem separately before joining them together.',
        relatedLessons: ['c10_r_10', 'c10_r_14', 'c10_r_9'] },
    ],
    ai: [
      { id: 'c10_a_7', title: 'Data Acquisition & Data Exploration', subject: 'Artificial Intelligence', difficulty: 'Intermediate', readingTime: 16,
        objectives: ['Identify types and sources of data', 'Explain features, training data and testing data', 'Choose suitable graphs to explore data'],
        theory: `Data Acquisition:
Data acquisition is the stage of the AI project cycle in which we collect reliable, relevant and sufficient data for the problem we scoped.

Types of Data:
• Structured — organised in rows and columns (spreadsheets, databases).
• Unstructured — images, audio, video, free text.
• Semi-structured — partly organised (JSON, emails with headers).
Also: numerical (marks, temperature) and categorical (colour, city).

Features:
A feature is a measurable property used by the model to make a prediction. To predict house prices, the features could be area, number of rooms and location. The value to predict (price) is called the label or target.

Sources of Data:
• Surveys and questionnaires
• Sensors and cameras (IoT devices)
• Web scraping (only where allowed)
• APIs (e.g. a weather service)
• Open datasets — Kaggle, data.gov.in, UCI Machine Learning Repository
• Organisation records (school results, sales records)
Always collect data ethically: with permission, from authentic sources, protecting privacy.

Training and Testing Data:
The dataset is split into training data (usually 70–80%) used to teach the model, and testing data (20–30%) kept aside to check how well the model works on data it has never seen.

Data Exploration:
Data exploration means studying the data to understand it before modelling: cleaning errors and missing values, finding patterns, trends and outliers, and visualising the data.

Choosing a Graph:
• Bar graph — compare quantities across categories (sales per month, students per house).
• Histogram — show how values are distributed in ranges (how many students scored 40–50, 50–60…).
• Line graph — show change over time (temperature each hour).
• Scatter plot — show the relationship between two numerical variables (hours studied vs marks).
• Pie chart — show parts of a whole (share of each transport mode).`,
        keyConcepts: ['Data acquisition', 'Structured and unstructured data', 'Features and labels', 'Data sources and Kaggle', 'Training vs testing data', 'Data visualisation'],
        examples: ['Downloading a crop-yield dataset from Kaggle', 'Using a temperature sensor log as data', 'Splitting 1000 images into 800 training and 200 testing', 'Scatter plot of study hours vs marks'],
        summary: 'Data acquisition collects relevant data from sources such as surveys, sensors and Kaggle; data exploration cleans and visualises it with bar graphs, histograms, line graphs, scatter plots and pie charts to find patterns.',
        activity: 'Collect the heights and shoe sizes of 15 classmates. Draw a scatter plot and a histogram of heights. What pattern do you see?',
        notes: 'Never test a model on the same data it was trained on.',
        relatedLessons: ['c10_a_6', 'c10_a_8', 'c10_p_9'] },
      { id: 'c10_a_8', title: 'Modelling & Evaluation', subject: 'Artificial Intelligence', difficulty: 'Intermediate', readingTime: 16,
        objectives: ['Differentiate rule-based and learning-based models', 'Explain linear regression with an example', 'Evaluate a model using accuracy and a confusion matrix'],
        theory: `Modelling:
Modelling is the stage where we choose and build an AI model that maps inputs (features) to outputs (predictions).

Rule-Based Approach:
The developer writes the rules. Example: IF temperature > 38 THEN "fever". It is simple and easy to explain but cannot learn — if the situation changes, a human must rewrite the rules.

Learning-Based Approach:
The machine learns the rules from data. We give it many examples and it finds the pattern by itself. It adapts to new data but needs a lot of good data.

Supervised Learning:
The training data is labelled (each example has the correct answer). The model learns to predict labels for new data.
• Classification — predicts a category (spam / not spam, apple / orange).
• Regression — predicts a number (price, temperature, marks).

Unsupervised Learning:
The data has no labels. The model finds hidden structure, e.g. clustering customers into groups with similar buying habits.

Linear Regression:
Linear regression is a supervised learning method that predicts a numerical value by fitting a straight line through the data: y = mx + c, where x is the input feature, y the predicted value, m the slope and c the intercept. Example: predict marks from hours studied — if the best line is marks = 8 × hours + 20, a student who studies 5 hours is predicted to score 60.

Evaluation:
After training, the model is tested on the testing data.
• Accuracy = correct predictions ÷ total predictions × 100.
• Confusion matrix — a table of True Positives, True Negatives, False Positives and False Negatives.
• Precision — of the items predicted positive, how many were really positive.
• Recall — of the real positives, how many the model found.
For regression, we look at the error between predicted and actual values.

A model that does very well on training data but badly on testing data is overfitting — it memorised instead of learning.`,
        keyConcepts: ['Rule-based vs learning-based', 'Supervised and unsupervised learning', 'Classification vs regression', 'Linear regression', 'Accuracy', 'Confusion matrix', 'Overfitting'],
        examples: ['Predicting house prices with linear regression', 'Spam classifier evaluated with a confusion matrix', 'Clustering shoppers into groups', 'Rule-based thermostat'],
        summary: 'Modelling builds a rule-based or learning-based model (supervised or unsupervised); linear regression fits y = mx + c to predict numbers. Evaluation checks the model on unseen testing data using accuracy, precision and recall.',
        activity: 'Plot hours studied vs marks for 8 friends. Draw the best straight line by eye, find its slope and intercept, and predict the marks for 6 hours of study.',
        notes: 'Classification predicts a category; regression predicts a number.',
        relatedLessons: ['c10_a_3', 'c10_a_6', 'c10_a_7'] },
    ],
  },

  class_11: {
    mechanical: [
      { id: 'c11_m_9', title: 'Robot Components: Frames, Materials & Wheels', subject: 'Mechanical Systems', difficulty: 'Intermediate', readingTime: 16,
        objectives: ['Compare materials used for robot frames', 'Choose wheel types for a mobile robot', 'Relate design choices to cost, weight and strength'],
        theory: `Robot Frames:
The frame (chassis) is the skeleton of a robot. It holds the motors, battery, electronics and sensors in the right place and must be stiff enough not to bend, light enough not to waste battery, and easy to make and repair.

Frame Materials:
• MDF (Medium Density Fibreboard) — cheap, easy to cut and laser-cut, good for prototypes; absorbs moisture and is weak at screw holes.
• Acrylic (PMMA) — transparent, light, laser-cut precisely; brittle, can crack if over-tightened.
• Aluminium — light, strong, does not rust, conducts heat; costlier and needs tools to cut and bend. Common in competition and industrial robots (aluminium extrusions).
• Steel — very strong and stiff, cheap per kg but heavy; used for large industrial robots and bases.
• Others — 3D-printed PLA/ABS for custom parts, carbon fibre for drones (very light and stiff but expensive).
Choice depends on load, size, budget, weight limit and how many units are made.

Wheel Types:
• Standard (fixed) wheels — roll forward and backward only; the robot turns by changing left and right wheel speeds (differential/skid steering). Simple and strong.
• Castor wheels — swivel freely about a vertical axis; used as a passive support wheel (e.g. the third wheel of a two-wheel robot, office chairs).
• Omni wheels — have small rollers around the rim at 90° to the wheel axis, so the wheel can roll forward and also slide sideways. Three or four omni wheels allow movement in any direction.
• Mecanum wheels — have rollers at 45°. With four mecanum wheels driven independently, the robot can move forward, sideways, diagonally and rotate on the spot. Used in warehouse robots and competition robots.

Holonomic Motion:
A robot that can move in any direction without first turning (using omni or mecanum wheels) is called holonomic. Car-like robots with standard wheels are non-holonomic — they must turn to change direction.

CAD Modelling:
Before building, engineers design frames in CAD (Computer Aided Design) software such as TinkerCAD or Fusion 360, check fit and strength, and then manufacture parts precisely by laser cutting, CNC machining or 3D printing.`,
        keyConcepts: ['Robot frame', 'MDF, acrylic, aluminium, steel', 'Standard wheel', 'Castor wheel', 'Omni wheel', 'Mecanum wheel', 'Holonomic motion', 'CAD and precision manufacturing'],
        examples: ['Acrylic chassis for a line follower', 'Aluminium extrusion frame of a competition robot', 'Mecanum-wheel warehouse robot moving sideways', 'Castor wheel supporting a two-wheel robot'],
        summary: 'Robot frames are made from MDF, acrylic, aluminium or steel depending on cost, strength and weight. Standard wheels give simple differential drive, castors give support, and omni or mecanum wheels give holonomic (any-direction) motion.',
        activity: 'Compare MDF, acrylic and aluminium for a 2 kg classroom robot using a table of cost, weight, strength and ease of cutting. Which would you choose?',
        notes: 'Mecanum rollers are at 45°, omni rollers at 90°. Holonomic robots can move sideways without turning.',
        relatedLessons: ['c11_m_3', 'c11_app_2', 'c11_r_4'] },
    ],
    computing: [
      { id: 'c11_c_2', title: 'Algorithms, Flowcharts & Pseudocode', subject: 'Computing', difficulty: 'Intermediate', readingTime: 15,
        objectives: ['Write algorithms for robot tasks', 'Draw flowcharts using standard symbols', 'Write pseudocode and convert it to code'],
        theory: `Algorithm:
An algorithm is a finite, ordered set of clear steps that solves a problem. A good algorithm has:
• Input — zero or more values given to it.
• Output — at least one result.
• Definiteness — every step is clear and unambiguous.
• Finiteness — it ends after a limited number of steps.
• Effectiveness — every step is simple enough to be carried out.

Flowchart:
A flowchart is a diagram of an algorithm using standard symbols:
• Oval (terminal) — Start / Stop.
• Parallelogram — Input / Output.
• Rectangle — Process (calculation, assignment).
• Diamond — Decision (Yes/No condition).
• Arrows — flow of control.
• Small circle — connector.
Flowcharts make logic easy to see and to explain to others, and help find mistakes before coding.

Pseudocode:
Pseudocode describes an algorithm in structured English that looks like code but ignores exact syntax. Common words: BEGIN, END, INPUT, OUTPUT, SET, IF … THEN … ELSE … ENDIF, WHILE … DO … ENDWHILE, FOR … TO … NEXT.

Example — Obstacle-avoiding robot:
Algorithm:
1. Start.
2. Read distance d from the ultrasonic sensor.
3. If d is less than 20 cm, stop, reverse for 0.3 s and turn right for 0.4 s.
4. Otherwise move forward.
5. Go back to step 2.

Pseudocode:
BEGIN
  WHILE TRUE DO
    INPUT d FROM ultrasonic
    IF d < 20 THEN
      STOP; REVERSE(0.3); TURN_RIGHT(0.4)
    ELSE
      FORWARD
    ENDIF
  ENDWHILE
END

Control Structures:
Every algorithm is built from three structures — sequence (steps one after another), selection (if/else decisions) and iteration (loops).

From Pseudocode to Embedded Code:
Each pseudocode line becomes a line of embedded C (Arduino) or Python (Raspberry Pi). Testing the algorithm with a dry run (tracing values on paper) before uploading saves time and prevents damage to hardware.`,
        keyConcepts: ['Properties of an algorithm', 'Flowchart symbols', 'Pseudocode keywords', 'Sequence, selection, iteration', 'Dry run', 'Algorithm to embedded code'],
        examples: ['Algorithm for a line follower', 'Flowchart for a traffic-light controller', 'Pseudocode for finding the largest of three numbers', 'Dry run of a loop that counts sensor readings'],
        summary: 'An algorithm is a finite, unambiguous set of steps; flowcharts show it with standard symbols and pseudocode writes it in structured English. Both are built from sequence, selection and iteration and are converted into embedded code.',
        activity: 'Draw a flowchart and write pseudocode for a robot that counts how many times a door is opened using an IR sensor and turns on an LED after 10 openings.',
        notes: 'Diamond = decision, parallelogram = input/output, rectangle = process, oval = start/stop.',
        relatedLessons: ['c11_c_1', 'c11_mc_3', 'c11_mc_4'] },
    ],
  },
};

export const NEW_QUIZZES = {
  c9_r_14: [
    { q: 'Which part of a robot arm orients (points) the tool?', type: 'mcq', options: ['Base', 'Wrist', 'Controller', 'Power supply'], answer: 1, explanation: 'The wrist joints set the orientation of the end-effector; the arm sets its position.' },
    { q: 'The tool attached at the end of a robot arm is called the:', type: 'mcq', options: ['Link', 'Teach pendant', 'End-effector', 'Encoder'], answer: 2, explanation: 'Grippers, welding torches and suction cups are end-effectors.' },
    { q: 'Which device is used to teach positions to an industrial robot?', type: 'mcq', options: ['Teach pendant', 'Joystick mouse', 'Encoder', 'Motor driver'], answer: 0, explanation: 'A hand-held teach pendant moves the robot and saves positions.' },
    { q: 'In robot anatomy, the controller is compared to the human:', type: 'mcq', options: ['Muscles', 'Bones', 'Brain', 'Skin'], answer: 2, explanation: 'The controller processes information and decides, like the brain.' },
    { q: 'Encoders that measure joint angles are internal sensors.', type: 'tf', answer: true, explanation: 'They measure the robot\'s own state, so they are internal (proprioceptive).' },
    { q: 'Hydraulic drives are chosen when a robot needs very high force.', type: 'tf', answer: true, explanation: 'Pressurised oil gives very large forces.' },
    { q: 'The fixed part of a robot arm bolted to the floor is the _____.', type: 'fill', answer: 'base', explanation: 'The base supports the whole manipulator.' },
    { q: 'The chain of links and joints of a robot is called the _____.', type: 'fill', answer: 'manipulator', explanation: 'The manipulator is the robot arm.' },
  ],
  c9_p_9: [
    { q: 'What is the output of print("ROBOT"[-2])?', type: 'mcq', options: ['R', 'O', 'B', 'T'], answer: 1, explanation: 'Index -1 is T, -2 is O.' },
    { q: 'What does "PYTHON"[1:4] return?', type: 'mcq', options: ['PYT', 'YTH', 'YTHO', 'PYTH'], answer: 1, explanation: 'Characters at index 1, 2 and 3; the stop index 4 is excluded.' },
    { q: 'Which method converts "robot" into "ROBOT"?', type: 'mcq', options: ['capitalize()', 'title()', 'upper()', 'swapcase()'], answer: 2, explanation: 'upper() makes every letter uppercase.' },
    { q: 'What is the output of "ab" * 3?', type: 'mcq', options: ['ab3', 'ababab', 'aaabbb', 'Error'], answer: 1, explanation: '* repeats the string.' },
    { q: 'What does len("Hello World") return?', type: 'mcq', options: ['10', '11', '12', '2'], answer: 1, explanation: 'The space also counts: 11 characters.' },
    { q: 'Strings in Python are mutable.', type: 'tf', answer: false, explanation: 'Strings are immutable; methods return new strings.' },
    { q: '"bot" in "robot" returns True.', type: 'tf', answer: true, explanation: 'in checks for a substring.' },
    { q: 'The method that breaks a sentence into a list of words is _____().', type: 'fill', answer: 'split', explanation: '"a b c".split() → [\'a\', \'b\', \'c\']' },
    { q: 'To reverse a string s, write s[ : : _____ ].', type: 'fill', answer: '-1', explanation: 'A step of -1 walks backwards through the string.' },
  ],
  c9_a_9: [
    { q: 'Computer vision enables machines to:', type: 'mcq', options: ['Understand speech', 'Interpret images and videos', 'Store data', 'Do arithmetic'], answer: 1, explanation: 'CV is the "seeing" domain of AI.' },
    { q: 'In a greyscale image, a pixel value of 0 means:', type: 'mcq', options: ['White', 'Grey', 'Black', 'Red'], answer: 2, explanation: '0 is black and 255 is white.' },
    { q: 'Drawing boxes around every car in a photo is called:', type: 'mcq', options: ['Classification', 'Object detection', 'Translation', 'Clustering'], answer: 1, explanation: 'Detection finds what and where.' },
    { q: 'Reading printed text from a photo is called:', type: 'mcq', options: ['OCR', 'NLP', 'GPS', 'PWM'], answer: 0, explanation: 'Optical Character Recognition.' },
    { q: 'A colour pixel is usually stored as three numbers for red, green and blue.', type: 'tf', answer: true, explanation: 'RGB values, each 0–255.' },
    { q: 'Lighting changes never affect computer vision systems.', type: 'tf', answer: false, explanation: 'Poor or changing light is a major challenge.' },
    { q: 'The smallest unit of a digital image is a _____.', type: 'fill', answer: 'pixel', explanation: 'Picture element.' },
  ],
  c9_a_10: [
    { q: 'NLP stands for:', type: 'mcq', options: ['Natural Language Processing', 'Neural Logic Programming', 'Network Layer Protocol', 'New Language Program'], answer: 0, explanation: 'NLP deals with human language.' },
    { q: 'Splitting a sentence into individual words is called:', type: 'mcq', options: ['Stemming', 'Tokenisation', 'Segmentation', 'Classification'], answer: 1, explanation: 'Each word is a token.' },
    { q: 'Words like "is", "the" and "a" that are removed during processing are:', type: 'mcq', options: ['Keywords', 'Stopwords', 'Tokens', 'Stems'], answer: 1, explanation: 'Stopwords carry little meaning.' },
    { q: 'Finding whether a review is positive or negative is:', type: 'mcq', options: ['Sentiment analysis', 'OCR', 'Regression', 'Clustering'], answer: 0, explanation: 'Sentiment analysis detects opinion.' },
    { q: 'Reducing "playing" and "played" to "play" is stemming.', type: 'tf', answer: true, explanation: 'Stemming cuts words to a root form.' },
    { q: 'Human language is never ambiguous, so NLP is easy.', type: 'tf', answer: false, explanation: 'Ambiguity is a key challenge.' },
    { q: 'Counting how often each word appears is the Bag of _____ model.', type: 'fill', answer: 'Words', explanation: 'Bag of Words turns text into numbers.' },
  ],
  c9_a_11: [
    { q: 'Artificial neural networks are inspired by:', type: 'mcq', options: ['The heart', 'The human brain', 'Computer chips', 'Plants'], answer: 1, explanation: 'They copy connected neurons.' },
    { q: 'Which layer receives the raw data?', type: 'mcq', options: ['Hidden layer', 'Output layer', 'Input layer', 'Bias layer'], answer: 2, explanation: 'The input layer takes in the features.' },
    { q: 'A network learns by adjusting its:', type: 'mcq', options: ['Pixels', 'Weights', 'Inputs', 'Labels'], answer: 1, explanation: 'Weights change to reduce error.' },
    { q: 'A neural network with many hidden layers is used in:', type: 'mcq', options: ['Deep learning', 'Expert systems', 'Binary addition', 'Logic gates'], answer: 0, explanation: 'Deep = many layers.' },
    { q: 'An activation function decides how strongly a neuron fires.', type: 'tf', answer: true, explanation: 'It transforms the weighted sum into the output.' },
    { q: 'Neural networks are always easy to explain.', type: 'tf', answer: false, explanation: 'They are often called black boxes.' },
    { q: 'The layer that gives the final answer is the _____ layer.', type: 'fill', answer: 'output', explanation: 'Output layer gives predictions.' },
  ],
  c9_c_7: [
    { q: 'Which is a deterministic problem?', type: 'mcq', options: ['Predicting rain', 'Converting °C to °F', 'Recognising faces', 'Detecting spam'], answer: 1, explanation: 'Same input always gives the same exact output.' },
    { q: 'Which is a probabilistic problem?', type: 'mcq', options: ['Adding marks', 'Sorting names', 'Forecasting tomorrow\'s weather', 'Binary to decimal'], answer: 2, explanation: 'The outcome is uncertain.' },
    { q: 'Traditional computers make decisions using:', type: 'mcq', options: ['Feelings', 'Binary logic and fixed rules', 'Random guesses', 'Probability only'], answer: 1, explanation: 'Pre-AI computing uses logic gates and exact rules.' },
    { q: 'AI gives answers to probabilistic problems as:', type: 'mcq', options: ['Exact values only', 'Likelihoods/probabilities', 'Binary codes', 'Errors'], answer: 1, explanation: 'e.g. "92% likely a cat".' },
    { q: 'A deterministic program gives the same output for the same input every time.', type: 'tf', answer: true, explanation: 'That is the definition.' },
    { q: 'Spam detection can be fully solved with a few fixed rules.', type: 'tf', answer: false, explanation: 'Spam keeps changing; learning-based AI works better.' },
    { q: 'Problems with uncertain outcomes are called _____ problems.', type: 'fill', answer: 'probabilistic', explanation: 'They need probability-based answers.' },
  ],
  c10_r_15: [
    { q: 'How does a four-wheeled skid-steer robot turn left?', type: 'mcq', options: ['All wheels forward', 'Left wheels slower/backward, right wheels forward', 'Right wheels backward only', 'It cannot turn'], answer: 1, explanation: 'Different wheel speeds on each side make it turn.' },
    { q: 'Which board controls the speed and direction of the motors?', type: 'mcq', options: ['HC-SR04', 'L298N motor driver', 'HC-05', 'Voltage regulator'], answer: 1, explanation: 'The L298N is a dual H-bridge driver.' },
    { q: 'Why must all grounds be connected together?', type: 'mcq', options: ['To look neat', 'So signals have a common reference voltage', 'To increase speed', 'To charge the battery'], answer: 1, explanation: 'Without a common ground, signals are meaningless.' },
    { q: 'ENA/ENB pins of the L298N receive PWM to control:', type: 'mcq', options: ['Direction', 'Speed', 'Distance', 'Bluetooth'], answer: 1, explanation: 'PWM duty cycle sets speed.' },
    { q: 'Each subsystem should be tested separately before combining.', type: 'tf', answer: true, explanation: 'Incremental testing makes faults easy to find.' },
    { q: 'A 5 V echo signal can be safely connected straight to a 3.3 V Raspberry Pi pin.', type: 'tf', answer: false, explanation: 'Use a voltage divider or level shifter.' },
    { q: 'The steering method that turns by changing left and right wheel speeds is _____ steering.', type: 'fill', answer: 'skid', explanation: 'Also called differential/tank steering.' },
  ],
  c10_a_7: [
    { q: 'Which graph best shows change over time?', type: 'mcq', options: ['Pie chart', 'Line graph', 'Histogram', 'Scatter plot'], answer: 1, explanation: 'Line graphs show trends over time.' },
    { q: 'Which graph shows the relationship between two numerical variables?', type: 'mcq', options: ['Scatter plot', 'Bar graph', 'Pie chart', 'Table'], answer: 0, explanation: 'Each point is one (x, y) pair.' },
    { q: 'Kaggle is a source of:', type: 'mcq', options: ['Robot motors', 'Open datasets', 'Programming languages', 'Sensors'], answer: 1, explanation: 'Kaggle hosts thousands of datasets.' },
    { q: 'Data kept aside to check a trained model is called:', type: 'mcq', options: ['Training data', 'Testing data', 'Feature data', 'Raw data'], answer: 1, explanation: 'Testing data is unseen by the model.' },
    { q: 'A histogram shows how values are distributed across ranges.', type: 'tf', answer: true, explanation: 'Bars represent ranges (bins).' },
    { q: 'Images and audio are structured data.', type: 'tf', answer: false, explanation: 'They are unstructured.' },
    { q: 'A measurable property used by a model to make predictions is called a _____.', type: 'fill', answer: 'feature', explanation: 'e.g. area of a house.' },
  ],
  c10_a_8: [
    { q: 'Predicting a house price is an example of:', type: 'mcq', options: ['Classification', 'Regression', 'Clustering', 'Rule-based'], answer: 1, explanation: 'Regression predicts a number.' },
    { q: 'In y = mx + c, m is the:', type: 'mcq', options: ['Intercept', 'Slope', 'Label', 'Error'], answer: 1, explanation: 'm is the slope of the line.' },
    { q: 'Grouping customers without labels is:', type: 'mcq', options: ['Supervised learning', 'Unsupervised learning', 'Regression', 'Rule-based'], answer: 1, explanation: 'No labels → unsupervised clustering.' },
    { q: 'Accuracy = ?', type: 'mcq', options: ['Wrong ÷ total', 'Correct ÷ total × 100', 'Total ÷ correct', 'Features ÷ labels'], answer: 1, explanation: 'Percentage of correct predictions.' },
    { q: 'A rule-based model learns automatically from data.', type: 'tf', answer: false, explanation: 'Humans write the rules.' },
    { q: 'A model that does well on training data but badly on testing data is overfitting.', type: 'tf', answer: true, explanation: 'It memorised the training data.' },
    { q: 'A table of TP, TN, FP and FN is called a _____ matrix.', type: 'fill', answer: 'confusion', explanation: 'Used to evaluate classifiers.' },
  ],
  c11_m_9: [
    { q: 'Which wheel has rollers at 45° to its axis?', type: 'mcq', options: ['Castor', 'Omni', 'Mecanum', 'Standard'], answer: 2, explanation: 'Mecanum rollers are angled at 45°.' },
    { q: 'Which frame material is transparent and laser-cut but brittle?', type: 'mcq', options: ['Steel', 'Acrylic', 'Aluminium', 'MDF'], answer: 1, explanation: 'Acrylic (PMMA).' },
    { q: 'A castor wheel is mainly used as:', type: 'mcq', options: ['A drive wheel', 'A free-swivelling support wheel', 'A sensor', 'A gear'], answer: 1, explanation: 'Castors give passive support.' },
    { q: 'A robot that can move sideways without turning first is:', type: 'mcq', options: ['Holonomic', 'Non-holonomic', 'Stationary', 'Teleoperated'], answer: 0, explanation: 'Omni/mecanum robots are holonomic.' },
    { q: 'Aluminium is lighter than steel and resists rust.', type: 'tf', answer: true, explanation: 'Hence its popularity in robot frames.' },
    { q: 'MDF is ideal for wet outdoor robots.', type: 'tf', answer: false, explanation: 'MDF swells when it absorbs moisture.' },
    { q: 'Designing parts on a computer before making them is called _____.', type: 'fill', answer: 'CAD', explanation: 'Computer Aided Design.' },
  ],
  c11_c_2: [
    { q: 'Which flowchart symbol represents a decision?', type: 'mcq', options: ['Rectangle', 'Oval', 'Diamond', 'Parallelogram'], answer: 2, explanation: 'Diamonds have Yes/No exits.' },
    { q: 'Which property means an algorithm must end?', type: 'mcq', options: ['Definiteness', 'Finiteness', 'Effectiveness', 'Input'], answer: 1, explanation: 'Finiteness = limited steps.' },
    { q: 'The three basic control structures are sequence, selection and:', type: 'mcq', options: ['Iteration', 'Compilation', 'Debugging', 'Interrupts'], answer: 0, explanation: 'Iteration means loops.' },
    { q: 'The parallelogram symbol is used for:', type: 'mcq', options: ['Process', 'Input/Output', 'Start/Stop', 'Connector'], answer: 1, explanation: 'Reading or displaying data.' },
    { q: 'Pseudocode must follow the exact syntax of a programming language.', type: 'tf', answer: false, explanation: 'Pseudocode ignores exact syntax.' },
    { q: 'A dry run means tracing an algorithm by hand with sample values.', type: 'tf', answer: true, explanation: 'It finds logic errors early.' },
    { q: 'A finite set of clear steps to solve a problem is an _____.', type: 'fill', answer: 'algorithm', explanation: 'Named after al-Khwarizmi.' },
  ],
};
