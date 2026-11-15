// Class 10 — textbook notes, diagrams and exam questions.
// Follows the Class X Robotics & AI syllabus.
export default {
  c10_r_1: {
    sections: [
      { h: 'Types of new-age robots in your syllabus', b: `• **Warehouse robots** — AMRs and shelf-carrying robots (Amazon, Flipkart warehouses) bring goods to packers, sort parcels and stack boxes.
• **Assistant robots** — receptionist and guide robots in malls, airports, hospitals and banks; voice-controlled home assistants with screens.
• **Smart home robots** — robot vacuums/mops, lawn mowers, security robots that patrol and stream video; connected to IoT devices such as smart lights and locks.
• **Smart school robots** — tutoring and telepresence robots, coding robots for STEM labs.
• **Smart mobility robots** — robotic wheelchairs, delivery robots on footpaths, autonomous shuttles.
• **Driver-assisted cars and autonomous cars** — lane-keeping, adaptive cruise control, automatic emergency braking, self-parking.
• **Drones** — delivery, crop spraying, mapping, inspection, disaster relief, filming.
• **Healthcare robots** — surgical robots, rehabilitation exoskeletons, pharmacy dispensing, UV disinfection, patient-lifting robots.
• **Robotic elevators/lifts** — smart lifts that schedule cars by demand, talk to delivery robots and ride floors on their own.` },
      { h: 'Technologies behind them', b: `• **AI and machine learning** — recognise objects, understand speech, plan paths.
• **IoT** — robots share data with other smart devices.
• **Cloud and edge computing** — heavy computation in the cloud, fast reactions on the robot.
• **SLAM (Simultaneous Localisation and Mapping)** — the robot builds a map while working out where it is.
• **5G** — low-latency remote control and fleet coordination.
• **Advanced sensors** — LIDAR, depth cameras, force sensors.` },
      { h: 'Benefits and concerns', b: `Benefits: faster deliveries, safer roads, help for the elderly and disabled, round-the-clock service.
Concerns: high cost, job changes, privacy (home robots with cameras), cybersecurity, safety when robots share space with people, and the need for clear laws.` },
    ],
    exam: {
      short: [
        { q: 'Give any four types of new-age robots.', a: 'Warehouse robots, assistant robots, smart home robots, drones (also driver-assisted cars, healthcare robots, smart mobility robots, robotic elevators).' },
        { q: 'What is a driver-assisted car? Give two features.', a: 'A car that uses sensors and software to help the driver, e.g. adaptive cruise control and automatic emergency braking (also lane-keeping, self-parking).' },
        { q: 'How are robots used in warehouses?', a: 'Autonomous mobile robots carry shelves or boxes to packers, sort parcels and move goods, making order-picking faster and reducing walking for workers.' },
      ],
      long: [
        { q: 'Explain the use of robots in (a) smart homes (b) healthcare (c) warehouses (d) mobility.', a: '(a) Smart homes — robot vacuums, lawn mowers, security patrol robots linked to IoT devices. (b) Healthcare — surgical robots for precise operations, exoskeletons for rehabilitation, pharmacy and UV-disinfection robots. (c) Warehouses — AMRs moving shelves and parcels, sorting robots, robotic arms picking items. (d) Mobility — robotic wheelchairs, delivery robots, autonomous shuttles and driver-assisted cars.' },
        { q: 'Describe five technologies that make new-age robots possible.', a: 'AI/ML for perception and decisions; IoT for connecting to other devices; cloud and edge computing for heavy and fast processing; SLAM for mapping and navigation; 5G for low-latency communication; advanced sensors such as LIDAR and depth cameras.' },
      ],
    },
  },

  c10_r_2: {
    sections: [
      { h: 'Industrial robot configurations', b: `• **Articulated** — all revolute joints (usually 6); most flexible; welding, painting, assembly.
• **SCARA** (Selective Compliance Assembly Robot Arm) — R-R-P-R; fast and rigid vertically; electronics assembly, pick-and-place.
• **Cartesian / gantry** — three prismatic joints (x, y, z); simple, accurate; 3D printers, CNC, palletising.
• **Cylindrical** — R-P-P; machine loading.
• **Delta (parallel)** — three arms joined at one platform; extremely fast picking of light items (biscuits, medicines).` },
      { h: 'Service robots: professional vs personal', b: `• **Professional service robots** are used by organisations: hospital logistics, cleaning large floors, security patrol, agriculture, inspection.
• **Personal/domestic service robots** are used at home: vacuum cleaners, lawn mowers, companion robots, toy robots.` },
    ],
    exam: {
      short: [
        { q: 'What does SCARA stand for? Give one use.', a: 'Selective Compliance Assembly Robot Arm; used for fast pick-and-place and electronics assembly.' },
        { q: 'What is a social robot? Give an example.', a: 'A robot designed to interact with people using speech, gestures and expressions, e.g. Pepper or NAO.' },
        { q: 'Name the joint configuration of a Cartesian robot.', a: 'Three prismatic joints (P-P-P) moving along x, y and z.' },
      ],
      long: [
        { q: 'Describe the different types of industrial robots with their joint configuration and uses.', a: 'Articulated (6R) — welding, painting; SCARA (RRPR) — assembly, pick-and-place; Cartesian (PPP) — 3D printers, CNC, palletising; Cylindrical (RPP) — machine tending; Delta (parallel) — high-speed picking of light products.' },
        { q: 'Classify modern robots into six categories with one example each.', a: 'Industrial — KUKA welding arm; Service — Roomba/hospital delivery robot; Social — Pepper; Agricultural — autonomous tractor/fruit picker; Military — PackBot/Daksh bomb disposal; Space — Perseverance rover/Canadarm2.' },
      ],
    },
  },

  c10_r_3: {
    sections: [
      { h: 'Machine vs robot — comparison table', b: `• **Sensing:** machine — little or none; robot — multiple sensors.
• **Decision-making:** machine — fixed sequence; robot — decides using sensor data and a program/AI.
• **Adaptability:** machine — cannot adapt; robot — adapts to changes.
• **Reprogrammability:** machine — usually one fixed job; robot — can be reprogrammed for new tasks.
• **Autonomy:** machine — needs human operation or trigger; robot — works on its own.
• **Examples:** machine — fan, mixer, washing machine, vending machine; robot — Roomba, self-driving car, industrial arm, drone with autopilot.` },
      { h: 'Grey areas', b: `Some devices sit in between. A modern washing machine senses load and adjusts water — it is "smart automation" but not a robot because it cannot move around or perform varied tasks. A CNC machine is programmable but does not sense and adapt by itself. Use the sense–decide–act–autonomy test to argue your answer in an exam.` },
    ],
    exam: {
      short: [
        { q: 'State two differences between a machine and a robot.', a: 'A robot senses its environment and makes decisions; a machine follows a fixed operation. A robot can be reprogrammed and adapt; a machine usually does one fixed job.' },
        { q: 'Is a CNC machine a robot? Justify.', a: 'Not fully — it is programmable but does not sense its surroundings or adapt by itself; it is a programmable automated machine.' },
        { q: 'Arrange in order of increasing intelligence: Roomba, hammer, vending machine, electric drill.', a: 'Hammer → electric drill → vending machine → Roomba.' },
      ],
      long: [
        { q: 'Differentiate between a machine and a robot under five headings with examples.', a: 'Sensing — machine: minimal (washing machine); robot: many sensors (self-driving car). Decision-making — fixed sequence vs decisions from data. Adaptability — none vs adapts. Programmability — single task vs reprogrammable. Autonomy — needs operator/trigger vs works independently (Roomba).' },
        { q: 'Explain the automation spectrum from manual tools to autonomous robots.', a: 'Manual tools (hammer) — human power and control; mechanised (electric drill) — motor power, human control; automated (vending machine) — fixed programmed sequence; programmable (CNC) — reprogrammable but no adaptation; autonomous robot (Roomba) — senses, decides and acts independently and adapts.' },
      ],
    },
  },

  c10_r_4: {
    figs: ['cobotVsRobot'],
    sections: [
      { h: 'Why cobots matter — from robots to cobots', b: `Traditional industrial robots are fast and powerful but dangerous, so they work inside cages and need expert programmers — suitable only for large factories doing one job for years. **Cobots** removed these barriers:
• No cage → less floor space, people can work beside them.
• Easy hand-guided programming → small businesses can use them.
• Lower cost and quick redeployment → good for small batches and changing products.
This progression from isolated robots to collaborative robots is the key idea in your syllabus.` },
      { h: 'Four modes of human–robot collaboration', b: `1. **Safety-rated monitored stop** — robot pauses when a person enters the shared zone.
2. **Hand guiding** — operator physically leads the robot to teach or move it.
3. **Speed and separation monitoring** — robot slows down as a person comes closer.
4. **Power and force limiting** — robot's force is limited so contact cannot injure.` },
      { h: 'Importance of cobots', b: `• Improve productivity by sharing work: robot does the repetitive lifting, human does the skilled finishing.
• Reduce injuries from repetitive strain.
• Affordable automation for small and medium enterprises (MSMEs) in India.
• Flexible — can be moved to a new task in hours.` },
    ],
    exam: {
      short: [
        { q: 'What is a cobot?', a: 'A collaborative robot designed to work safely alongside humans in a shared workspace without safety cages.' },
        { q: 'State two safety features of cobots.', a: 'Force/torque sensing with power and force limiting; speed reduction near people (also rounded edges, monitored stop).' },
        { q: 'What is hand-guided programming?', a: 'Teaching a cobot by physically moving its arm through the required positions, which it then records and repeats.' },
      ],
      long: [
        { q: 'Differentiate between industrial robots and cobots (any five points).', a: 'Workspace — caged vs shared with humans; Speed/force — high vs limited; Programming — expert coding vs hand-guiding; Cost — high vs lower; Flexibility — fixed long-term task vs quick redeployment; Safety — physical guarding vs built-in sensors.' },
        { q: 'Explain the progression from robots to cobots and the importance of cobots in industry.', a: 'Early industrial robots were isolated behind cages for safety, expensive and hard to program, limiting them to big factories. Advances in force sensors, safe motors and software created cobots that share space with people, are easy to teach and affordable. They raise productivity, reduce repetitive-strain injuries, help MSMEs automate small batches and can be moved between tasks quickly.' },
      ],
    },
  },

  c10_r_5: {
    figs: ['robotBlock'],
    sections: [
      { h: 'Robot as a system of components', b: `The syllabus studies a robot as a **system** made of four groups of components that work together:
1. **Gears** — transmit and change force and speed.
2. **Sensors** — measure the robot and its surroundings.
3. **Actuators** — create linear or rotary motion.
4. **Controllers** — make decisions and control the actuators.
The next lessons study each group in detail and then integrate them.` },
      { h: 'Choosing components — a worked example', b: `Task: a classroom robot that carries a 500 g book across a smooth floor.
• Payload 500 g + robot 1.5 kg → need geared DC motors with enough torque.
• Obstacles → ultrasonic sensor; edge of a table → IR sensors facing down.
• Controller → Arduino Uno (simple real-time control).
• Power → 7.4 V Li-ion pack with a 5 V regulator for logic.
• Communication → HC-05 Bluetooth for phone control.` },
    ],
    exam: {
      short: [
        { q: 'Why is a voltage regulator used in a robot?', a: 'To give a steady, correct voltage (e.g. 5 V) to the controller and sensors even when the battery voltage changes.' },
        { q: 'Name two controllers and state where each is best used.', a: 'Arduino — simple real-time motor/sensor control; Raspberry Pi — vision, AI and networking (also ESP32 for Wi-Fi/IoT, PLC for industry).' },
        { q: 'List four factors to consider when choosing robot components.', a: 'Payload, speed, accuracy, operating environment, power and budget (any four).' },
      ],
      long: [
        { q: 'Describe the main components of a robot and their functions.', a: 'Structure (chassis, links) — support; actuators (DC, servo, stepper, hydraulic, pneumatic) — motion; sensors (proximity, vision, force, encoder, IMU) — perception; controllers (Arduino, ESP32, Raspberry Pi, PLC) — decision-making; power (batteries, regulators) — energy; communication (Wi-Fi, Bluetooth, CAN) — data exchange; end-effectors — interaction; software — control logic.' },
        { q: 'Select components for a robot that follows a black line and stops at obstacles. Justify each choice.', a: 'Chassis with 2 geared DC motors + castor (simple, cheap); L298N driver (direction and PWM speed control); 2–3 IR reflectance sensors (detect black line); ultrasonic sensor (detect obstacles); Arduino Uno (real-time control, easy to program); 7.4 V battery pack + regulator (enough voltage for motors, steady 5 V for logic).' },
      ],
    },
  },

  c10_r_6: {
    figs: ['gearRatio', 'gearTypes'],
    sections: [
      { h: 'Force transmission and amplification', b: `Gears transmit **rotary motion and torque** from one shaft to another. Because power is (almost) conserved, when a gear train **reduces speed** it **amplifies torque** by the same ratio (minus friction losses).
• **Torque** = turning force (N·m). **Speed** = revolutions per minute (rpm).
• Output torque ≈ input torque × gear ratio.
• Output speed = input speed ÷ gear ratio.
A small motor spinning at 6000 rpm with a 50:1 gearbox gives 120 rpm with about 50 times the torque — enough to drive robot wheels.` },
      { h: 'Worked numericals', b: `**Example 1:** Driver gear 15 teeth at 300 rpm drives a 45-tooth gear.
Gear ratio = 45 ÷ 15 = **3 : 1**; output speed = 300 ÷ 3 = **100 rpm**; torque × 3.

**Example 2:** A 40-tooth driver drives a 10-tooth gear.
Ratio = 10 ÷ 40 = **1 : 4** (0.25); output speed = 4 × input → faster but weaker.

**Example 3 (compound train):** 10T drives 30T; a 15T gear on the same shaft as the 30T drives a 45T.
Overall ratio = (30/10) × (45/15) = 3 × 3 = **9 : 1**.

**Direction:** two meshing external gears turn in **opposite** directions. An **idler** gear between them makes the output turn the same way as the input without changing the ratio.` },
      { h: 'Belts, chains and gears compared', b: `• Gears — compact, exact ratio, no slip; can be noisy, short distances only.
• Belts and pulleys — quiet, long distances, may slip (except toothed timing belts).
• Chains and sprockets — strong, long distances, no slip; need lubrication.` },
    ],
    exam: {
      short: [
        { q: 'A 12-tooth gear drives a 48-tooth gear. Find the gear ratio and output speed if input is 200 rpm.', a: 'Ratio = 48 ÷ 12 = 4 : 1; output speed = 200 ÷ 4 = 50 rpm.' },
        { q: 'What is the function of an idler gear?', a: 'It makes the driven gear rotate in the same direction as the driver without changing the gear ratio.' },
        { q: 'Which gear converts rotary motion to linear motion?', a: 'Rack and pinion.' },
      ],
      long: [
        { q: 'Explain how gears provide force amplification. Calculate the output torque if a motor gives 0.2 N·m through a 30:1 gearbox (ignore losses).', a: 'Gears trade speed for torque: reducing speed by a ratio multiplies torque by the same ratio because power ≈ torque × speed stays nearly constant. Output torque = 0.2 × 30 = 6 N·m (and speed becomes 1/30 of the motor speed).' },
        { q: 'Describe spur, helical, bevel, worm and rack-and-pinion gears with one application each.', a: 'Spur — straight teeth, parallel shafts; clocks, gearboxes. Helical — angled teeth, smooth and quiet; car gearboxes. Bevel — cone-shaped, shafts at 90°; hand drill, differential. Worm — screw meshing with a wheel, large reduction and self-locking; lifts, door locks. Rack-and-pinion — rotary to linear; car steering, CNC axes.' },
      ],
    },
  },

  c10_r_7: {
    figs: ['sensorTypes', 'ultrasonic'],
    sections: [
      { h: 'Sensors classified by application (syllabus list)', b: `• **Vision** — cameras, depth cameras: recognise objects, read signs, follow lines.
• **Tactile (touch)** — bump switches, FSRs, capacitive touch: detect contact or grip force.
• **Temperature** — thermistor, LM35, DHT22: monitor motors and the environment.
• **Range / proximity** — ultrasonic, IR, LIDAR: measure distance to obstacles.
• **Motion** — PIR (detects people moving), accelerometers, gyroscopes.
• **Navigation** — GPS, compass (magnetometer), wheel encoders, IMU.
• **Speech** — microphones with speech recognition for voice commands.` },
      { h: 'Internal vs external sensors', b: `• **Internal (proprioceptive) sensors** measure the robot's own state: joint encoders, motor current sensors, battery voltage, IMU (tilt), temperature of motors.
• **External (exteroceptive) sensors** measure the environment: cameras, ultrasonic, IR, LIDAR, touch, microphones, GPS.
A self-balancing robot needs an internal sensor (IMU) to know its tilt; an obstacle-avoider needs an external sensor (ultrasonic).` },
      { h: 'Analog and digital sensors', b: `• **Digital** sensors give 0/1 (IR obstacle module, push button) or a coded data stream (DHT22, MPU6050 over I2C).
• **Analog** sensors give a varying voltage (LDR, potentiometer, LM35) that the controller converts to a number with its **ADC** (0–1023 on Arduino).` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between internal and external sensors with an example each.', a: 'Internal sensors measure the robot\'s own state (e.g. wheel encoder, IMU); external sensors measure the environment (e.g. ultrasonic, camera).' },
        { q: 'How does an ultrasonic sensor measure distance?', a: 'It sends a 40 kHz sound pulse and times the echo; distance = speed of sound × time ÷ 2.' },
        { q: 'Name a sensor used for (a) navigation (b) tactile sensing.', a: '(a) GPS/compass/IMU; (b) bump switch/force-sensitive resistor.' },
      ],
      long: [
        { q: 'Classify sensors according to their applications with one example and use each.', a: 'Vision — camera, object recognition; Tactile — FSR, grip force; Temperature — LM35, motor overheating; Range/proximity — ultrasonic, obstacle distance; Motion — PIR, detecting people; Navigation — GPS, outdoor position; Speech — microphone, voice commands.' },
        { q: 'An ultrasonic echo returns after 1160 µs. Find the distance (speed of sound 343 m/s). Explain the working of the sensor.', a: 'Distance = 0.0343 cm/µs × 1160 µs ÷ 2 ≈ 19.9 cm. Working: the Trig pin receives a 10 µs pulse; the transmitter emits 8 pulses of 40 kHz ultrasound; they reflect from the object; the receiver detects the echo and the Echo pin stays HIGH for the round-trip time; the controller converts time to distance (÷2 for the return trip).' },
      ],
    },
  },

  c10_r_8: {
    figs: ['actuatorTypes', 'pwm'],
    sections: [
      { h: 'Linear and rotary actuators', b: `**Rotary actuators** produce turning motion:
• DC motor, geared DC motor, servo, stepper, BLDC, hydraulic/pneumatic rotary motors.
**Linear actuators** produce straight-line push/pull:
• Hydraulic cylinder, pneumatic cylinder, solenoid, electric linear actuator (motor + lead screw), rack-and-pinion drive.
A rotary motor can be converted to linear motion using a **lead screw**, **rack and pinion** or **belt**.` },
      { h: 'Choosing an actuator — examples', b: `• Wheels of a rover → geared DC motors (continuous rotation, torque).
• Gripper fingers → servo (fixed angles) or small linear actuator.
• 3D-printer axes → steppers (exact steps).
• Drone propellers → BLDC + ESC (high speed, efficiency).
• Excavator boom → hydraulic cylinder (huge force).
• Pick-and-place suction head lift → pneumatic cylinder (fast on/off).` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between linear and rotary actuators with examples.', a: 'Linear actuators produce straight-line motion (hydraulic cylinder, solenoid); rotary actuators produce turning motion (DC motor, servo).' },
        { q: 'Why are BLDC motors used in drones?', a: 'They are efficient, light, powerful, high-speed and long-lasting (no brushes to wear).' },
        { q: 'How can a rotary motor produce linear motion?', a: 'Using a lead screw, rack and pinion, or belt and pulley mechanism.' },
      ],
      long: [
        { q: 'Compare DC, servo and stepper motors in terms of control, feedback, precision and applications.', a: 'DC — speed by voltage/PWM, no built-in feedback, low precision, wheels/fans. Servo — angle by pulse width, built-in feedback (closed loop), high angle precision, arm joints/steering. Stepper — moves in fixed steps, open loop (step counting), high positional precision, 3D printers/CNC.' },
        { q: 'Choose a suitable actuator for: a robot wheel, a robotic arm joint, a 3D printer, an excavator and a door lock. Justify.', a: 'Wheel — geared DC motor (continuous rotation + torque). Arm joint — servo (precise angle with feedback). 3D printer — stepper (exact repeatable steps). Excavator — hydraulic cylinder (very high force). Door lock — solenoid (quick linear push/pull).' },
      ],
    },
  },

  c10_r_9: {
    figs: ['openClosedLoop'],
    sections: [
      { h: 'What is a control system?', b: `A **control system** is an arrangement of components that manages the behaviour of a device to get a desired output. It has: an **input/set point** (what we want), a **controller** (decides), an **actuator** (acts), the **process/plant** (what is controlled) and, in closed loop, a **sensor** (measures output) and **comparator** (finds the error).` },
      { h: 'Manual vs automatic control', b: `• **Manual control** — a human watches the output and adjusts the input: turning a fan regulator, steering a car, driving an RC robot with a joystick.
• **Automatic control** — the system adjusts itself without human action: AC thermostat, automatic water-level controller, a line-following robot, an elevator stopping at the right floor.
Automatic control can be open loop (timer-based) or closed loop (sensor feedback).` },
      { h: 'Block diagram examples', b: `**Automatic water-tank controller (closed loop):**
Desired level → Comparator → Controller (Arduino) → Pump relay → Water tank → Level sensor → back to comparator.
**Fan on a timer (open loop):**
Timer setting → Controller → Fan motor → Air flow (no feedback).

[fig:pidLoop]` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between manual and automatic control with examples.', a: 'Manual — a human adjusts the system (fan regulator, steering); automatic — the system regulates itself using a controller and often sensors (AC thermostat, water-level controller).' },
        { q: 'What is the error signal in a closed-loop system?', a: 'The difference between the desired value (set point) and the measured output: error = set point − feedback.' },
        { q: 'Why do many robots use both an MCU and an SBC?', a: 'The SBC handles high-level tasks (vision, planning, AI) and the MCU handles fast real-time control of motors and sensors.' },
      ],
      long: [
        { q: 'Draw the block diagram of a closed-loop control system and explain each block with the example of an air conditioner.', a: 'Blocks: Set point (desired 24 °C) → Comparator (finds error) → Controller (decides compressor on/off) → Actuator (compressor) → Process (room air) → Output (room temperature) → Sensor (thermistor) → feedback to comparator. When room is warmer than 24 °C the error makes the compressor run; when it reaches 24 °C it stops.' },
        { q: 'Compare microcontrollers, single-board computers and PLCs.', a: 'MCU (Arduino, ESP32) — single chip, no OS, real-time, low power and cost; motor/sensor control. SBC (Raspberry Pi, Jetson) — full computer with OS, more memory and power; vision, AI, networking. PLC — rugged industrial controller, very reliable in harsh environments; factory automation.' },
      ],
    },
  },

  c10_r_10: {
    sections: [
      { h: 'Integrating a position sensor with a revolute joint', b: `Syllabus example: controlling a revolute joint using a position sensor.
• **Joint:** a link driven by a DC motor through gears.
• **Position sensor:** a potentiometer (or encoder) on the joint shaft gives a voltage that tells the angle.
• **Controller:** reads the angle with its ADC, compares it with the target angle and drives the motor through a motor driver until the error is zero.
This is exactly how a **servo motor** works inside.
~~~
target = 90                      // degrees
angle = map(analogRead(A0), 0, 1023, 0, 180)
error = target - angle
if (error > 2) motorForward();
else if (error < -2) motorReverse();
else motorStop();
~~~` },
      { h: 'Interfacing checklist', b: `1. Check voltage levels (5 V vs 3.3 V) — use level shifters or dividers.
2. Analog sensors → ADC pins; digital → GPIO; I2C sensors → SDA/SCL.
3. Motors never directly on controller pins — always through a driver.
4. Separate motor supply; common ground.
5. Read sensors at a steady rate; update motors in a loop fast enough for smooth control.` },
      { h: 'Communication buses', b: `[fig:commProtocols]` },
    ],
    exam: {
      short: [
        { q: 'Why should motor power be separated from logic power?', a: 'Motors draw large, changing currents and create electrical noise that can drop the voltage and reset or disturb the controller and sensors.' },
        { q: 'Differentiate between polling and interrupts.', a: 'Polling — the controller repeatedly checks a sensor in a loop; interrupts — the hardware signals the controller immediately when an event occurs.' },
        { q: 'Name the two wires of I2C.', a: 'SDA (data) and SCL (clock).' },
      ],
      long: [
        { q: 'Explain with a block diagram how a position sensor, controller and actuator work together to hold a revolute joint at 90°.', a: 'Block diagram: Target angle → Comparator → Controller → Motor driver → DC motor + gears → Joint → Potentiometer → back to comparator. The potentiometer gives the joint angle; the controller calculates error = 90° − actual; if positive it drives the motor one way, if negative the other way, and stops when the error is within tolerance — a closed-loop system like a servo.' },
        { q: 'List the steps to integrate sensors, actuators and a controller into a working robot.', a: '1) Choose compatible components (voltage, signals); 2) wire sensors to suitable pins (analog/digital/I2C); 3) connect motors through a driver; 4) provide separate motor and logic power with common ground; 5) write and test sensor-reading code; 6) write control logic; 7) add actuator code; 8) test each subsystem, then the full system; 9) tune and document.' },
      ],
    },
  },

  c10_r_11: {
    figs: ['jointTypes'],
    sections: [
      { h: 'Designing robot parts in Tinkercad', b: `Tinkercad (free, browser-based) builds 3D models from basic shapes:
1. Drag **basic shapes** (box, cylinder) onto the workplane.
2. Resize using the handles or exact dimensions (mm).
3. Use **Hole** shapes and **Group** to cut holes for shafts and screws.
4. **Align** tool to centre parts precisely.
5. **Duplicate** (Ctrl+D) for repeated parts.
6. Export as **.STL** for 3D printing or .SVG for laser cutting.` },
      { h: 'Designing a revolute joint', b: `• Link A: a 60 × 15 × 5 mm box with a 4 mm hole near one end.
• Link B: a similar box with a matching hole.
• Pin: a 3.8 mm cylinder (slightly smaller than the hole for a clearance fit) passing through both holes.
• Rotate Link B about the pin to visualise the motion.` },
      { h: 'Designing a prismatic joint', b: `• Guide: a box with a rectangular slot (made with a hole box).
• Slider: a box slightly narrower than the slot.
• Move the slider along the slot to visualise straight-line motion. Add end stops to limit the travel.` },
    ],
    exam: {
      short: [
        { q: 'What is CAD? Name two CAD tools.', a: 'Computer Aided Design — designing and visualising parts on a computer; e.g. Tinkercad and Fusion 360 (also SolidWorks).' },
        { q: 'What is a clearance fit?', a: 'A fit where the shaft/pin is slightly smaller than the hole so the parts can move freely (needed for joints).' },
        { q: 'Which file format is exported from Tinkercad for 3D printing?', a: '.STL' },
      ],
      long: [
        { q: 'Describe the steps to design a revolute joint in Tinkercad.', a: 'Create two links from boxes; add hole cylinders at the joint end and group to cut holes; create a pin cylinder slightly smaller than the holes; align holes and pin using the Align tool; rotate one link around the pin axis to visualise rotation; adjust dimensions; export as STL.' },
        { q: 'Explain the importance of visualisation and design before building a robot.', a: 'It lets engineers check fit, size and motion; detect collisions and weak parts through simulation; choose materials; save money and time by fixing errors digitally; create exact drawings for manufacturing; and communicate the design to others.' },
      ],
    },
  },

  c10_r_12: {
    figs: ['fourBar', 'planarSpatial'],
    sections: [
      { h: 'Mechanical blocks and the joints they create', b: `• **Shaft + bearing** → a smooth **revolute joint**.
• **Slider in a rail/linear bearing** → a **prismatic joint**.
• **Lead screw + nut** → converts rotation into precise linear motion.
• **Cam + follower** → converts rotation into a programmed up-down motion.
• **Crank + connecting rod** → converts rotation to back-and-forth sliding (engines, pumps).` },
      { h: 'The RR mechanism', b: `An **RR mechanism** has two revolute joints in series (like a shoulder and elbow). The end point can reach any point inside an annular workspace in a plane. It is the simplest model of a robot arm and is part of your Tinkercad practical.
[fig:rrMechanism]` },
    ],
    exam: {
      short: [
        { q: 'What is the function of a bearing?', a: 'To reduce friction and support a rotating shaft so it turns smoothly.' },
        { q: 'Name the mechanism that converts rotation into reciprocating motion.', a: 'Crank and connecting rod (slider-crank); a cam and follower also gives reciprocating motion.' },
        { q: 'What is an RR mechanism?', a: 'A mechanism with two revolute joints in series, like a two-link planar arm.' },
      ],
      long: [
        { q: 'Explain any five mechanical building blocks with their functions and robotic uses.', a: 'Shafts — transmit rotation (motor to wheel); bearings — reduce friction (wheel hubs); couplings — join shafts (motor to lead screw); springs — store energy/return to position (gripper return); belts and pulleys — transmit motion over distance (3D printer axes); cams — convert rotation into programmed motion (pick-and-place).' },
        { q: 'Draw an RR mechanism and explain how its joint angles determine the position of the end point.', a: 'Diagram: link L₁ pivoting at the base with angle θ₁, link L₂ pivoting at the elbow with angle θ₂. Position: x = L₁cosθ₁ + L₂cos(θ₁+θ₂), y = L₁sinθ₁ + L₂sin(θ₁+θ₂). Changing θ₁ and θ₂ moves the end point anywhere in a ring between |L₁ − L₂| and L₁ + L₂.' },
      ],
    },
  },

  c10_r_13: {
    figs: ['rrMechanism', 'workspace'],
    sections: [
      { h: 'Forward kinematics numerical', b: `RR arm with L₁ = 10 cm, L₂ = 6 cm, θ₁ = 30°, θ₂ = 60°.
x = 10 cos30° + 6 cos90° = 10 × 0.866 + 0 = **8.66 cm**
y = 10 sin30° + 6 sin90° = 10 × 0.5 + 6 × 1 = **11 cm**
So the end point is at (8.66, 11).` },
      { h: 'Visualising motion in Tinkercad and simulators', b: `• In Tinkercad, rotate each link about its pin step by step (e.g. every 15°) and note the end-point positions — this traces the path and workspace.
• Tinkercad **Sim Lab** adds gravity and motion.
• Professional tools (RoboDK, CoppeliaSim, Gazebo) animate robots, check reach and collisions, and generate programs.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between forward and inverse kinematics.', a: 'Forward kinematics finds the end-effector position from known joint angles; inverse kinematics finds the joint angles needed to reach a desired position.' },
        { q: 'Why is inverse kinematics harder?', a: 'It may have several solutions (elbow up/down), no solution (point out of reach), and often needs complex or numerical calculation.' },
        { q: 'Give an example of continuous-path motion.', a: 'A welding robot following a seam (also spray painting, gluing).' },
      ],
      long: [
        { q: 'For an RR arm with L₁ = 8 cm, L₂ = 4 cm, θ₁ = 0°, θ₂ = 90°, find the end-point position. What is the maximum reach?', a: 'x = 8cos0° + 4cos90° = 8 + 0 = 8 cm; y = 8sin0° + 4sin90° = 0 + 4 = 4 cm → (8, 4). Maximum reach = L₁ + L₂ = 12 cm.' },
        { q: 'Why is motion visualisation and simulation important before running a real robot?', a: 'It checks the robot can reach all needed points (workspace), detects collisions with itself and surroundings, optimises paths and cycle time, tests programs safely without damaging hardware or hurting people, and saves cost and time.' },
      ],
    },
  },

  c10_r_14: {
    sections: [
      { h: 'Coding a single-board computer (syllabus)', b: `On a Raspberry Pi, Python controls GPIO pins:
~~~
from gpiozero import LED, Button, Motor
from time import sleep

led = LED(17)
btn = Button(2)
motor = Motor(forward=23, backward=24)

while True:
    if btn.is_pressed:
        led.on(); motor.forward(0.6)
    else:
        led.off(); motor.stop()
    sleep(0.05)
~~~
Note: Raspberry Pi pins are **3.3 V** — never connect 5 V signals directly.` },
      { h: 'Integration steps for any robot', b: `1. **Requirements** — what must it do? (speed, payload, run time)
2. **Design** — block diagram, CAD, wiring diagram.
3. **Build subsystems** — chassis, power, sensors, motors.
4. **Unit test** each subsystem.
5. **Integrate** and do **integration testing**.
6. **System test** — complete task, timing, battery life.
7. **Field test** in the real environment.
8. **Document** and improve.` },
    ],
    exam: {
      short: [
        { q: 'What is EMI and how is it reduced?', a: 'Electromagnetic interference — electrical noise from motors disturbing electronics; reduced by separate supplies, short twisted wires, capacitors on motors and shielding.' },
        { q: 'Differentiate between unit testing and system testing.', a: 'Unit testing checks one component/subsystem alone; system testing checks the complete integrated robot.' },
        { q: 'Why must 5 V signals not be connected directly to Raspberry Pi GPIO?', a: 'Pi GPIO pins work at 3.3 V; 5 V can permanently damage them.' },
      ],
      long: [
        { q: 'Explain the V-model of systems engineering.', a: 'The left side goes down from requirements → system design → component design → build; the right side goes up from unit testing → integration testing → system testing → validation. Each design stage on the left has a matching test stage on the right, ensuring every requirement is verified.' },
        { q: 'Describe the challenges in integrating a robot and how to overcome them.', a: 'EMI — separate supplies, filtering, shielding; timing — use proper control-loop rates and interrupts; thermal — heat sinks, ventilation; weight distribution — low centre of gravity, balanced layout; software complexity — modular code and testing; power — battery sizing and regulators; documentation — wiring diagrams and test logs.' },
      ],
    },
  },

  c10_p_1: {
    figs: ['listVsTuple'],
    sections: [
      { h: 'Creating and accessing lists', b: `~~~
marks = [78, 91, 65, 88]
empty = []
mixed = [1, "two", 3.0, True]
nested = [[1, 2], [3, 4]]
nums = list(range(1, 6))       # [1, 2, 3, 4, 5]
chars = list("robot")          # ['r','o','b','o','t']

print(marks[0], marks[-1])     # 78 88
print(nested[1][0])            # 3
print(marks[1:3])              # [91, 65]
~~~` },
      { h: 'List operations', b: `~~~
a = [1, 2]; b = [3, 4]
a + b          # [1, 2, 3, 4]   concatenation
a * 3          # [1, 2, 1, 2, 1, 2]   repetition
3 in b         # True           membership
len(a + b)     # 4
min(b), max(b), sum(b)   # 3 4 7
~~~` },
      { h: 'Important list methods with outputs', b: `~~~
L = [5, 2, 8]
L.append(1)        # [5, 2, 8, 1]
L.insert(1, 9)     # [5, 9, 2, 8, 1]
L.extend([7, 7])   # [5, 9, 2, 8, 1, 7, 7]
L.remove(7)        # removes first 7 → [5, 9, 2, 8, 1, 7]
x = L.pop()        # x = 7, L = [5, 9, 2, 8, 1]
L.pop(0)           # removes index 0 → [9, 2, 8, 1]
L.index(8)         # 2
L.count(2)         # 1
L.sort()           # [1, 2, 8, 9]
L.sort(reverse=True)   # [9, 8, 2, 1]
L.reverse()        # [1, 2, 8, 9]
del L[1]           # [1, 8, 9]
L.clear()          # []
~~~` },
      { h: 'Traversing a list', b: `~~~
readings = [12, 30, 25, 8]
for r in readings:            # by value
    print(r)
for i in range(len(readings)):    # by index
    readings[i] = readings[i] * 2  # modify in place
print(readings)               # [24, 60, 50, 16]
~~~` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between append() and extend().', a: 'append(x) adds x as a single element at the end; extend(iterable) adds each element of the iterable. [1].append([2,3]) → [1, [2, 3]]; [1].extend([2,3]) → [1, 2, 3].' },
        { q: 'Give the output: L = [4, 7, 1]; L.insert(1, 5); print(L.pop(), L)', a: '1 [4, 5, 7]' },
        { q: 'Differentiate between sort() and sorted().', a: 'L.sort() sorts the original list in place and returns None; sorted(L) returns a new sorted list leaving L unchanged.' },
      ],
      long: [
        { q: 'Write a program to input 10 numbers into a list and print the largest, smallest, sum, average and the list in ascending order.', a: '~~~\nnums = []\nfor i in range(10):\n    nums.append(float(input("Number: ")))\nprint("Largest:", max(nums))\nprint("Smallest:", min(nums))\nprint("Sum:", sum(nums))\nprint("Average:", sum(nums) / len(nums))\nnums.sort()\nprint("Ascending:", nums)\n~~~' },
        { q: 'Write a program to remove all even numbers from a list and count how many were removed.', a: '~~~\nL = [12, 7, 9, 14, 20, 3]\nodd = []\nremoved = 0\nfor x in L:\n    if x % 2 == 0:\n        removed += 1\n    else:\n        odd.append(x)\nprint(odd, "removed:", removed)   # [7, 9, 3] removed: 3\n~~~' },
      ],
    },
  },

  c10_p_2: {
    figs: ['listVsTuple'],
    sections: [
      { h: 'Creating tuples — including the single-element trap', b: `~~~
t1 = (10, 20, 30)
t2 = 10, 20, 30        # brackets optional (packing)
t3 = (5,)              # ONE element needs a comma
not_tuple = (5)        # this is just the int 5
t4 = tuple([1, 2, 3])  # from a list
t5 = tuple("abc")      # ('a', 'b', 'c')
~~~` },
      { h: 'Tuple operations and methods', b: `~~~
t = (3, 1, 4, 1, 5)
t[2]          # 4
t[1:4]        # (1, 4, 1)
t + (9,)      # (3, 1, 4, 1, 5, 9)
t * 2         # repeats
4 in t        # True
len(t), min(t), max(t), sum(t)   # 5 1 5 14
t.count(1)    # 2
t.index(4)    # 2
~~~
Tuples have only **two methods**: count() and index().` },
      { h: 'Converting between lists and tuples', b: `To "change" a tuple, convert it to a list, change it, and convert back:
~~~
pos = (10, 20)
temp = list(pos)
temp[0] = 15
pos = tuple(temp)      # (15, 20)
~~~` },
    ],
    exam: {
      short: [
        { q: 'How do you create a tuple with a single element 7?', a: 't = (7,) — the trailing comma is required.' },
        { q: 'Give two reasons for using tuples instead of lists.', a: 'They protect data that must not change (immutable) and are faster/use less memory; they can be dictionary keys.' },
        { q: 'Name the only two tuple methods.', a: 'count() and index().' },
      ],
      long: [
        { q: 'Differentiate between lists and tuples under five headings.', a: 'Brackets — [ ] vs ( ); Mutability — mutable vs immutable; Methods — many (append, sort…) vs only count/index; Speed/memory — slower, more memory vs faster, less memory; Use — changing data like sensor logs vs fixed data like coordinates; Dictionary keys — not allowed vs allowed.' },
        { q: 'Write a program to store the (x, y) coordinates of 4 waypoints as tuples in a list, and print the total straight-line distance travelled.', a: '~~~\nimport math\npath = [(0, 0), (3, 4), (6, 8), (6, 12)]\ntotal = 0\nfor i in range(1, len(path)):\n    x1, y1 = path[i - 1]\n    x2, y2 = path[i]\n    total += math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)\nprint("Distance:", total)   # 14.0\n~~~' },
      ],
    },
  },

  c10_p_3: {
    figs: ['stringIndex'],
    sections: [
      { h: 'Traversing strings', b: `~~~
word = "SENSOR"
for ch in word:                 # by character
    print(ch, end=" ")         # S E N S O R
for i in range(len(word)):      # by index
    print(i, word[i])
for i in range(len(word) - 1, -1, -1):   # backwards
    print(word[i], end="")     # ROSNES
~~~` },
      { h: 'Built-in string functions table', b: `• len(s) — length
• s.capitalize() — first letter capital
• s.title() — every word capitalised
• s.upper() / s.lower() / s.swapcase()
• s.count(sub) — number of occurrences
• s.find(sub) — first index or -1; s.index(sub) — first index or error
• s.startswith(x) / s.endswith(x)
• s.isalpha(), s.isdigit(), s.isalnum(), s.isspace(), s.isupper(), s.islower()
• s.strip(), s.lstrip(), s.rstrip()
• s.replace(old, new)
• s.split(sep) and sep.join(list)
• ord("A") → 65, chr(66) → "B"` },
      { h: 'Exam-style programs', b: `Count uppercase, lowercase, digits and spaces:
~~~
s = "RoboCraft 2026 Rocks"
up = lo = dg = sp = 0
for ch in s:
    if ch.isupper(): up += 1
    elif ch.islower(): lo += 1
    elif ch.isdigit(): dg += 1
    elif ch.isspace(): sp += 1
print(up, lo, dg, sp)     # 3 11 4 2
~~~
Longest word in a sentence:
~~~
words = input("Sentence: ").split()
longest = max(words, key=len)
print(longest, len(longest))
~~~` },
    ],
    exam: {
      short: [
        { q: 'Give the output: print("robotics".find("o"), "robotics".count("o"))', a: '1 2' },
        { q: 'What is the output of "Hello World".swapcase()?', a: 'hELLO wORLD' },
        { q: 'Differentiate between find() and index().', a: 'Both return the first index of a substring; find() returns -1 if not found, index() raises a ValueError.' },
      ],
      long: [
        { q: 'Write a program to input a word and check whether it is a palindrome without using slicing.', a: '~~~\nw = input("Word: ").lower()\nrev = ""\nfor ch in w:\n    rev = ch + rev\nif rev == w:\n    print("Palindrome")\nelse:\n    print("Not a palindrome")\n~~~' },
        { q: 'Write a program to parse the sensor string "T:23.5,H:65,L:420" and print each reading with its full name.', a: '~~~\ndata = "T:23.5,H:65,L:420"\nnames = {"T": "Temperature", "H": "Humidity", "L": "Light"}\nfor part in data.split(","):\n    key, value = part.split(":")\n    print(names[key], "=", float(value))\n~~~' },
      ],
    },
  },

  c10_p_4: {
    sections: [
      { h: 'Creating and using your own module', b: `File **robotutils.py**:
~~~
WHEEL_DIAMETER = 6.5     # cm

def cm_to_steps(cm, steps_per_rev=200):
    import math
    return round(cm / (math.pi * WHEEL_DIAMETER) * steps_per_rev)

if __name__ == "__main__":
    print(cm_to_steps(20))   # quick self-test
~~~
Another file in the same folder:
~~~
import robotutils
print(robotutils.cm_to_steps(50))
from robotutils import WHEEL_DIAMETER
print(WHEEL_DIAMETER)
~~~` },
      { h: 'Useful standard modules — examples', b: `~~~
import math
math.sqrt(49), math.pi, math.ceil(2.1), math.floor(2.9), math.pow(2, 5)
# 7.0  3.14159…  3  2  32.0
import random
random.randint(1, 6)          # dice roll
random.choice(["L", "R"])     # random turn
import time
time.sleep(0.5)               # wait half a second
import statistics
statistics.mean([2, 4, 9])    # 5
~~~` },
    ],
    exam: {
      short: [
        { q: 'What is a module?', a: 'A file containing Python definitions (functions, variables, classes) that can be imported and reused in other programs.' },
        { q: 'Write the output: import math; print(math.ceil(4.2), math.floor(4.8))', a: '5 4' },
        { q: 'What is the use of if __name__ == "__main__":?', a: 'Code under it runs only when the file is executed directly, not when it is imported as a module (useful for tests).' },
      ],
      long: [
        { q: 'Explain three ways of importing modules with examples and state one advantage of each.', a: 'import math → math.sqrt(4): clear where each function comes from. from math import sqrt → sqrt(4): shorter code. import numpy as np → np.array(): short alias for long names. (from math import * imports all but can cause name clashes.)' },
        { q: 'Write a program using the random module to simulate rolling two dice 1000 times and print how many times the sum was 7.', a: '~~~\nimport random\ncount = 0\nfor _ in range(1000):\n    if random.randint(1, 6) + random.randint(1, 6) == 7:\n        count += 1\nprint("Sum 7 occurred", count, "times")   # about 167\n~~~' },
      ],
    },
  },

  c10_p_5: {
    sections: [
      { h: 'Module vs package vs library', b: `• **Module** — a single .py file.
• **Package** — a folder of modules with an __init__.py file (e.g. a "sensors" package containing ultrasonic.py and ir.py).
• **Library** — a collection of packages and modules for a purpose (NumPy, Pandas, Matplotlib, SciPy).
~~~
sensors/
  __init__.py
  ultrasonic.py
  ir.py
# usage:
from sensors import ultrasonic
from sensors.ir import read_left
~~~` },
      { h: 'The four libraries in your syllabus', b: `• **NumPy** — fast arrays and maths (matrices, statistics).
• **Pandas** — tables of data (DataFrames), reading CSV/Excel, cleaning and grouping.
• **SciPy** — scientific tools built on NumPy: optimisation, interpolation, signal filtering, statistics.
• **Matplotlib** — drawing graphs: line, bar, histogram, scatter, pie.
Install with: pip install numpy pandas scipy matplotlib` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between a module and a package.', a: 'A module is one .py file; a package is a directory containing several modules and an __init__.py file.' },
        { q: 'What is pip?', a: 'Python\'s package installer, used to download and install packages from PyPI (e.g. pip install numpy).' },
        { q: 'Name the library used for plotting graphs in Python.', a: 'Matplotlib (matplotlib.pyplot).' },
      ],
      long: [
        { q: 'Explain the purpose of NumPy, Pandas, SciPy and Matplotlib with one example each.', a: 'NumPy — fast numerical arrays: np.mean(np.array([2, 4, 6])) → 4. Pandas — DataFrames for tabular data: pd.read_csv("log.csv").describe(). SciPy — scientific computing: signal.butter for filtering noisy sensor data. Matplotlib — visualisation: plt.plot(time, temp); plt.show().' },
        { q: 'What are virtual environments and why are they used?', a: 'A virtual environment (python -m venv env) is an isolated folder with its own Python packages. It prevents version conflicts between projects, lets you record exact dependencies (pip freeze > requirements.txt) and keeps the system Python clean.' },
      ],
    },
  },

  c10_p_6: {
    sections: [
      { h: 'NumPy in practice', b: `~~~
import numpy as np
temps = np.array([22.5, 24.1, 23.8, 26.0, 25.2])
print(temps.mean(), temps.max(), temps.min())   # 24.32 26.0 22.5
print(temps[temps > 24])          # [24.1 25.2 26. ] — boolean filtering
f = temps * 9 / 5 + 32            # convert all to °F at once
grid = np.zeros((3, 4))           # 3 rows × 4 columns
print(grid.shape)                 # (3, 4)
m = np.arange(1, 7).reshape(2, 3) # [[1 2 3] [4 5 6]]
print(m.T)                        # transpose → 3×2
~~~` },
      { h: 'Why NumPy is faster', b: `A Python list stores separate Python objects scattered in memory; a NumPy array stores numbers of one type in one continuous block and runs loops in compiled C code. Adding two arrays of a million numbers is often 50–100 times faster with NumPy.` },
    ],
    exam: {
      short: [
        { q: 'Write NumPy code to create an array of numbers 0 to 9 and print its mean.', a: 'import numpy as np; a = np.arange(10); print(a.mean())  # 4.5' },
        { q: 'What is the output of np.array([1, 2, 3]) * 2?', a: 'array([2, 4, 6])' },
        { q: 'What is broadcasting?', a: 'NumPy\'s ability to perform operations between arrays of different shapes (e.g. array + scalar) by automatically stretching the smaller one.' },
      ],
      long: [
        { q: 'Differentiate between a Python list and a NumPy array.', a: 'List — any mixed types, flexible size, slow numerical loops, + joins lists. NumPy array — single data type, fixed size, fast vectorised maths in C, + adds element-wise, supports matrix operations, uses less memory.' },
        { q: 'Write a program using NumPy to store 7 days of temperatures and print the average, the days above average and the temperatures in Fahrenheit.', a: '~~~\nimport numpy as np\nt = np.array([31, 33, 29, 35, 34, 30, 32])\navg = t.mean()\nprint("Average:", avg)\nprint("Days above average:", np.where(t > avg)[0] + 1)\nprint("Fahrenheit:", t * 9 / 5 + 32)\n~~~' },
      ],
    },
  },

  c10_p_7: {
    sections: [
      { h: 'SciPy examples', b: `~~~
from scipy import stats, interpolate, optimize
import numpy as np

marks = [56, 72, 72, 88, 91]
print(stats.mode(marks).mode)       # 72
print(np.median(marks))             # 72.0

t = [0, 1, 2, 3]
d = [0, 2, 8, 18]
f = interpolate.interp1d(t, d)
print(f(2.5))                       # estimate between samples → 13.0

res = optimize.minimize_scalar(lambda x: (x - 3) ** 2 + 1)
print(round(res.x, 2))              # 3.0 (minimum of the curve)
~~~` },
    ],
    exam: {
      short: [
        { q: 'What is SciPy?', a: 'A Python library built on NumPy that provides scientific and engineering functions such as optimisation, interpolation, integration, statistics and signal processing.' },
        { q: 'What is interpolation?', a: 'Estimating unknown values between known data points (e.g. estimating a sensor value between two readings).' },
        { q: 'Name two SciPy sub-modules and their use.', a: 'scipy.optimize — finding minima/fitting curves; scipy.signal — filtering noisy signals (also interpolate, integrate, stats, spatial).' },
      ],
      long: [
        { q: 'Explain any four SciPy modules with a robotics use for each.', a: 'optimize — tune PID gains or solve inverse kinematics; interpolate — fill missing sensor readings or smooth trajectories; signal — filter noise from accelerometer data; integrate — compute distance from velocity data; stats — analyse test results; spatial — nearest-obstacle distance calculations.' },
        { q: 'Differentiate between NumPy and SciPy.', a: 'NumPy provides the core array object and basic maths/linear algebra; SciPy builds on NumPy to add advanced scientific algorithms (optimisation, interpolation, integration, signal processing, statistics). SciPy needs NumPy; NumPy does not need SciPy.' },
      ],
    },
  },

  c10_p_8: {
    sections: [
      { h: 'Pandas in practice', b: `~~~
import pandas as pd
data = {"robot": ["R1", "R2", "R3", "R4"],
        "speed": [12, 18, 15, 9],
        "laps":  [5, 7, 6, 4]}
df = pd.DataFrame(data)
print(df)
print(df["speed"].mean())        # 13.5
print(df[df["speed"] > 10])      # filter rows
df["score"] = df["speed"] * df["laps"]   # new column
print(df.sort_values("score", ascending=False).head(2))
print(df.describe())
~~~` },
      { h: 'Series vs DataFrame', b: `• **Series** — one labelled column: pd.Series([3, 5, 7], index=["a", "b", "c"]).
• **DataFrame** — a table of many Series sharing the same row index.
Selecting one column of a DataFrame (df["speed"]) gives a Series.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between a Series and a DataFrame.', a: 'A Series is a one-dimensional labelled array (one column); a DataFrame is a two-dimensional labelled table of rows and columns.' },
        { q: 'Write the statement to read a file "marks.csv" into a DataFrame.', a: 'df = pd.read_csv("marks.csv")' },
        { q: 'What do head() and describe() do?', a: 'head() shows the first 5 rows; describe() shows summary statistics (count, mean, std, min, quartiles, max) of numeric columns.' },
      ],
      long: [
        { q: 'Write a program to create a DataFrame of 5 students\' names and marks, add a "result" column ("Pass" if marks ≥ 40), and print students who passed.', a: '~~~\nimport pandas as pd\ndf = pd.DataFrame({"name": ["Asha", "Ravi", "Meera", "John", "Zoya"],\n                   "marks": [72, 35, 88, 40, 29]})\ndf["result"] = ["Pass" if m >= 40 else "Fail" for m in df["marks"]]\nprint(df[df["result"] == "Pass"])\n~~~' },
        { q: 'Explain how Pandas handles missing data with examples.', a: 'Missing values appear as NaN. df.isnull() finds them; df.dropna() removes rows with missing values; df.fillna(0) or df["col"].fillna(df["col"].mean()) fills them with a value or the column mean. Handling missing data is part of data exploration/cleaning before modelling.' },
      ],
    },
  },

  c10_p_9: {
    figs: ['graphTypes'],
    sections: [
      { h: 'Five graphs with code', b: `~~~
import matplotlib.pyplot as plt
hours = [1, 2, 3, 4, 5]
marks = [35, 48, 55, 70, 82]

plt.plot(hours, marks, marker="o"); plt.title("Line"); plt.show()
plt.bar(["A", "B", "C"], [12, 18, 9]); plt.title("Bar"); plt.show()
plt.hist([45, 52, 58, 61, 63, 67, 70, 72, 88], bins=5); plt.title("Histogram"); plt.show()
plt.scatter(hours, marks); plt.xlabel("Hours"); plt.ylabel("Marks"); plt.show()
plt.pie([40, 35, 25], labels=["Bus", "Walk", "Car"], autopct="%1.0f%%"); plt.show()
~~~` },
      { h: 'Good graph checklist', b: `• Title that says what the graph shows.
• Axis labels with units.
• Legend if there is more than one series.
• Sensible scale starting from zero for bar graphs.
• Right chart type for the question being asked.` },
    ],
    exam: {
      short: [
        { q: 'Write the statement to import Matplotlib\'s plotting module with its usual alias.', a: 'import matplotlib.pyplot as plt' },
        { q: 'Which function draws a histogram?', a: 'plt.hist()' },
        { q: 'What is the use of plt.savefig()?', a: 'To save the current figure as an image file (e.g. PNG).' },
      ],
      long: [
        { q: 'Write a program to plot a robot\'s distance travelled over 6 seconds as a line graph with title, labels, grid and legend.', a: '~~~\nimport matplotlib.pyplot as plt\nt = [0, 1, 2, 3, 4, 5, 6]\nd = [0, 12, 25, 36, 50, 61, 74]\nplt.plot(t, d, "b-o", label="Robot A")\nplt.title("Distance vs Time")\nplt.xlabel("Time (s)")\nplt.ylabel("Distance (cm)")\nplt.grid(True)\nplt.legend()\nplt.show()\n~~~' },
        { q: 'Explain when to use a bar graph, histogram, line graph, scatter plot and pie chart, with the Matplotlib function for each.', a: 'Bar — compare categories, plt.bar(); Histogram — distribution of numeric values, plt.hist(); Line — change over time, plt.plot(); Scatter — relationship between two variables, plt.scatter(); Pie — proportions of a whole, plt.pie().' },
      ],
    },
  },

  c10_a_1: {
    figs: ['detVsProb', 'fruitSorting'],
    sections: [
      { h: 'Human vs machine decision-making', b: `• **Humans** decide using experience, emotions, common sense, values and intuition; they handle new situations well but can be tired, biased or slow with large data.
• **Machines** decide using data, rules and models; they are fast, consistent and tireless with large data, but lack common sense and can fail in unfamiliar situations or inherit bias from data.
Best results often come from **human + machine** teams — e.g. AI flags suspicious transactions and a bank officer makes the final call.` },
      { h: 'Deterministic vs probabilistic approaches', b: `• **Deterministic approach:** fixed rules give the same output every time — "if distance < 20 cm, turn". Predictable and explainable.
• **Probabilistic approach:** the machine estimates likelihoods — "there is an 80% chance this object is a person, so slow down". Handles uncertainty and noisy sensors.
Self-driving cars use probabilistic methods to recognise objects, then deterministic rules for safety (always stop at a red light).` },
      { h: 'Basics of machine learning: the fruit-sorting example', b: `A conveyor brings apples and oranges. A camera measures **features**: colour (redness) and size.
1. **Collect** labelled examples — 500 fruits marked "apple" or "orange".
2. **Train** — the algorithm finds a boundary that separates the two groups on a colour-vs-size graph.
3. **Predict** — a new fruit's features are measured; whichever side of the boundary it falls on gives the label.
4. **Act** — a robot arm or air jet pushes it into the correct bin.
5. **Improve** — mistakes are added to the training data.` },
    ],
    exam: {
      short: [
        { q: 'State two differences between human and machine decision-making.', a: 'Humans use experience, emotions and common sense and adapt to new situations; machines use data and algorithms, are faster and more consistent but lack common sense.' },
        { q: 'Differentiate between deterministic and probabilistic approaches.', a: 'Deterministic: fixed rules, same output for same input; probabilistic: outputs based on likelihood, handles uncertainty.' },
        { q: 'What is a decision tree?', a: 'A tree-shaped model where internal nodes test a feature, branches show outcomes and leaves give the final decision.' },
      ],
      long: [
        { q: 'Explain how machine learning can be used to sort fruits on a conveyor belt.', a: 'Features such as colour, size and weight are measured by sensors/cameras. A labelled dataset of fruits is collected. A classifier is trained to find the boundary between classes. For each new fruit, features are measured and the model predicts its class. An actuator sorts it into the right bin. Errors are reviewed and used to retrain, improving accuracy.' },
        { q: 'Draw a decision tree for a robot that must decide whether to go forward, turn left, turn right or stop.', a: 'Root: Obstacle ahead? No → Go forward. Yes → Is left clear? Yes → Turn left. No → Is right clear? Yes → Turn right. No → Stop (and reverse).' },
      ],
    },
  },

  c10_a_2: {
    sections: [
      { h: 'AGV vs AMR — a classic exam comparison', b: `• **AGV (Automated Guided Vehicle)** follows fixed paths marked by magnetic tape, wires or QR codes. If something blocks its path, it stops and waits. **Automated.**
• **AMR (Autonomous Mobile Robot)** builds a map with LIDAR/cameras, plans its own route and goes around obstacles. **Autonomous.**` },
      { h: 'Levels of autonomy beyond cars', b: `The same idea applies to drones (manual → altitude hold → GPS waypoint mission → fully autonomous inspection) and to robots (teleoperated → supervised → fully autonomous).` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between automated and autonomous systems.', a: 'Automated systems follow pre-programmed fixed rules without adapting; autonomous systems sense, decide and act independently and adapt to changing environments.' },
        { q: 'What is SAE Level 5?', a: 'Full automation — the vehicle drives itself in all conditions with no human driver needed.' },
        { q: 'Is cruise control automated or autonomous? Why?', a: 'Automated — it keeps a set speed without understanding or adapting to traffic (adaptive cruise control is a step towards autonomy).' },
      ],
      long: [
        { q: 'Explain the six SAE levels of driving automation.', a: 'L0 No automation — driver does everything. L1 Driver assistance — one function (cruise control or lane keeping). L2 Partial — car steers and controls speed; driver monitors. L3 Conditional — car drives in some conditions; driver takes over when asked. L4 High — car drives itself in defined areas/conditions. L5 Full — drives anywhere, no driver needed.' },
        { q: 'Compare an AGV and an AMR and discuss challenges faced by autonomous systems.', a: 'AGV: fixed paths, stops at obstacles, cheaper, automated. AMR: maps environment, plans routes, avoids obstacles, flexible, autonomous. Challenges: perception in rain/fog, rare edge cases, ethical decisions, laws and liability, cybersecurity, public trust.' },
      ],
    },
  },

  c10_a_3: {
    figs: ['mlTypes'],
    sections: [
      { h: 'Choosing the type of learning', b: `Ask: **Do I have labels?**
• Yes, and I want a category → **supervised classification** (pass/fail, ripe/unripe).
• Yes, and I want a number → **supervised regression** (price, temperature).
• No labels, I want groups → **unsupervised clustering**.
• An agent acting in an environment with rewards → **reinforcement learning**.` },
      { h: 'K-Nearest Neighbours in one picture', b: `To classify a new point, look at its **K** nearest labelled neighbours and take a majority vote. If K = 3 and two neighbours are "apple" and one is "orange", the new fruit is predicted "apple". Simple, but slow on huge datasets.` },
    ],
    exam: {
      short: [
        { q: 'Define machine learning.', a: 'A branch of AI in which computers learn patterns from data and improve their performance without being explicitly programmed with rules.' },
        { q: 'Classify as classification or regression: (a) predicting tomorrow\'s temperature (b) detecting spam.', a: '(a) Regression (b) Classification.' },
        { q: 'What is overfitting?', a: 'When a model learns the training data too closely (including noise) and performs poorly on new data.' },
      ],
      long: [
        { q: 'Explain supervised, unsupervised and reinforcement learning with diagrams and examples.', a: 'Supervised — labelled inputs → model → predicted labels; e.g. spam filter, house-price prediction. Unsupervised — unlabelled data → model finds clusters; e.g. customer segmentation with K-Means. Reinforcement — agent takes actions in an environment, receives rewards/penalties and learns the best policy; e.g. a robot learning to walk or game AI.' },
        { q: 'Describe the steps of the machine learning workflow.', a: '1) Data collection; 2) data preprocessing/cleaning; 3) feature selection; 4) choose a model; 5) train on training data; 6) evaluate on test data (accuracy, precision, recall); 7) tune and improve; 8) deploy and monitor.' },
      ],
    },
  },

  c10_a_4: {
    figs: ['turingTest', 'neuralNet'],
    sections: [
      { h: 'Human intelligence vs machine intelligence', b: `• **Human intelligence**: general — we learn from few examples, use common sense, understand context and emotions, are creative and self-aware, transfer knowledge between tasks.
• **Machine intelligence**: narrow — learns from huge data, extremely fast and accurate at specific tasks, never tires, but lacks real understanding, common sense and emotions, and struggles outside its training.
The **Turing Test** (Alan Turing, 1950) is a classic way of linking the two: if a judge chatting by text cannot tell the machine from a human, the machine is said to show human-like intelligence.` },
      { h: 'Types of intelligence machines try to copy', b: `• **Linguistic** — understanding and producing language (chatbots, translation).
• **Logical-mathematical** — reasoning and calculation (chess engines, solvers).
• **Visual-spatial** — seeing and navigating (computer vision, SLAM).
• **Learning from experience** — machine learning.
• **Social/emotional** — recognising emotions (still very limited).` },
    ],
    exam: {
      short: [
        { q: 'What is the Turing Test?', a: 'A test proposed by Alan Turing in 1950 in which a human judge chats by text with a hidden human and a hidden machine; if the judge cannot reliably tell them apart, the machine is said to show human-like intelligence.' },
        { q: 'State two ways machine intelligence differs from human intelligence.', a: 'Machines need large amounts of data and work only on narrow tasks; humans learn from few examples, use common sense and emotions and adapt to new tasks.' },
        { q: 'What is transfer learning?', a: 'Reusing a model trained on one task as the starting point for a related task, saving data and training time.' },
      ],
      long: [
        { q: 'Compare human intelligence and machine intelligence (any five points).', a: 'Learning — few examples vs huge data; Scope — general vs narrow; Speed — slower vs extremely fast; Consistency — tires and varies vs consistent 24×7; Understanding — context, common sense, emotions vs none/limited; Creativity — original vs pattern-based generation; Self-awareness — present vs absent.' },
        { q: 'Explain CNNs, RNNs and transformers and their uses.', a: 'CNNs — convolutional layers detect local patterns in images; used for image classification, object detection (YOLO), face recognition. RNNs — process sequences step by step with memory; used for speech and time series. Transformers — use attention to relate all parts of a sequence at once; power modern language models (GPT), translation and chatbots.' },
      ],
    },
  },

  c10_a_5: {
    figs: ['cyberThreats'],
    sections: [
      { h: 'Security and ethical issues in computing (syllabus)', b: `• **Unauthorised use of hardware** — using someone else's computer, network or robot without permission; stealing devices.
• **Unauthorised use of software** — **software piracy**: copying or installing paid software without a licence; using cracked apps (which often carry malware).
• **Hacking** — gaining unauthorised access to systems or data. **Ethical hacking** (penetration testing) is done with permission to find and fix weaknesses.
• **Data theft** — stealing personal or business data (passwords, card numbers, marks, photos).
• **Viruses and malware** — programs that harm, spy or demand ransom (viruses, worms, trojans, ransomware, spyware).
• **Fraud** — phishing emails/SMS, fake websites, UPI/OTP scams, identity theft.
• **Cyberbullying and privacy violations** — sharing someone's information or images without consent.` },
      { h: 'Staying safe and the law', b: `• Strong, unique passwords + two-factor authentication.
• Never share OTPs, PINs or passwords — banks never ask for them.
• Install apps only from official stores; keep software updated; use antivirus.
• Check links and sender addresses; avoid public Wi-Fi for banking.
• Back up important data.
• In India, the **Information Technology Act, 2000** deals with cybercrime, and the **Digital Personal Data Protection Act, 2023** protects personal data. Report cybercrime at **cybercrime.gov.in** or helpline **1930**.` },
      { h: 'Ethics for AI and robot builders', b: `Respect privacy, get consent for data, don't use AI to deceive (deepfakes), keep robots safe, disclose weaknesses responsibly, and follow licences of code and datasets.` },
    ],
    exam: {
      short: [
        { q: 'What is software piracy?', a: 'Copying, distributing or using software without a valid licence from its owner.' },
        { q: 'Differentiate between a virus and a worm.', a: 'A virus attaches to a host file and spreads when the file is run; a worm spreads by itself across networks without needing a host file.' },
        { q: 'What is phishing?', a: 'A fraud in which attackers send fake messages or websites that look genuine to trick people into revealing passwords, OTPs or card details.' },
      ],
      long: [
        { q: 'Explain any five security and ethical issues in computing with examples.', a: 'Unauthorised hardware use — using a school robot lab PC without permission; software piracy — installing cracked paid software; hacking — breaking into a school database to change marks; data theft — stealing customers\' card details; viruses/malware — ransomware locking files; fraud — fake UPI payment requests or OTP scams.' },
        { q: 'Suggest measures to protect a connected robot and its users from cyber threats.', a: 'Change default passwords and use strong authentication; encrypt communication (HTTPS/TLS); keep firmware updated; restrict network access and use firewalls/segmentation; validate all inputs; log and monitor for intrusions; physically secure the robot; train users to recognise phishing; follow frameworks such as NIST (identify, protect, detect, respond, recover).' },
      ],
    },
  },

  c10_a_6: {
    figs: ['aiProjectCycle', 'fourWs'],
    sections: [
      { h: 'Problem scoping: the 4Ws and the problem statement', b: `Your syllabus uses the **4Ws problem canvas**:
• **Who** — stakeholders who face the problem and what we know about them.
• **What** — the nature of the problem; how do we know it is a problem (evidence)?
• **Where** — the context/situation/location in which it arises.
• **Why** — the benefits of solving it for the stakeholders.
**Problem statement template:** "Our [stakeholders] have a problem that [issue] when/while [context]. An ideal solution would [benefit]."
Example: "Our **farmers** have a problem that **crop diseases are noticed too late** **during the monsoon**. An ideal solution would **detect disease early from leaf photos and suggest treatment**."` },
      { h: 'Linking the stages', b: `Problem scoping decides **what data** to acquire → data acquisition gathers it (sources such as Kaggle, sensors, surveys) and splits training/testing data → data exploration cleans and graphs it → modelling chooses rule-based or learning-based models (e.g. linear regression, classification, clustering) → evaluation tests on testing data. The new lessons "Data Acquisition & Exploration" and "Modelling & Evaluation" cover these stages in detail.` },
    ],
    exam: {
      short: [
        { q: 'What is a problem statement template?', a: '"Our [stakeholders] have a problem that [issue] when/while [context]. An ideal solution would [benefit]."' },
        { q: 'What does SMART stand for?', a: 'Specific, Measurable, Achievable, Relevant, Time-bound.' },
        { q: 'What is meant by stakeholders?', a: 'People or groups who are affected by the problem or its solution.' },
      ],
      long: [
        { q: 'Fill the 4Ws canvas and write a problem statement for: students forgetting to submit homework.', a: 'Who — students, teachers, parents. What — 30% of homework is submitted late (class records). Where — at home after school, especially on days with many subjects. Why — better learning, fewer penalties, less stress for teachers. Statement: "Our students have a problem that they forget homework deadlines when they have many subjects in a day. An ideal solution would remind them at the right time and help plan their work."' },
        { q: 'Explain all stages of the AI project framework with an example of a mask-detection system.', a: 'Scoping — 4Ws: who (visitors, staff), what (people entering without masks during an outbreak), where (hospital entrance), why (reduce infection). Acquisition — images of people with/without masks (Kaggle + local camera), split 80/20. Exploration — check class balance, image quality. Modelling — learning-based image classifier. Evaluation — accuracy, precision, recall on test images; deploy at the gate camera and monitor.' },
      ],
    },
  },
};
