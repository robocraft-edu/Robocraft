// Class 9 · Robotics — full textbook notes, diagrams and exam questions.
// Follows the Class IX Robotics & AI syllabus (Part I: Robotics).
export default {
  c9_r_1: {
    figs: ['robotFields'],
    sections: [
      { h: 'Defining a robot properly', b: `A **robot** is a programmable machine that can **sense** its surroundings, **process** that information to make decisions, and **act** on the physical world — with some degree of **autonomy** (working without a human controlling every step).

The Robot Institute of America defined an industrial robot as "a reprogrammable, multifunctional manipulator designed to move material, parts, tools or specialised devices through variable programmed motions for the performance of a variety of tasks". Two words in that definition matter for exams:
• **Reprogrammable** — the same robot can be given a new program for a new job (a fixed machine cannot).
• **Multifunctional** — it can do more than one kind of task (weld today, paint tomorrow).

**Robotics** is the branch of engineering and science that deals with the design, construction, operation and use of robots, together with the computer systems that control them.` },
      { h: 'Characteristics of a robot', b: `Every robot shows these characteristics:
• **Sensing** — it uses sensors (camera, IR, ultrasonic, touch, temperature) to collect information.
• **Movement** — it can move itself (wheels, legs, propellers) or move parts of itself (an arm).
• **Energy** — it needs a power source: battery, mains electricity, hydraulic or pneumatic power.
• **Intelligence / programmability** — a controller runs a program that decides what to do.
• **Autonomy** — it can carry out a task with little or no human help.
• **Interaction** — it affects its environment (picks, places, cleans, welds, talks).` },
      { h: 'Benefits of robots', b: `The syllabus lists five key benefits:
1. **Quality** — robots repeat the same movement with the same precision every time, so products have fewer defects.
2. **Productivity** — they work faster and do not need breaks, so more is produced per hour.
3. **Efficiency** — less material is wasted and energy can be used more carefully.
4. **Working span** — a robot can work 24 hours a day, 7 days a week, for years.
5. **Hazardous environments** — robots can work where it is unsafe for people: bomb disposal, nuclear plants, deep sea, outer space, mines, fire and chemical spills.

Other benefits: accuracy in surgery, doing boring repetitive jobs, lifting very heavy loads, and helping elderly or disabled people.` },
      { h: 'Limitations of robots', b: `Robots are powerful but have limits:
• **High cost** — buying, installing and maintaining robots is expensive.
• **No common sense or emotions** — a robot only does what it is programmed or trained to do; it cannot truly understand feelings.
• **Limited adaptability** — an unexpected situation can confuse a robot.
• **Needs skilled people** — programmers and technicians are required to set it up and repair it.
• **Power dependence** — no power means no work.
• **Job displacement** — robots can replace some human jobs, though they also create new jobs (robot programmers, technicians, designers).
• **Safety risk** — a fast, heavy robot arm can injure people if safety rules are ignored.` },
      { h: 'Physical robots and software bots', b: `Not every "robot" has a body. A **software bot** is a program that automates tasks — for example a chatbot answering customer questions, or RPA (Robotic Process Automation) bots filling forms. Physical robots have sensors and actuators; software bots work only with data. In this course, "robot" normally means a physical robot.` },
    ],
    glossary: [['Robot', 'a reprogrammable machine that senses, decides and acts with some autonomy'], ['Robotics', 'the science and engineering of designing, building, operating and using robots'], ['Autonomy', 'the ability to work without a human controlling every step']],
    exam: {
      short: [
        { q: 'Define a robot.', a: 'A robot is a reprogrammable machine that can sense its environment, process the information to take decisions, and act physically on its surroundings with some degree of autonomy.' },
        { q: 'Give the origin of the word "robot".', a: 'It comes from the Czech word **robota**, meaning forced labour. It was first used by Karel Čapek in his 1920 play **R.U.R. (Rossum\'s Universal Robots)**.' },
        { q: 'State any two limitations of robots.', a: '• High initial and maintenance cost.\n• They lack common sense/emotions and cannot easily handle unexpected situations.\n(Also accepted: need skilled operators, depend on power, may displace jobs.)' },
      ],
      long: [
        { q: 'Explain any five benefits of using robots, with an example for each.', a: '1. **Quality** — consistent precision, e.g. robots welding car bodies give identical welds.\n2. **Productivity** — faster output, e.g. a packing robot packs hundreds of items per minute.\n3. **Efficiency** — less waste, e.g. spray-painting robots use exactly the paint needed.\n4. **Working span** — work 24×7, e.g. warehouse robots run all night.\n5. **Hazardous environments** — e.g. bomb-disposal robots and Mars rovers do work unsafe for humans.' },
        { q: 'Describe the characteristics that make a machine a robot.', a: 'A robot (1) **senses** its environment using sensors; (2) has a **controller/program** that processes data and decides; (3) **acts/moves** using actuators; (4) needs an **energy source**; (5) works with **autonomy**; and (6) is **reprogrammable** for different tasks. Example: a Roomba senses walls and dirt, decides a path, drives its wheels and brushes, runs on a battery and works on its own.' },
      ],
    },
  },

  c9_r_2: {
    figs: ['sensePlanAct'],
    sections: [
      { h: 'The Sense–Plan–Act loop in detail', b: `Every robot repeats three steps many times each second:
• **Sense** — read the sensors. Example: an ultrasonic sensor reports "obstacle at 18 cm".
• **Plan (think)** — the controller compares readings with its program or model. "18 cm is less than my 20 cm safety limit, so I must turn."
• **Act** — the controller sends signals to actuators: left motor forward, right motor backward → the robot turns.

After acting, the world has changed, so the robot senses again. This repeated loop is called a **control loop**. A fast loop (e.g. 100 times a second) makes a robot react smoothly; a slow loop makes it clumsy.` },
      { h: 'Feedback', b: `When a robot measures the result of its own action and uses that measurement to correct the next action, it is using **feedback**. A line-following robot is a good example: if its sensor sees that it has drifted left of the line, it steers right; if it drifts right, it steers left. Without feedback the robot would simply drive in whatever direction it was pointed.

[fig:openClosedLoop]` },
      { h: 'Levels of autonomy', b: `Robots are not simply "autonomous" or "not autonomous" — there are levels:
1. **Manual / teleoperated** — a human controls every movement by remote (bomb-disposal robot driven by a soldier).
2. **Assisted** — the human gives commands, the robot handles details (a drone that holds its height by itself).
3. **Semi-autonomous** — the robot does most of the job but a human supervises (a surgical robot guided by a doctor).
4. **Fully autonomous** — the robot completes the whole task by itself (a Mars rover driving to a target rock when radio delay makes remote control impossible).` },
      { h: 'Why a washing machine is not a full robot', b: `A washing machine follows a fixed program: fill, wash, rinse, spin. Some models sense water level or load, but they cannot change their goal, move around, or deal with new situations. So it is an **automated machine**, not a full robot. The more a machine senses, decides for itself and adapts, the more "robot-like" it is.` },
    ],
    exam: {
      short: [
        { q: 'What is the Sense–Plan–Act cycle?', a: 'It is the basic operating loop of a robot: **sense** the environment with sensors, **plan** (decide) using the controller, and **act** using actuators — repeated continuously.' },
        { q: 'What is meant by feedback in a robot?', a: 'Feedback is information from sensors about the result of the robot\'s own action, used to correct its next action (e.g. a line follower steering back onto the line).' },
        { q: 'Name the three pillars of robotics.', a: 'Sensing (perception), processing (decision-making) and actuation (acting/moving).' },
      ],
      long: [
        { q: 'Explain the Sense–Plan–Act cycle using an obstacle-avoiding robot as an example. Draw a labelled diagram.', a: '**Sense:** the ultrasonic sensor measures the distance to the object ahead, e.g. 15 cm.\n**Plan:** the microcontroller compares 15 cm with a set limit of 20 cm and decides to turn.\n**Act:** it drives the left motor forward and the right motor backward, so the robot turns away.\nThe loop repeats many times a second; the robot then senses a clear path and moves forward.\nDiagram: three boxes Sense → Plan → Act in a loop with the Environment feeding back into Sense.' },
        { q: 'Differentiate between a robot and an automated machine with two examples of each.', a: '• A **robot** senses its environment, decides for itself and acts with autonomy; it can be reprogrammed — e.g. Roomba, autonomous drone.\n• An **automated machine** follows a fixed sequence with little sensing or decision-making — e.g. washing machine, vending machine.\n• A robot adapts to changes (new obstacle); an automated machine cannot.\n• A robot usually has multiple sensors and actuators working in a feedback loop.' },
      ],
    },
  },

  c9_r_3: {
    figs: ['robotTimeline'],
    sections: [
      { h: 'Robots from the 1900s onwards', b: `Your syllabus focuses on robotics history from the 1900s:
• **1920** — Karel Čapek's play R.U.R. introduces the word "robot".
• **1942** — Isaac Asimov writes the Three Laws of Robotics in the story "Runaround" and later coins the word "robotics".
• **1948–49** — William Grey Walter builds "tortoise" robots (Elmer and Elsie) that move towards light — early autonomous robots.
• **1954** — George Devol patents a programmable robot arm.
• **1961** — **Unimate**, the first industrial robot, starts work at a General Motors plant lifting hot metal parts. Joseph Engelberger, called the "father of robotics", commercialised it with Devol.
• **1966–72** — **Shakey** (Stanford) is the first mobile robot that could reason about its actions.
• **1973** — WABOT-1 (Japan), the first full-scale humanoid robot.
• **1997** — Sojourner, the first rover on Mars.
• **2000** — Honda's ASIMO humanoid walks and climbs stairs.
• **2002** — iRobot's Roomba brings robots into homes.
• **2013 onwards** — Boston Dynamics' Atlas and Spot show advanced legged movement.
• **2021** — Perseverance rover lands on Mars with the Ingenuity helicopter.` },
      { h: 'Robotics in India', b: `• **Chandrayaan-3's Pragyan rover** (2023) explored the Moon's south polar region.
• **Vyommitra** — a half-humanoid robot made by ISRO for the Gaganyaan human spaceflight programme.
• **DRDO's Daksh** — a remotely operated robot for handling and disposing of bombs.
• Indian start-ups build warehouse robots, agricultural drones and surgical systems.` },
      { h: 'Four big shifts in robot history', b: `1. **Mechanical → electronic:** clockwork automata became motor- and circuit-driven machines.
2. **Fixed → programmable:** Unimate showed one machine could be re-taught new jobs.
3. **Factory → everywhere:** robots moved from car plants to homes, hospitals, farms and space.
4. **Programmed → learning:** modern robots use AI to recognise objects and improve with experience.` },
    ],
    exam: {
      short: [
        { q: 'What was Unimate?', a: 'Unimate was the first industrial robot, invented by George Devol, installed at a General Motors factory in 1961 to handle hot die-cast parts.' },
        { q: 'Who is called the father of robotics and why?', a: 'Joseph Engelberger — he worked with George Devol to build and sell Unimate, starting the industrial robot industry.' },
        { q: 'Name two robots that have explored other worlds.', a: 'Perseverance (NASA, Mars, 2021) and Pragyan (ISRO, Moon, 2023). (Also: Sojourner, Curiosity.)' },
      ],
      long: [
        { q: 'Trace the evolution of robots from 1920 to the present day, mentioning at least five milestones.', a: '1920 — the word "robot" in Čapek\'s R.U.R.; 1942 — Asimov\'s Three Laws; 1961 — Unimate, first industrial robot at GM; 1966 — Shakey, first reasoning mobile robot; 2000 — ASIMO humanoid; 2002 — Roomba home robot; 2021 — Perseverance on Mars. Trend: from fixed mechanical machines to programmable, mobile and finally AI-powered robots.' },
        { q: 'How has the role of robots changed from early industrial robots to modern robots?', a: 'Early robots (1960s) were fixed arms doing one repetitive job in factories behind safety cages. Today robots are mobile (wheels, legs, wings), work in many fields (homes, hospitals, farms, space), work safely beside humans (cobots), and use AI and cameras to recognise objects, learn and make decisions.' },
      ],
    },
  },

  c9_r_4: {
    sections: [
      { h: 'The laws — statements to learn', b: `Your syllabus asks only for the **statements** of Asimov's laws. Learn them word for word:
1. **First Law:** A robot may not injure a human being or, through inaction, allow a human being to come to harm.
2. **Second Law:** A robot must obey the orders given it by human beings except where such orders would conflict with the First Law.
3. **Third Law:** A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.

Asimov first wrote them in his 1942 short story **"Runaround"**. The **Zeroth Law** — "A robot may not harm humanity, or, by inaction, allow humanity to come to harm" — was added later and ranks above the other three.` },
      { h: 'Order of priority', b: `The laws form a hierarchy: **human safety > obedience > self-protection**. So a robot must refuse an order that would hurt someone, and must sacrifice itself if that is needed to save a person.` },
      { h: 'How the ideas appear in real robots today', b: `Real robots do not "understand" Asimov's laws, but engineers build the same ideas into safety systems:
• **Emergency stop buttons** and light curtains that halt a factory robot when a person enters (First Law idea).
• **Cobots** that limit their force and speed near people.
• Self-driving car rules that make the car brake if a pedestrian is detected.
• International safety standards such as ISO 10218 for industrial robots.
The laws are fiction, but they started the serious discussion of **robot ethics**.` },
    ],
    exam: {
      short: [
        { q: 'State the First Law of Robotics.', a: 'A robot may not injure a human being or, through inaction, allow a human being to come to harm.' },
        { q: 'Who proposed the laws of robotics and in which story?', a: 'Isaac Asimov, in his 1942 short story "Runaround".' },
        { q: 'What is the Zeroth Law?', a: 'A robot may not harm humanity, or, by inaction, allow humanity to come to harm. It has the highest priority.' },
      ],
      long: [
        { q: 'State Asimov\'s three laws of robotics in order.', a: '1. A robot may not injure a human being or, through inaction, allow a human being to come to harm.\n2. A robot must obey the orders given it by human beings except where such orders would conflict with the First Law.\n3. A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.' },
        { q: 'Why are Asimov\'s laws important today even though they were written for fiction?', a: 'They made people think about robot safety and ethics. Their ideas — protect humans first, obey people, avoid damage — are built into real safety features: emergency stops, safety cages and sensors, force-limited cobots, and rules for self-driving cars. They also raise questions about accountability when autonomous systems cause harm.' },
      ],
    },
  },

  c9_r_5: {
    figs: ['robotClassification'],
    sections: [
      { h: 'Classification by field / terrain (where it works)', b: `The syllabus groups robots by the terrain they move in:
• **Ground robots** — work on land. Wheeled (rovers, AGVs, Roomba), tracked (bomb-disposal robots), legged (Spot, humanoids).
• **Aerial robots** — fly. Drones/UAVs (quadcopters, fixed-wing) used for photography, crop spraying, delivery and surveys.
• **Underwater robots** — ROVs (remotely operated vehicles) and AUVs (autonomous underwater vehicles) inspect pipelines, study marine life and search shipwrecks.
• **Space robots** — rovers and robotic arms on spacecraft (Canadarm on the International Space Station).` },
      { h: 'Classification by control (who decides)', b: `• **Manual (teleoperated) robots** — a human operator controls them remotely, e.g. a bomb-disposal robot, the Da Vinci surgical robot (surgeon controls every move).
• **Automatic robots** — follow a pre-programmed sequence once started, e.g. an assembly-line welding arm.
• **Autonomous robots** — sense, decide and act by themselves in changing surroundings, e.g. a self-driving car, a robotic lawn mower.` },
      { h: 'Bio-inspired robots', b: `**Bio-inspired (biomimetic) robots** copy how animals move or sense, because nature has already solved many engineering problems:
• **Snake robots** slither through rubble and pipes.
• **Fish robots** swim efficiently with tail fins.
• **Gecko robots** climb walls using sticky foot pads.
• **Insect / hexapod robots** walk steadily on 6 legs over rough ground.
• **Bird and bat drones** flap their wings.
• **Robotic dogs** (quadrupeds) climb stairs.` },
      { h: 'Other common classifications', b: `By application: industrial, medical, domestic, defence, entertainment, agricultural, educational, space.
By locomotion: stationary, wheeled, tracked, legged, flying, swimming.
By shape: articulated arm, SCARA, Cartesian (gantry), humanoid, mobile.` },
    ],
    exam: {
      short: [
        { q: 'What is a bio-inspired robot? Give one example.', a: 'A robot whose design copies the movement or sensing of a living creature, e.g. a snake robot that slithers through rubble.' },
        { q: 'Differentiate between a manual and an autonomous robot.', a: 'A manual (teleoperated) robot is controlled step by step by a human operator; an autonomous robot senses, decides and acts by itself without continuous human control.' },
        { q: 'Classify robots on the basis of terrain.', a: 'Ground (wheeled, tracked, legged), aerial (drones), underwater (ROV/AUV) and space robots.' },
      ],
      long: [
        { q: 'Classify robots based on (a) field/terrain and (b) control. Give an example of each type.', a: '(a) **Terrain:** Ground — Roomba/Mars rover; Aerial — agricultural drone; Underwater — AUV inspecting pipelines; Space — Canadarm.\n(b) **Control:** Manual/teleoperated — bomb-disposal robot; Automatic — welding arm repeating a program; Autonomous — self-driving car or robotic lawn mower.' },
        { q: 'Explain bio-inspired robots with three examples and why engineers copy nature.', a: 'Bio-inspired robots imitate animals. Examples: snake robots for search and rescue in collapsed buildings; gecko robots that climb glass walls; fish robots for quiet underwater monitoring; hexapods for stable walking. Engineers copy nature because animals have evolved efficient, stable and energy-saving ways to move and sense in difficult terrain.' },
      ],
    },
  },

  c9_r_6: {
    sections: [
      { h: 'Domestic robots', b: `• **Robot vacuum cleaners and mops** (Roomba) map rooms and clean on schedule.
• **Lawn-mowing and pool-cleaning robots.**
• **Smart assistants** with robotic bodies, and companion robots for elderly people.
Benefit: saves time on boring household chores.` },
      { h: 'Industrial robots', b: `• **Welding, painting and assembly arms** in car factories.
• **Pick-and-place robots** in electronics and food packaging.
• **AGVs / AMRs** (automated guided vehicles / autonomous mobile robots) carry parts and boxes in warehouses.
Benefit: speed, quality and worker safety.` },
      { h: 'Medical robots', b: `• **Surgical robots** (Da Vinci) for minimally invasive surgery — tiny cuts, steady hands.
• **Rehabilitation robots and exoskeletons** help patients walk again.
• **Pharmacy and hospital delivery robots** move medicines and samples.
• **Disinfection robots** use UV light to clean rooms.` },
      { h: 'Defence robots', b: `• **Bomb-disposal robots** (DRDO Daksh) defuse explosives from a safe distance.
• **Surveillance drones** watch borders.
• **Unmanned ground vehicles** carry supplies.
Benefit: keep soldiers out of danger.` },
      { h: 'Entertainment robots', b: `• **Animatronic characters** in theme parks.
• **Robot pets and toys** (Sony Aibo).
• **Drone light shows** with hundreds of synchronised drones.
• **Camera robots** for film and sports.` },
      { h: 'Agricultural robots', b: `• **Drones** spray fertiliser and pesticide precisely and monitor crop health.
• **Autonomous tractors** plough and sow along GPS paths.
• **Fruit-picking robots** use cameras to find ripe fruit.
• **Weeding robots** remove weeds without chemicals.
Benefit: less labour, less chemical use, higher yield.` },
    ],
    exam: {
      short: [
        { q: 'Give two uses of robots in agriculture.', a: 'Spraying fertiliser/pesticide with drones; autonomous tractors for sowing/ploughing (also fruit picking, weeding, crop monitoring).' },
        { q: 'How do robots help in defence?', a: 'They dispose of bombs (e.g. DRDO Daksh), carry out surveillance with drones and carry supplies — keeping soldiers away from danger.' },
        { q: 'Name a medical robot and state its use.', a: 'Da Vinci surgical system — used for precise minimally invasive surgery.' },
      ],
      long: [
        { q: 'Describe the applications of robots in any five fields.', a: 'Domestic — robot vacuum cleaners; Industrial — welding/painting arms and warehouse AGVs; Medical — Da Vinci surgical robot, exoskeletons; Defence — bomb-disposal robots, surveillance drones; Agriculture — spraying drones, autonomous tractors; Entertainment — animatronics, robot pets, drone shows. Each improves safety, speed or precision.' },
        { q: 'Explain how robots make work safer, with three examples.', a: 'Robots take over dangerous jobs: (1) bomb-disposal robots handle explosives instead of soldiers; (2) industrial arms handle hot metal, sharp tools and toxic paint fumes; (3) underwater and space robots work where humans cannot survive. Disinfection robots also protect hospital staff from infection.' },
      ],
    },
  },

  c9_r_7: {
    figs: ['robotBlock'],
    sections: [
      { h: 'The general block diagram of a robot', b: `Exam questions often ask you to **draw and explain the block diagram** of a robot. Its blocks:
• **Sensors (input)** — collect data about the environment and the robot itself.
• **Controller (processing)** — a microcontroller or computer that runs the program and makes decisions.
• **Actuators (output)** — motors, servos and pistons that create movement.
• **Mechanism / end-effector** — the links, joints, wheels and gripper that the actuators move.
• **Power supply** — battery or mains that powers all blocks.
• **Communication** — Bluetooth, Wi-Fi or cable to talk to a user or another computer.
Arrows show the flow: sensors → controller → actuators → mechanism → environment → back to sensors (feedback).` },
      { h: 'The three main blocks: mechanical, electronic, computational', b: `The syllabus groups a robot's parts into three blocks:
• **Mechanical block** — frame/chassis, links, joints, gears, wheels, grippers. Gives the robot its shape, strength and motion.
• **Electronic block** — sensors, motor drivers, motors, batteries, wiring, circuit boards. Carries power and signals.
• **Computational block** — the microcontroller/SBC and its software: algorithms, control logic, AI models. Makes decisions.` },
      { h: 'Designing different kinds of robots', b: `The same blocks are arranged differently for different robots:
• **Humanoid** — mechanical: legs, arms, head with many joints; electronic: dozens of servos, IMU for balance, cameras; computational: balance control and walking algorithms.
• **Aerial (drone)** — light frame, 4+ brushless motors with propellers, ESCs, LiPo battery; flight controller with IMU, barometer and GPS that adjusts motor speeds hundreds of times a second.
• **Underwater** — waterproof sealed hull, thrusters, pressure and sonar sensors; navigation without GPS (inertial and sonar).
• **Mobile (wheeled)** — chassis, wheels and DC motors, motor driver, ultrasonic/IR sensors, battery; controller running obstacle-avoidance or line-following code.` },
    ],
    exam: {
      short: [
        { q: 'Name the three main blocks of a robot.', a: 'Mechanical block, electronic block and computational block.' },
        { q: 'What is the role of the controller in a robot?', a: 'It is the robot\'s brain: it reads sensor data, runs the program and sends commands to the actuators.' },
        { q: 'Give two components each of the mechanical and electronic blocks.', a: 'Mechanical: chassis, gears (also links, joints, wheels, gripper). Electronic: sensors, motors (also motor driver, battery, wiring).' },
      ],
      long: [
        { q: 'Draw a labelled block diagram of a robot and explain the function of each block.', a: 'Diagram: Power supply feeding the Controller; Sensors → Controller → Actuators → Mechanism/End-effector; Communication ↔ Controller; feedback from environment to sensors.\n• Sensors: gather information.\n• Controller: processes data and decides.\n• Actuators: produce motion.\n• Mechanism: links/joints/wheels/gripper doing the work.\n• Power supply: provides energy.\n• Communication: exchanges data with users/other devices.' },
        { q: 'Compare the design of an aerial robot and a humanoid robot in terms of mechanical, electronic and computational blocks.', a: '**Aerial:** mechanical — light frame and propellers; electronic — brushless motors, ESCs, LiPo battery, IMU/GPS; computational — flight controller stabilising the drone hundreds of times per second.\n**Humanoid:** mechanical — legs, arms, many joints; electronic — many servos, cameras, IMU; computational — balance and walking control, vision. Drones prioritise low weight; humanoids prioritise balance and many degrees of freedom.' },
      ],
    },
  },

  c9_r_8: {
    sections: [
      { h: 'Mechanical building blocks', b: `• **Frame / chassis** — the skeleton. Materials: aluminium (light, strong), acrylic (cheap, easy to cut), steel (very strong, heavy), 3D-printed plastic.
• **Links** — rigid parts connecting joints (like bones).
• **Joints** — allow movement between links (revolute, prismatic, spherical).
• **Transmission** — gears, belts, pulleys and chains that transfer motion and change speed/torque.
• **Locomotion parts** — wheels, tracks, legs, propellers.
• **End-effector** — the tool at the end: gripper, suction cup, welding torch, spray gun.` },
      { h: 'Electronic building blocks', b: `• **Sensors** — IR, ultrasonic, LDR, temperature, touch, camera, IMU.
• **Actuators** — DC motors, servo motors, stepper motors, solenoids.
• **Motor driver** — an IC (like L298N) that lets a small control signal switch the large current motors need, and reverse direction.
• **Power** — batteries plus regulators that give steady 5 V / 3.3 V.
• **Communication modules** — Bluetooth (HC-05), Wi-Fi (ESP8266/ESP32), radio.

[fig:ledCircuit]` },
      { h: 'Computational building blocks', b: `• **Microcontroller (MCU)** — a small computer on one chip for real-time control, e.g. Arduino Uno (ATmega328P).
• **Single-board computer (SBC)** — a full computer on a board with an operating system, e.g. Raspberry Pi — used for cameras and AI.
• **Software** — the program (Arduino C/C++ or Python), libraries, and algorithms like obstacle avoidance or PID control.` },
      { h: 'Example: parts list of an obstacle-avoiding car', b: `• Mechanical: 2WD chassis, 2 gear motors with wheels, castor wheel.
• Electronic: HC-SR04 ultrasonic sensor, L298N motor driver, 2 × 18650 battery pack, switch, jumper wires.
• Computational: Arduino Uno running a sketch that reads distance and turns when it is less than 20 cm.` },
    ],
    exam: {
      short: [
        { q: 'What is an end-effector? Give two examples.', a: 'The device at the end of a robot arm that interacts with objects — e.g. a gripper, suction cup, welding torch or spray gun.' },
        { q: 'Why is a motor driver needed between a microcontroller and a motor?', a: 'A microcontroller pin gives only a few milliamps; a motor needs hundreds of milliamps and direction reversal. The driver switches the large current safely using the small control signal.' },
        { q: 'Differentiate between a microcontroller and a single-board computer.', a: 'A microcontroller (Arduino) is a simple chip for real-time control without an operating system; an SBC (Raspberry Pi) is a full computer with an OS, more memory and power, used for vision/AI.' },
      ],
      long: [
        { q: 'List the building blocks of a robot and explain the function of each.', a: 'Frame (supports everything), actuators (create motion), sensors (perceive), controller (decides), power supply (energy), communication modules (exchange data), end-effectors (interact with objects) and software (instructions tying it all together).' },
        { q: 'Describe the parts of a simple obstacle-avoiding robot under mechanical, electronic and computational blocks.', a: 'Mechanical: chassis, wheels, gear motors, castor wheel. Electronic: ultrasonic sensor, motor driver (L298N), battery pack and wires. Computational: Arduino Uno running code that reads the distance, and if it is under 20 cm, stops and turns; otherwise drives forward.' },
      ],
    },
  },

  c9_r_9: {
    figs: ['robotIdentify'],
    sections: [
      { h: 'Identifying robots by their type', b: `The syllabus asks you to identify three common robot types from demonstrations or videos:

**1. Industrial arm (articulated robot)**
• Fixed to the floor; looks like a human arm with base, shoulder, elbow and wrist.
• Usually 6 rotary joints (6 DOF) and an end-effector (gripper, welding torch).
• Found in car and electronics factories, often inside safety fences.

**2. Humanoid robot**
• Human-like body: head, torso, two arms, two legs.
• Walks on two legs, may have cameras for eyes and microphones for ears.
• Examples: ASIMO, Atlas, Sophia, NAO, ISRO's Vyommitra.

**3. Mobile robot**
• Moves around its environment on wheels, tracks, legs or propellers.
• Examples: Roomba, warehouse AGVs, Mars rovers, delivery robots, drones.` },
      { h: 'A quick checklist', b: `When you watch a machine, ask:
1. Does it **sense** anything?
2. Does it **decide** based on what it senses?
3. Does it **move or act** physically?
4. Can it work **on its own** for some time?
If the answer to all four is yes, it is a robot. Then decide its type: fixed arm, humanoid or mobile.` },
    ],
    exam: {
      short: [
        { q: 'State two features that help identify an industrial arm robot.', a: 'It is fixed to a base and has several rotary joints (shoulder, elbow, wrist) ending in an end-effector such as a gripper.' },
        { q: 'Why is a remote-control car not a robot?', a: 'It has no sensing or decision-making of its own; every movement is controlled by a human, so it has no autonomy.' },
        { q: 'Give two examples of humanoid robots.', a: 'ASIMO and Atlas (also Sophia, NAO, Vyommitra).' },
      ],
      long: [
        { q: 'How will you identify an industrial arm, a humanoid and a mobile robot? Give one example of each.', a: 'Industrial arm — fixed base, jointed arm with wrist and end-effector, works in factories (e.g. KUKA welding robot). Humanoid — human-like head, torso, arms and legs, walks on two legs (e.g. ASIMO). Mobile — moves around on wheels/tracks/legs/propellers (e.g. Roomba, Mars rover).' },
        { q: 'Explain the four criteria used to decide whether a device is a robot. Apply them to a vending machine and a Roomba.', a: 'Criteria: sensing, processing/decision-making, actuation and autonomy. Vending machine: limited sensing (coin/button), fixed sequence, no autonomy beyond that → automated machine. Roomba: senses walls/dirt/cliffs, plans paths, drives and cleans, works by itself → robot.' },
      ],
    },
  },

  c9_r_10: {
    figs: ['workspace', 'accuracyRepeat'],
    sections: [
      { h: 'Robot specifications explained', b: `• **Workspace (work envelope):** the region the end-effector can reach. For a two-link arm it is a ring whose outer radius is L₁ + L₂.
• **Payload:** the maximum load the robot can handle at full speed, including the gripper's own weight.
• **Reach:** the furthest distance from the base the end-effector can reach.
• **Accuracy:** how close the robot gets to a commanded point.
• **Repeatability:** how close it returns to the same point every time. Industrial arms often have repeatability of ±0.02 mm — better than their accuracy.
• **Resolution:** the smallest step the robot can move.
• **Speed:** how fast the end-effector moves (mm/s) or a joint turns (°/s).` },
      { h: 'Types of motion (1-D and 2-D)', b: `[fig:motionTypes]
• **Linear (translational) motion** — movement along a straight line, e.g. a lift going up, a conveyor belt, a prismatic joint. This is **one-dimensional (1-D)** motion: position needs one number (distance along the line).
• **Angular (rotational) motion** — turning about a fixed axis through an angle, e.g. a robot elbow joint, a door. Measured in degrees or radians.
• **Circular motion** — moving along a circular path around a centre, e.g. a point on a spinning wheel, a fan blade tip.
• **Two-dimensional (2-D) motion** — movement on a flat plane, needing two numbers (x and y), e.g. a robot vacuum moving around a floor, a pen-plotter.` },
      { h: 'Open loop vs closed loop', b: `[fig:openClosedLoop]
An **open-loop** system runs commands without measuring the result — cheap and simple but cannot correct errors (a toaster on a timer burns bread if the bread is thin).
A **closed-loop** system measures the output with a sensor and corrects the error continuously — more accurate (a thermostat-controlled air conditioner, a servo motor that holds its angle).` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between accuracy and repeatability.', a: 'Accuracy: how close the robot reaches the commanded target. Repeatability: how consistently it returns to the same point over many tries.' },
        { q: 'What is the payload of a robot?', a: 'The maximum weight the robot can carry or handle safely (including its end-effector).' },
        { q: 'Give one example each of linear and angular motion in robots.', a: 'Linear — a prismatic joint sliding or a lift moving up; angular — a revolute elbow joint turning through 90°.' },
      ],
      long: [
        { q: 'Explain linear, angular and circular motion with a labelled sketch and robotic examples.', a: 'Linear: straight-line movement (1-D), e.g. gantry robot axis, conveyor. Angular: rotation about a fixed axis through an angle θ, e.g. robot arm joint. Circular: path around a centre, e.g. wheel rim, rotating table. Sketch: arrow along a line; arm pivot with angle θ; object on a circle with arrow.' },
        { q: 'Distinguish between open-loop and closed-loop control with a block diagram and one example each.', a: 'Open loop: Input → Controller → Actuator → Output; no sensor; example: fixed-time washing machine/toaster. Closed loop: Set point → (comparator) → Controller → Actuator → Output, with Sensor feeding output back to the comparator to compute error; example: AC thermostat or line follower. Closed loop is accurate and self-correcting; open loop is simpler and cheaper.' },
      ],
    },
  },

  c9_r_11: {
    figs: ['actuatorTypes'],
    sections: [
      { h: 'How a DC motor is controlled', b: `• **Speed** is controlled with **PWM** (pulse-width modulation): the controller switches the supply on and off very fast. A longer ON-time (higher duty cycle) means a higher average voltage and faster motor.
• **Direction** is reversed by reversing the current, using an **H-bridge** motor driver such as the L298N or L293D.
[fig:pwm]` },
      { h: 'Servo motors and stepper motors', b: `**Servo motor:** a DC motor + gearbox + position sensor (potentiometer) + control circuit in one box. It receives a pulse every 20 ms; the pulse width (about 1–2 ms) sets the angle (0–180°). It uses **closed-loop control** to hold that angle — ideal for robot arm joints and steering.

**Stepper motor:** rotates in exact fixed steps (commonly 200 steps per revolution = 1.8° per step). It is **open-loop** — the controller just counts steps. Used in 3D printers and CNC machines where exact positioning matters.` },
      { h: 'Linear vs rotary actuators', b: `• **Rotary actuators** produce turning motion: DC, servo and stepper motors, rotary hydraulic motors.
• **Linear actuators** produce straight-line push/pull: hydraulic and pneumatic cylinders (pistons), solenoids, lead-screw actuators. A rotary motor can also be turned into linear motion using a rack and pinion or lead screw.` },
      { h: 'Choosing an actuator', b: `• Very high force (excavator, press) → **hydraulic**
• Fast, light, simple on/off grip → **pneumatic**
• Precise, clean, easy to control → **electric**
• Continuous rotation (wheels) → DC motor
• Fixed angle (arm joint) → servo
• Exact repeatable positioning → stepper` },
    ],
    exam: {
      short: [
        { q: 'What is an actuator?', a: 'A device that converts energy (electrical, hydraulic or pneumatic) into physical motion — the "muscles" of a robot.' },
        { q: 'Why is a stepper motor used in 3D printers?', a: 'It moves in exact fixed steps (e.g. 1.8°), so the controller can position the print head precisely by counting steps.' },
        { q: 'How is the speed of a DC motor controlled by a microcontroller?', a: 'By PWM — changing the duty cycle (ON-time) of a fast on/off signal, which changes the average voltage.' },
      ],
      long: [
        { q: 'Compare electric, hydraulic and pneumatic actuators under: working medium, force, speed, precision, and one application each.', a: 'Electric — electricity; medium force; good speed; high precision; robot arm joints. Hydraulic — pressurised oil; very high force; slower; good precision but may leak; excavators, presses. Pneumatic — compressed air; low–medium force; very fast; less precise; pick-and-place grippers.' },
        { q: 'Explain the working of a servo motor and state why it is suitable for robotic arms.', a: 'A servo contains a DC motor, gearbox, potentiometer and control board. The controller sends a pulse every 20 ms whose width (1–2 ms) sets the target angle. The internal circuit compares the actual angle (from the potentiometer) with the target and drives the motor until they match — closed-loop control. It is compact, precise and holds its position, which suits arm joints.' },
      ],
    },
  },

  c9_r_12: {
    figs: ['jointTypes', 'fourBar'],
    sections: [
      { h: 'Links: rigid and soft', b: `A **link** is a body that connects two or more joints.
• **Rigid links** do not bend — metal or hard plastic arms of an industrial robot. They give accuracy and strength.
• **Soft (flexible) links** bend and stretch — made of silicone, rubber or fabric. **Soft robots** use them to grip delicate objects like fruit or eggs, and to squeeze through gaps. Example: soft grippers inflated by air.` },
      { h: 'Joints and the motion they allow', b: `• **Revolute (R)** — rotation about one axis (1 DOF). Example: elbow, door hinge, most robot arm joints.
• **Prismatic (P)** — sliding along one axis (1 DOF). Example: telescopic antenna, lift, drawer, Cartesian robot axis.
• **Spherical (S)** — rotation about three axes (3 DOF). Example: ball-and-socket shoulder/hip, joystick, camera mount.
• **Cylindrical (C)** — rotate and slide on the same axis (2 DOF).
• **Planar** — slide in two directions and rotate in a plane (3 DOF).
Joints that allow only one motion (R, P) are easiest to motorise, so most robots are built from them.` },
      { h: 'Combining links and joints to make specific motion', b: `By choosing joint types and link lengths we design the motion we need:
• **R + R** (two revolute joints) → the end moves on a 2-D plane — like a human arm drawing on a table. [fig:rrMechanism]
• **P + P + P** → a **Cartesian (gantry) robot** that moves in straight lines along x, y, z — used in 3D printers and CNC machines.
• **R + R + P** (with vertical axes) → a **SCARA robot** for fast pick-and-place on circuit boards.
• **Four-bar linkage** → turns continuous rotation of a crank into a back-and-forth rocking motion — windscreen wipers, bicycle pedalling mechanism, excavator buckets.
• **Rack and pinion** → turns rotation into straight-line motion — steering in cars.` },
      { h: 'Identifying links and joints in real systems', b: `Look at an **industrial robot arm**: base (link 0) → waist joint (R) → shoulder link → shoulder joint (R) → upper arm → elbow joint (R) → forearm → wrist joints (R, R, R) → end-effector. That is 6 revolute joints = 6 DOF.
A **lift** has one prismatic joint. A **door** has one revolute joint. A **desk lamp** has several revolute joints in a chain.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between a revolute and a prismatic joint.', a: 'Revolute: allows rotation about an axis (e.g. elbow). Prismatic: allows sliding along a straight line (e.g. drawer). Both have 1 DOF.' },
        { q: 'What is a soft link? Give one use.', a: 'A flexible link made of materials like silicone that can bend; used in soft grippers that hold delicate objects such as fruit.' },
        { q: 'Which mechanism converts rotation into back-and-forth rocking? Give an example.', a: 'The four-bar linkage (crank–rocker), e.g. car windscreen wipers.' },
      ],
      long: [
        { q: 'Explain with diagrams the revolute, prismatic and spherical joints, giving one human/real-life example and DOF of each.', a: 'Revolute — rotation about one axis, 1 DOF, e.g. elbow/hinge. Prismatic — sliding along an axis, 1 DOF, e.g. lift/drawer. Spherical — rotation about three axes, 3 DOF, e.g. shoulder/hip ball-and-socket. Diagrams: hinge with rotation arrow; slider in a guide with double arrow; ball inside socket with curved arrows.' },
        { q: 'How are links and joints combined to create specific motions? Explain with three examples.', a: 'Two revolute joints (RR arm) let the end move anywhere in a plane; three prismatic joints at right angles make a Cartesian robot for 3D printers; a four-bar linkage turns crank rotation into rocking for wipers; a rack and pinion turns rotation into linear motion for steering. Designers choose joint types and link lengths to get the required path and workspace.' },
      ],
    },
  },

  c9_r_13: {
    figs: ['dof6'],
    sections: [
      { h: 'Counting DOF of a robot arm', b: `For a serial robot arm (one joint after another), **DOF = number of independent joints** (each revolute or prismatic joint adds 1).
• Lift: 1 prismatic joint → 1 DOF.
• SCARA: R, R, P, R → 4 DOF.
• Typical industrial arm: 6 revolute joints → 6 DOF (3 to position the wrist, 3 to orient the tool).
• A gripper opening/closing is usually **not** counted as a DOF of the arm.` },
      { h: 'DOF of a mobile robot', b: `A car-like robot on a flat floor can be at any **x, y** position and face any heading **θ** → 3 DOF in the plane. But it cannot slide sideways directly, which is why parking is hard. Robots with **mecanum or omni wheels** can move sideways and are called **holonomic**.` },
      { h: 'Grübler\'s formula worked example', b: `For planar mechanisms: **DOF = 3(n − 1) − 2j₁ − j₂**
where n = number of links (including the fixed ground link), j₁ = 1-DOF joints, j₂ = 2-DOF joints.

Four-bar linkage: n = 4, j₁ = 4, j₂ = 0
DOF = 3(4 − 1) − 2(4) − 0 = 9 − 8 = **1**
So one motor at the crank controls the whole linkage.

Three links joined in a triangle: n = 3, j₁ = 3 → DOF = 6 − 6 = **0** → a rigid structure (a truss), not a mechanism.` },
      { h: 'Identifying DOF around you', b: `• Door: 1 DOF (rotation).
• Drawer: 1 DOF (translation).
• Ceiling fan: 1 DOF.
• Computer mouse on a desk: 2 DOF (x, y) — 3 if you count rotation.
• Human arm (shoulder 3 + elbow 1 + wrist 3): 7 DOF — one more than needed, which lets you keep your hand still while moving your elbow.
• Drone in the air: 6 DOF.` },
    ],
    exam: {
      short: [
        { q: 'Define degree of freedom.', a: 'The number of independent movements (translations and rotations) a body or mechanism can make.' },
        { q: 'How many DOF does a free object in space have? Name them.', a: 'Six: translation along x, y, z and rotation roll, pitch, yaw.' },
        { q: 'Why do industrial arms usually have 6 DOF?', a: 'Three DOF place the wrist at any position and three more orient the tool in any direction, so the arm can reach any position with any orientation.' },
      ],
      long: [
        { q: 'Using Grübler\'s formula, find the DOF of a four-bar linkage. What does the answer mean?', a: 'DOF = 3(n − 1) − 2j₁ − j₂ with n = 4 links, j₁ = 4 revolute joints, j₂ = 0. DOF = 3 × 3 − 8 = 1. It means one input (e.g. a motor turning the crank) fully determines the position of every other link.' },
        { q: 'Identify the DOF of: (a) a door (b) a SCARA robot (c) a human arm (d) a drone (e) a lift. Give reasons.', a: '(a) 1 — rotates about the hinge. (b) 4 — R, R, P, R joints. (c) 7 — shoulder 3, elbow 1, wrist 3. (d) 6 — free to move and rotate in 3-D. (e) 1 — moves only up/down.' },
      ],
    },
  },
};
