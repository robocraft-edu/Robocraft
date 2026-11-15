// Class 11 Robotics — textbook notes, diagrams and exam questions.
export default {
  c11_r_1: {
    figs: ['robotFields', 'sensePlanAct'],
    sections: [
      { h: 'Autonomous and semi-autonomous operation', b: `The syllabus defines a robot by **how it operates**:
• **Autonomous robots** sense, plan and act without human input during the task — a warehouse AMR choosing its route, a Mars rover driving between waypoints, a robotic lawn mower.
• **Semi-autonomous robots** handle low-level control themselves while a human gives high-level commands or approves decisions — a surgical robot (surgeon controls, robot filters tremor), a drone that holds position while the pilot points the camera, a bomb-disposal robot with automatic arm stabilisation.
Both rely on **sensors** for perception and increasingly on **AI** (computer vision, path planning, learning) for decisions.` },
      { h: 'The robotics engineering stack', b: `1. **Mechanical** — structure, mechanisms, materials, kinematics and dynamics.
2. **Electrical/electronic** — motors, drivers, sensors, power, communication buses.
3. **Computing** — microcontrollers, SBCs, embedded programming, real-time control.
4. **Control** — feedback loops, PID, stability.
5. **Intelligence** — perception, planning, learning.
6. **Systems engineering** — integration, testing, safety, project management.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between autonomous and semi-autonomous robots with an example each.', a: 'Autonomous robots complete tasks without human intervention (e.g. warehouse AMR); semi-autonomous robots share control — humans give high-level commands while the robot handles low-level control (e.g. surgical robot, camera drone).' },
        { q: 'Why is linear algebra important in robotics?', a: 'Positions, orientations and transformations between frames are represented with vectors and matrices; kinematics, computer vision and control all use matrix operations.' },
        { q: 'What is a Kalman filter used for?', a: 'To combine noisy measurements from several sensors (and a motion model) into the best estimate of the robot\'s state, e.g. fusing gyro and accelerometer for orientation.' },
      ],
      long: [
        { q: 'Explain how robots operate autonomously or semi-autonomously using sensors and AI, with two examples.', a: 'Robots run a sense–plan–act loop. Sensors (cameras, LIDAR, IMU, encoders) collect data; AI and algorithms interpret it (object recognition, localisation, path planning) and decide actions; actuators execute them; feedback corrects errors. Example 1: a self-driving delivery robot uses cameras and LIDAR with neural networks to detect pedestrians and plans a path autonomously. Example 2: a surgical robot is semi-autonomous — the surgeon commands motions, the robot scales and stabilises them using sensors.' },
        { q: 'Describe the interdisciplinary nature of robotics.', a: 'Mechanical engineering designs structure, mechanisms and drives; electrical engineering provides motors, sensors, power and communication; computer science writes embedded software, algorithms and AI; control engineering ensures stable accurate motion; mathematics (linear algebra, calculus, probability) models all of these; physics explains forces and energy. Integrating them is the task of robotics engineering.' },
      ],
    },
  },

  c11_r_2: {
    sections: [
      { h: 'ISO 8373 key terms', b: `• **Industrial robot:** automatically controlled, reprogrammable, multipurpose manipulator programmable in three or more axes.
• **Service robot:** a robot that performs useful tasks for humans or equipment, excluding industrial automation.
• **Manipulator:** a machine whose mechanism usually consists of a series of segments jointed or sliding relative to one another, for grasping and/or moving objects.
• **Axis:** direction used to specify the robot motion in a linear or rotary mode.` },
      { h: 'Applying the definition — test cases', b: `• Washing machine — reprogrammable? no (fixed cycles); multipurpose? no → **not a robot**.
• 3D printer — programmable in 3 axes, but single purpose → **automated machine** (often called a Cartesian robot loosely).
• Six-axis arm that welds today and palletises tomorrow → **robot**.
• Teleoperated bomb-disposal unit → **teleoperated robot/remote manipulator** (low autonomy).` },
    ],
    exam: {
      short: [
        { q: 'State the ISO 8373 definition of an industrial robot.', a: 'An automatically controlled, reprogrammable, multipurpose manipulator programmable in three or more axes, which may be fixed or mobile, for use in industrial automation applications.' },
        { q: 'Why is a CNC lathe not considered a robot?', a: 'It is programmable but designed for one specific task (machining) and lacks the multipurpose manipulation and general reprogrammability of a robot.' },
        { q: 'What is meant by "multipurpose" in the definition of a robot?', a: 'The robot can be adapted to different tasks by changing its program and/or end-effector.' },
      ],
      long: [
        { q: 'Explain the key attributes of a robot from its technical definition with examples.', a: 'Programmability — behaviour changed by software (arm reprogrammed from welding to painting); multipurpose — performs varied tasks with different tools; manipulation — physically moves materials/tools; autonomy — operates without constant human control; sensing and feedback — adapts to the environment. Example: a 6-axis industrial arm meets all; an RC car fails autonomy; a CNC lathe fails multipurpose.' },
        { q: 'Differentiate between a robot, a CNC machine, a teleoperated device and a simple machine.', a: 'Robot — programmable, multipurpose, autonomous manipulator. CNC machine — programmable but single-purpose automation. Teleoperated device — human controls every movement remotely; no autonomy. Simple machine — lever, pulley; no power, sensing or intelligence.' },
      ],
    },
  },

  c11_r_3: {
    sections: [
      { h: 'AI and ML in new-age robotics', b: `• **Smart manufacturing (Industry 4.0):** robots with vision inspect parts, predictive-maintenance models forecast failures from vibration data, digital twins simulate the whole factory, cobots share tasks with workers.
• **Healthcare:** surgical robots with tremor filtering and image guidance, rehabilitation exoskeletons adapting assistance with ML, pharmacy automation, disinfection robots, AI triage.
• **Autonomous vehicles:** sensor fusion (camera + radar + LIDAR), deep-learning perception (lane, sign, pedestrian detection), path planning and control; levels of autonomy from L0 to L5.` },
      { h: 'Learning approaches used', b: `• **Supervised learning** for perception (labelled images of defects, pedestrians).
• **Reinforcement learning** for control (learning to walk or grasp in simulation).
• **Imitation learning** — learning by watching human demonstrations.
• **Sim-to-real transfer** — train in simulation, adapt to the real robot.` },
    ],
    exam: {
      short: [
        { q: 'How is machine learning used in smart manufacturing?', a: 'Vision-based quality inspection, predictive maintenance from sensor data, optimising robot paths and production scheduling.' },
        { q: 'What is a digital twin?', a: 'A virtual model of a physical robot or system, updated with real data, used to simulate, test and optimise before or during real operation.' },
        { q: 'What is sim-to-real transfer?', a: 'Training a robot\'s controller or policy in simulation and then transferring it to the physical robot.' },
      ],
      long: [
        { q: 'Discuss the role of AI and ML in new-age robotic systems in manufacturing, healthcare and autonomous vehicles.', a: 'Manufacturing — vision inspection, predictive maintenance, cobots, digital twins, adaptive scheduling. Healthcare — image-guided surgical robots, adaptive exoskeletons, hospital logistics robots, AI diagnostics. Autonomous vehicles — perception with deep learning, sensor fusion, localisation (SLAM/GPS), path planning, decision-making and control. Common benefits: precision, efficiency, safety; challenges: data, safety validation, ethics.' },
        { q: 'Explain soft robotics, swarm robotics and cloud robotics with an application each.', a: 'Soft robotics — compliant materials, safe and adaptable; soft grippers for fruit handling. Swarm robotics — many simple robots coordinating via local rules; search-and-rescue or drone light shows. Cloud robotics — offload computation and share data/maps through the cloud; warehouse fleets sharing a common map.' },
      ],
    },
  },

  c11_r_4: {
    sections: [
      { h: 'CAD modelling and precision manufacturing', b: `• **CAD (Computer Aided Design)** — 3D models in TinkerCAD, Fusion 360 or SolidWorks; check dimensions, fits, assembly and motion; generate drawings.
• **CAE** — simulation (FEA for stress, motion studies) before building.
• **Precision manufacturing** — CNC machining, laser cutting, 3D printing, injection moulding; tight **tolerances** ensure bearings and gears align and robots achieve their repeatability.` },
      { h: 'Sensors, actuators and control units — overview', b: `• **Sensors**: proprioceptive (encoders, IMU, current) and exteroceptive (camera, LIDAR, ultrasonic, force).
• **Actuators**: DC, BLDC, servo, stepper motors; hydraulic and pneumatic cylinders; harmonic drives for zero backlash.
• **Control units**: microcontrollers, SBCs, PLCs, FPGA motion controllers; industrial buses (EtherCAT, CAN).` },
    ],
    exam: {
      short: [
        { q: 'What is the role of CAD in robot development?', a: 'To model parts and assemblies in 3D, check fit and motion, run simulations and produce accurate drawings/files for manufacturing.' },
        { q: 'What is a harmonic drive and why is it used?', a: 'A compact high-ratio gear system (wave generator, flexspline, circular spline) with almost zero backlash, used in robot joints for precise positioning.' },
        { q: 'Name two safety components of an industrial robot cell.', a: 'Emergency stop buttons and light curtains (also safety-rated controllers, fences, interlocks).' },
      ],
      long: [
        { q: 'Describe the major components of an advanced robot.', a: 'Manipulator (links, joints, end-effector); drive system (servo/stepper/BLDC motors with encoders, harmonic drives); control system (real-time controller, FPGA motion control); sensing suite (vision, force/torque, tactile, proprioceptive); power system (Li-ion + BMS); communication (EtherCAT, CAN, Ethernet); safety system (e-stop, light curtains, safety controllers).' },
        { q: 'Explain the trade-offs engineers make when selecting robot components.', a: 'Precision vs speed (high-ratio gears increase precision/torque but reduce speed); payload vs cost and weight (stronger motors and frames cost more and weigh more); reliability vs complexity (more sensors improve capability but add failure points); battery capacity vs weight; processing power vs power consumption. Choices depend on the application\'s requirements.' },
      ],
    },
  },

  c11_r_5: {
    sections: [
      { h: 'Worked statics problem', b: `A two-link arm holds a 1.5 kg load at the end. Link 1 (0.3 m, 1 kg) and link 2 (0.25 m, 0.6 kg) are horizontal. Take g = 9.8 m/s².
Torque at the **elbow** (due to link 2 and load):
τ₂ = (0.6 × 9.8 × 0.125) + (1.5 × 9.8 × 0.25) = 0.735 + 3.675 = **4.41 N·m**
Torque at the **shoulder** (everything beyond it):
τ₁ = (1 × 9.8 × 0.15) + (0.6 × 9.8 × 0.425) + (1.5 × 9.8 × 0.55)
= 1.47 + 2.50 + 8.09 = **12.06 N·m**
Choose motors (with gearboxes) giving at least ~1.5× these values for a safety margin.` },
      { h: 'Motion, forces and control', b: `• **Kinematics** describes motion (position, velocity, acceleration) without forces.
• **Dynamics** links forces/torques to motion (F = ma, τ = Iα).
• **Control** uses these models: feed-forward gravity compensation + feedback (PID) to follow trajectories accurately.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between statics and dynamics in robotics.', a: 'Statics analyses forces/torques when the robot is at rest (e.g. torque to hold a load); dynamics analyses forces/torques during motion, including inertia and acceleration.' },
        { q: 'A motor must hold 2 kg at 0.5 m horizontally. Find the torque (g = 9.8 m/s²).', a: 'τ = m g d = 2 × 9.8 × 0.5 = 9.8 N·m.' },
        { q: 'State the rotational form of Newton\'s second law.', a: 'τ = Iα — torque equals moment of inertia times angular acceleration.' },
      ],
      long: [
        { q: 'Explain why physics is important in robot design, with reference to motor sizing and control.', a: 'Motor sizing requires computing torque from loads (statics: τ = mgd) and accelerations (dynamics: τ = Iα + friction). Energy methods help estimate power and battery needs. Control design uses dynamic models for gravity compensation and to avoid overshoot; friction models improve accuracy. Without physics, motors may be undersized (stall) or oversized (heavy, costly).' },
        { q: 'Compare the Newton–Euler and Lagrangian approaches to robot dynamics.', a: 'Newton–Euler applies force and moment balance (F = ma, τ = Iα) link by link, recursively — efficient for computation in real time. Lagrangian uses kinetic and potential energy (L = T − V) and derives equations of motion systematically — elegant for analysis and handles constraints neatly. Both give equivalent equations.' },
      ],
    },
  },

  c11_r_6: {
    figs: ['vectorRotation'],
    sections: [
      { h: 'Vectors and vector spaces', b: `A **vector** has magnitude and direction: v = (3, 4) has magnitude √(3² + 4²) = 5.
• **Addition:** (3, 4) + (1, −2) = (4, 2) — combining displacements.
• **Scalar multiplication:** 2 × (3, 4) = (6, 8).
• **Dot product:** a·b = a₁b₁ + a₂b₂ = |a||b|cosθ — used to find angles between directions.
• **Cross product** (3-D): gives a vector perpendicular to both — used for torque τ = r × F.
A **vector space** is a set of vectors closed under addition and scalar multiplication; a robot's joint space (θ₁, θ₂, …, θₙ) and task space (x, y, z) are examples.` },
      { h: 'Matrix operations worked example', b: `Rotate the point p = (2, 0) by θ = 90° about the origin:
R(90°) = [[cos90, −sin90], [sin90, cos90]] = [[0, −1], [1, 0]]
p′ = R·p = (0×2 + (−1)×0, 1×2 + 0×0) = **(0, 2)**
Translate by t = (5, 1): p″ = p′ + t = **(5, 3)**
A **homogeneous transformation** combines both in one 3×3 (2-D) or 4×4 (3-D) matrix:
~~~
T = | cosθ  -sinθ  tx |
    | sinθ   cosθ  ty |
    |  0      0     1 |
~~~` },
      { h: 'Algorithms in robotics maths', b: `Mathematics becomes algorithms: matrix multiplication for forward kinematics, numerical root-finding for inverse kinematics, gradient descent for optimisation and machine learning, and Kalman filters (matrix equations) for state estimation.` },
    ],
    exam: {
      short: [
        { q: 'Find the magnitude of the vector (6, 8).', a: '√(36 + 64) = 10.' },
        { q: 'Write the 2-D rotation matrix for an angle θ.', a: 'R(θ) = [[cosθ, −sinθ], [sinθ, cosθ]].' },
        { q: 'What is a homogeneous transformation matrix?', a: 'A matrix (3×3 in 2-D, 4×4 in 3-D) combining rotation and translation so a point can be transformed between frames with a single multiplication.' },
      ],
      long: [
        { q: 'A point (1, 0) is rotated by 30° and then translated by (2, 3). Find the final point.', a: 'R(30°)·(1, 0) = (cos30°, sin30°) = (0.866, 0.5). Add (2, 3): final point = (2.866, 3.5).' },
        { q: 'Explain the role of matrices, vectors, calculus and probability in robotics.', a: 'Vectors represent positions, velocities and forces; matrices represent rotations/transformations between frames and Jacobians; calculus gives velocity and acceleration from position (differentiation) and position from velocity (integration); probability models sensor noise and uncertainty (Kalman filters, Bayesian localisation).' },
      ],
    },
  },

  c11_r_7: {
    figs: ['projectLifecycle'],
    sections: [
      { h: 'Planning, execution and monitoring in a school robotics project', b: `**Planning**
• Define scope and SMART goal: "Build a line-follower that completes the 5 m track in under 20 s by 15 December."
• WBS: mechanical (chassis, wheels), electronics (sensors, driver, power), software (PID line following), testing.
• Schedule with a Gantt chart; budget the parts list; risk register (late parts → order early; motor burns → spare).
**Execution**
• Build subsystems in parallel, integrate weekly, keep code in Git, record decisions.
**Monitoring and control**
• Weekly progress review against the Gantt chart; track lap time as a KPI; manage changes (e.g. switch to a faster motor) with impact on cost and time.` },
      { h: 'Critical path example', b: `Tasks: A design (3 days) → B order parts (5) → D assemble (2) → E code & test (4); C write code (4) can run after A in parallel with B.
Paths: A–B–D–E = 3 + 5 + 2 + 4 = 14 days; A–C–E = 3 + 4 + 4 = 11 days.
**Critical path = A–B–D–E (14 days)** — any delay in these tasks delays the project; C has 3 days of slack.` },
    ],
    exam: {
      short: [
        { q: 'What is a Work Breakdown Structure?', a: 'A hierarchical breakdown of a project into smaller, manageable deliverables and tasks.' },
        { q: 'What is the critical path?', a: 'The longest sequence of dependent tasks that determines the minimum project duration; delaying any of them delays the project.' },
        { q: 'State two uses of a Gantt chart.', a: 'To show the schedule of tasks on a timeline and to track progress against the plan (also shows overlaps/dependencies).' },
      ],
      long: [
        { q: 'Explain planning, execution and monitoring in the management of a robotics project, with an example.', a: 'Planning — define SMART objectives, WBS, schedule (Gantt), budget, risks and responsibilities. Execution — build, code, integrate and test according to the plan, using version control and documentation. Monitoring — compare progress with the plan (milestones, KPIs like lap time), handle changes and risks, take corrective action. Example: a line-follower project tracked weekly with a Gantt chart and Git.' },
        { q: 'For tasks A(2), B(4, after A), C(3, after A), D(2, after B and C), find the project duration and the critical path.', a: 'Paths: A–B–D = 2 + 4 + 2 = 8 days; A–C–D = 2 + 3 + 2 = 7 days. Duration = 8 days; critical path = A–B–D; task C has 1 day slack.' },
      ],
    },
  },

  c11_m_1: {
    figs: ['frames'],
    sections: [
      { h: 'Fixed and moving frames', b: `• A **fixed frame** does not move during the task — the world frame, or the robot base frame for a bolted arm.
• A **moving frame** is attached to a body that moves — each link frame, the tool frame, the frame of a mobile robot's body.
Describing a point in a moving frame and then converting it to the fixed frame is the core of kinematics. E.g. the camera on a mobile robot sees an object at (1 m, 0) in its own frame; if the robot is at (4, 2) facing 90° in the world frame, the object is at (4, 3) in the world frame.` },
      { h: 'Structural frames — quick design rules', b: `• Keep the centre of gravity low and inside the wheelbase.
• Use triangles (trusses) for stiffness.
• Leave access to batteries and electronics.
• Standard hole patterns make the frame modular.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between a fixed frame and a moving frame.', a: 'A fixed frame stays stationary (world/base frame); a moving frame is attached to a moving body (link, tool, mobile robot) and moves with it.' },
        { q: 'Why is aluminium extrusion popular for robot frames?', a: 'It is light, strong, corrosion resistant and modular (T-slots allow quick reconfiguration).' },
        { q: 'What is FEA?', a: 'Finite Element Analysis — computer simulation of stresses and deflections in a structure under load.' },
      ],
      long: [
        { q: 'Explain fixed and moving frames with the example of a mobile robot with a camera.', a: 'The world frame is fixed to the room. The robot body frame moves with the robot; the camera frame is fixed on the robot and moves with it. An object detected at (1, 0) in the camera/robot frame is converted to the world frame using the robot\'s position (x, y) and heading θ: X = x + 1·cosθ, Y = y + 1·sinθ. Such transformations let the robot plan in world coordinates.' },
        { q: 'Discuss the factors that influence the design of a robot frame.', a: 'Rigidity (resist bending/twisting), weight (payload and battery life), material (aluminium, steel, carbon fibre, plastic), manufacturing method (machining, welding, 3D printing, extrusion), modularity, cost, centre of gravity and stability, environmental resistance; FEA used to verify before building.' },
      ],
    },
  },

  c11_m_2: {
    figs: ['frames', 'coordSystems'],
    sections: [
      { h: 'Worked transformation', b: `A tool is at (0.1, 0, 0) m in the wrist frame. The wrist frame is at (0.5, 0.2, 0.3) in the base frame and rotated 90° about z.
Rotate: (0.1, 0, 0) → (0, 0.1, 0); translate: + (0.5, 0.2, 0.3) → **(0.5, 0.3, 0.3)** in the base frame.` },
      { h: 'Chaining frames', b: `To find the tool in the world frame, multiply transforms in order:
T(world→tool) = T(world→base) · T(base→link1) · T(link1→link2) · … · T(linkN→tool)
Each T is a 4×4 homogeneous matrix; this product is exactly forward kinematics.` },
    ],
    exam: {
      short: [
        { q: 'What are the two parts of a homogeneous transformation?', a: 'A 3×3 rotation matrix (orientation) and a 3×1 translation vector (position), plus a bottom row [0 0 0 1].' },
        { q: 'What is the DH convention?', a: 'Denavit–Hartenberg convention — a standard way to attach frames to robot joints using four parameters per link (θ, d, a, α).' },
        { q: 'Name four frames used in a robot arm.', a: 'World, base, joint/link frames and tool frame (also sensor/camera frames).' },
      ],
      long: [
        { q: 'Why do robots need multiple reference frames? Explain with examples of world, base, joint, tool and sensor frames.', a: 'Each part sees positions differently. World frame — fixed global reference; base — robot mounting point; joint frames — move with each joint for kinematics; tool frame — at the end-effector to define tool position/orientation (TCP); sensor frames — camera/IMU measurements. Transformations convert data between frames so the robot can, e.g., move its tool to an object seen by its camera.' },
        { q: 'A point is at (2, 1) in frame B. Frame B is rotated 90° and translated by (3, 4) relative to frame A. Find the point in frame A.', a: 'Rotate (2, 1) by 90°: (−1, 2). Translate by (3, 4): (2, 6). The point is at (2, 6) in frame A.' },
      ],
    },
  },

  c11_m_3: {
    figs: ['dof6'],
    sections: [
      { h: 'DOF in 3D modelling with TinkerCAD', b: `In TinkerCAD you can see DOF by building simple joints:
• A pin joint (cylinder through two links) allows **1 rotational DOF**.
• A slider in a slot allows **1 translational DOF**.
• A ball in a socket allows **3 rotational DOF**.
Assemble an RR arm (2 DOF) and an RP arm (1 rotation + 1 slide = 2 DOF) and move the parts to visualise the reachable workspace.` },
      { h: 'Worked Grübler problems', b: `**Planar slider-crank:** n = 4 links (ground, crank, rod, slider), joints: 3 revolute + 1 prismatic, all f = 1.
DOF = 3(4 − 1) − Σ(3 − 1) × 4 = 9 − 8 = **1**.
**Planar five-bar linkage:** n = 5, 5 revolute joints → DOF = 3(4) − 2(5) = **2** (needs two motors).
**Stewart platform (spatial):** n = 14 links, 6 prismatic (f = 1), 6 universal (f = 2), 6 spherical (f = 3), 18 joints.
DOF = 6(13) − [6(5) + 6(4) + 6(3)] = 78 − 72 = **6**.` },
    ],
    exam: {
      short: [
        { q: 'State Grübler\'s formula for planar mechanisms.', a: 'DOF = 3(n − 1) − Σ(3 − fᵢ), or equivalently 3(n − 1) − 2j₁ − j₂.' },
        { q: 'What is a redundant robot?', a: 'A robot with more DOF than needed for its task (usually more than 6 in 3-D), giving extra flexibility to avoid obstacles and singularities.' },
        { q: 'Find the DOF of a planar mechanism with 6 links and 7 revolute joints.', a: '3(6 − 1) − 2(7) = 15 − 14 = 1.' },
      ],
      long: [
        { q: 'Using Grübler\'s formula, find the DOF of (a) a four-bar linkage (b) a slider-crank (c) a five-bar linkage. Interpret each result.', a: '(a) n = 4, 4R: 9 − 8 = 1 — one input drives it. (b) n = 4, 3R + 1P: 9 − 8 = 1 — one input (crank). (c) n = 5, 5R: 12 − 10 = 2 — two independent inputs needed.' },
        { q: 'Explain redundant, underactuated and over-constrained systems with examples.', a: 'Redundant — more DOF than needed (7-DOF arm, human arm) — avoids obstacles/singularities. Underactuated — fewer actuators than DOF (a passive-walking robot, a quadcopter has 6 DOF but 4 motors). Over-constrained — formula gives DOF ≤ 0 but special geometry allows motion (Bennett linkage).' },
      ],
    },
  },

  c11_m_4: {
    figs: ['fourBar', 'planarSpatial'],
    sections: [
      { h: 'Grashof check — worked example', b: `Links: 3 cm, 7 cm, 8 cm, 9 cm. s = 3, l = 9, p + q = 7 + 8 = 15.
s + l = 12 ≤ 15 → **Grashof linkage**: at least one link can rotate fully.
• If the shortest link is the **crank** (next to ground) → crank-rocker.
• If the shortest link is the **ground** → double-crank (drag link).
• If the shortest link is the **coupler** → double-rocker.` },
      { h: 'Planar mechanisms in robots', b: `• **Parallelogram linkage** keeps a gripper or camera level as the arm moves (palletising robots).
• **Slider-crank** in grippers converts motor rotation to finger closing.
• **Four-bar legs** in walking toys and robots (Jansen/Klann linkages).` },
    ],
    exam: {
      short: [
        { q: 'State Grashof\'s condition.', a: 's + l ≤ p + q, where s and l are the shortest and longest links and p, q the other two; if satisfied, at least one link can make a full rotation.' },
        { q: 'Give an application of the Geneva mechanism.', a: 'Intermittent motion, e.g. film projector advance or indexing tables.' },
        { q: 'What does a slider-crank convert?', a: 'Rotary motion into reciprocating (linear) motion, or vice versa.' },
      ],
      long: [
        { q: 'Links of a four-bar are 4, 10, 8 and 7 cm with the 4 cm link as the crank. Check Grashof\'s condition and name the type.', a: 's = 4, l = 10, p + q = 8 + 7 = 15; s + l = 14 ≤ 15 → Grashof. Shortest link is the crank (adjacent to ground) → crank-rocker mechanism.' },
        { q: 'Explain any four planar mechanisms with applications.', a: 'Four-bar (crank-rocker) — windshield wiper; slider-crank — engine piston/pump; cam-follower — valve timing, automated machines; Geneva — intermittent indexing; ratchet-pawl — one-way motion in wrenches and winches.' },
      ],
    },
  },

  c11_m_5: {
    sections: [
      { h: 'Qualitative pictures you should be able to sketch', b: `• **Universal (Hooke's) joint** — two yokes and a cross; transmits rotation between shafts at an angle (car drive shafts).
• **Spherical wrist** — three revolute axes meeting at one point (roll–pitch–roll) so orientation can be set independently of position.
• **Stewart–Gough platform** — a top plate supported by six extendable legs on a base; 6 DOF; flight simulators and precision positioning.
• **Delta robot** — three parallelogram arms from a base to a small moving platform; very fast pick-and-place.` },
      { h: 'Serial vs parallel manipulators', b: `• **Serial** (open chain, e.g. 6-axis arm): large workspace, simpler kinematics, but errors add up along the chain and payload is limited.
• **Parallel** (closed chain, e.g. Stewart, Delta): very stiff, accurate and fast with high payload-to-weight, but smaller workspace and complex kinematics.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between planar and spatial mechanisms.', a: 'In planar mechanisms all points move in parallel planes (2-D); in spatial mechanisms links move in 3-D.' },
        { q: 'What is a Stewart platform used for?', a: 'Flight and driving simulators, precision positioning and machining — it provides 6-DOF motion with six parallel actuators.' },
        { q: 'Name two joints used in spatial mechanisms.', a: 'Spherical (ball) joint and universal joint (also cylindrical and helical joints).' },
      ],
      long: [
        { q: 'Compare serial and parallel manipulators.', a: 'Serial: open chain, large workspace, lower stiffness, errors accumulate, easier forward kinematics, e.g. articulated arm. Parallel: closed chains, high stiffness and accuracy, high speed and payload, small workspace, easier inverse kinematics, e.g. Stewart platform, Delta robot.' },
        { q: 'Describe the Stewart platform with a sketch and explain how it achieves 6 DOF.', a: 'Sketch: a base plate and a top platform connected by six linear actuators (legs) through universal joints at the base and spherical joints at the top. Changing the lengths of the six legs independently moves the top platform in x, y, z and rotates it in roll, pitch and yaw — 6 DOF (Grübler: 6×13 − 72 = 6).' },
      ],
    },
  },

  c11_m_6: {
    figs: ['rrMechanism'],
    sections: [
      { h: 'Forward kinematics of the 2R planar arm', b: `x = L₁cosθ₁ + L₂cos(θ₁ + θ₂)
y = L₁sinθ₁ + L₂sin(θ₁ + θ₂)
Orientation of the end link φ = θ₁ + θ₂.
**Example:** L₁ = 0.4 m, L₂ = 0.3 m, θ₁ = 45°, θ₂ = −45°:
x = 0.4(0.707) + 0.3cos0° = 0.283 + 0.3 = **0.583 m**
y = 0.4(0.707) + 0.3sin0° = **0.283 m**, φ = 0°.` },
      { h: 'Forward kinematics of the RP arm', b: `An RP arm has a revolute base joint (angle θ) and a prismatic joint that extends the arm to length d.
x = d·cosθ, y = d·sinθ
**Example:** θ = 30°, d = 0.5 m → x = 0.5 × 0.866 = **0.433 m**, y = 0.5 × 0.5 = **0.25 m**.
The RP arm naturally works in **polar coordinates** (d, θ).` },
      { h: 'Inverse kinematics of the 2R arm (for interest)', b: `cosθ₂ = (x² + y² − L₁² − L₂²) / (2L₁L₂); θ₂ = ±arccos(…) gives **elbow-up and elbow-down** solutions.
θ₁ = atan2(y, x) − atan2(L₂sinθ₂, L₁ + L₂cosθ₂).
If |cosθ₂| > 1, the point is out of reach (no solution).` },
    ],
    exam: {
      short: [
        { q: 'Write the forward kinematics equations of a 2R planar manipulator.', a: 'x = L₁cosθ₁ + L₂cos(θ₁+θ₂); y = L₁sinθ₁ + L₂sin(θ₁+θ₂).' },
        { q: 'An RP arm has θ = 60° and d = 2 m. Find (x, y).', a: 'x = 2cos60° = 1 m; y = 2sin60° ≈ 1.732 m.' },
        { q: 'What is a singularity?', a: 'A configuration in which the robot loses one or more DOF (e.g. arm fully stretched) and cannot move in some directions; joint speeds may become very large.' },
      ],
      long: [
        { q: 'For a 2R arm with L₁ = 1 m, L₂ = 0.5 m, find the end-effector position for (a) θ₁ = 0°, θ₂ = 90° (b) θ₁ = 90°, θ₂ = 90°.', a: '(a) x = 1·1 + 0.5cos90° = 1; y = 0 + 0.5sin90° = 0.5 → (1, 0.5). (b) x = 1cos90° + 0.5cos180° = 0 − 0.5 = −0.5; y = 1sin90° + 0.5sin180° = 1 → (−0.5, 1).' },
        { q: 'Differentiate between forward and inverse kinematics and explain why inverse kinematics is more difficult.', a: 'FK: given joint variables, find end-effector pose — unique, direct substitution/matrix multiplication. IK: given a desired pose, find joint variables — non-linear equations that may have multiple solutions (elbow up/down), no solution (outside workspace) or infinitely many (redundant robots); often needs numerical methods (Jacobian, CCD).' },
      ],
    },
  },

  c11_m_7: {
    figs: ['coordSystems'],
    sections: [
      { h: 'Conversions with worked examples', b: `**Polar → Cartesian:** x = r cosθ, y = r sinθ.
(r = 5, θ = 53.13°) → x = 3, y = 4.
**Cartesian → polar:** r = √(x² + y²), θ = atan2(y, x).
(−2, 2) → r = 2.83, θ = 135°.
**Cylindrical (r, θ, z) → Cartesian:** x = r cosθ, y = r sinθ, z = z.
(2, 90°, 1.5) → (0, 2, 1.5).` },
      { h: 'Which coordinate system suits which robot?', b: `• Cartesian (gantry) robot → Cartesian coordinates.
• Cylindrical robot (R-P-P) → cylindrical coordinates.
• SCARA → effectively cylindrical in the horizontal plane + vertical z.
• Polar/spherical robot (R-R-P) → spherical coordinates.
• Mobile robot pose → (x, y, θ).` },
    ],
    exam: {
      short: [
        { q: 'Convert the polar point (4, 30°) to Cartesian.', a: 'x = 4cos30° = 3.46; y = 4sin30° = 2 → (3.46, 2).' },
        { q: 'Convert (0, −3) to polar coordinates.', a: 'r = 3, θ = −90° (or 270°).' },
        { q: 'What is gimbal lock?', a: 'Loss of one rotational degree of freedom when two gimbal axes align in Euler-angle representation; quaternions avoid it.' },
      ],
      long: [
        { q: 'Explain Cartesian, polar and cylindrical coordinate systems with diagrams and a robot that uses each.', a: 'Cartesian (x, y, z) — three perpendicular axes; gantry/3D printer. Polar (r, θ) — distance from origin and angle in a plane; RP arm, LIDAR scans. Cylindrical (r, θ, z) — polar plus height; cylindrical robot/SCARA. Diagrams: axes with a point; radius line with angle; cylinder with r, θ, z marked.' },
        { q: 'A LIDAR reports obstacles at (2 m, 0°), (1.5 m, 90°) and (3 m, 225°). Convert them to Cartesian coordinates in the robot frame.', a: '(2, 0°) → (2, 0); (1.5, 90°) → (0, 1.5); (3, 225°) → (3cos225°, 3sin225°) = (−2.12, −2.12).' },
      ],
    },
  },

  c11_m_8: {
    figs: ['accuracyRepeat', 'workspace'],
    sections: [
      { h: 'Resolution', b: `**Resolution** is the smallest increment of motion the robot can command or detect.
• Control resolution depends on the encoder and drive: a joint with a 4096-count encoder and 100:1 gearbox resolves 360° ÷ (4096 × 100) ≈ **0.00088°**.
• Spatial resolution at the tool = joint resolution × arm length — longer arms magnify small angle steps.
Relationship: resolution ≤ repeatability ≤ accuracy (resolution is the finest; accuracy is usually the largest error).` },
      { h: 'Current trends', b: `• Cobots with ±0.03–0.1 mm repeatability and built-in force sensing.
• Lightweight arms with high payload-to-weight ratios (carbon fibre, hollow joints).
• Vision-guided calibration improves absolute accuracy.
• Higher IP ratings (IP67) for food and outdoor use; cleanroom robots for semiconductors.
• Mobile manipulators — arms mounted on AMRs.` },
    ],
    exam: {
      short: [
        { q: 'Define resolution, accuracy and repeatability.', a: 'Resolution — smallest controllable increment of motion; accuracy — closeness of the actual position to the commanded target; repeatability — closeness of repeated positions to each other.' },
        { q: 'Why is repeatability usually better than accuracy?', a: 'Repeatability depends only on consistent mechanics/control, while accuracy is also affected by model errors (link lengths, calibration, deflection), which add a fixed offset.' },
        { q: 'What does an IP67 rating mean?', a: 'Dust-tight (6) and protected against temporary immersion in water (7).' },
      ],
      long: [
        { q: 'Explain the main specifications used to select an industrial robot.', a: 'Payload (max load incl. tool), reach (max distance), number of axes/DOF, repeatability and accuracy, speed/cycle time, workspace envelope, resolution, mounting options, weight, power requirement, IP/environment rating, controller and safety features.' },
        { q: 'A robot is commanded to (100, 100) mm five times and reaches (101.2, 99.6), (101.3, 99.5), (101.1, 99.7), (101.2, 99.6), (101.2, 99.6). Comment on its accuracy and repeatability.', a: 'The points are tightly clustered (spread ≈ ±0.1 mm) → good repeatability. Their average (101.2, 99.6) is about 1.27 mm from the target → poor accuracy (systematic offset). Calibration could improve accuracy.' },
      ],
    },
  },

  c11_c_1: {
    figs: ['logicGates', 'truthTable2'],
    sections: [
      { h: 'Boolean logic in robot decision-making', b: `Example: a delivery robot should move only if the path is clear AND battery is not low, OR if an operator override is ON.
MOVE = (CLEAR · LOW̅) + OVERRIDE
~~~
bool move = (clear && !lowBattery) || override;
if (move) driveForward(); else stopMotors();
~~~
Truth-table thinking ensures every combination (8 rows for 3 inputs) is handled safely.` },
      { h: 'Simplification example', b: `Y = A·B + A·B̅ = A·(B + B̅) = A·1 = **A**
Y = A + A̅·B = (A + A̅)(A + B) = **A + B**
Simpler expressions mean fewer gates or faster code.` },
    ],
    exam: {
      short: [
        { q: 'Simplify A·B + A·B̅.', a: 'A·(B + B̅) = A·1 = A.' },
        { q: 'What is short-circuit evaluation?', a: 'In A AND B, if A is false B is not evaluated; in A OR B, if A is true B is not evaluated.' },
        { q: 'State De Morgan\'s theorems.', a: 'NOT(A AND B) = NOT A OR NOT B; NOT(A OR B) = NOT A AND NOT B.' },
      ],
      long: [
        { q: 'A robot arm may move only when the safety gate is closed (G = 1), the e-stop is not pressed (E = 0) and either auto mode (A = 1) or a teach-pendant enable (T = 1) is active. Write the Boolean expression and code.', a: 'MOVE = G · E̅ · (A + T). Code: bool move = gate && !estop && (autoMode || teachEnable);' },
        { q: 'Prove using a truth table that A + A̅·B = A + B.', a: 'A B | A̅·B | A + A̅·B | A + B: 0 0 | 0 | 0 | 0; 0 1 | 1 | 1 | 1; 1 0 | 0 | 1 | 1; 1 1 | 0 | 1 | 1. The last two columns match, so the identity holds.' },
      ],
    },
  },

  c11_mc_1: {
    figs: ['mcuBlock'],
    sections: [
      { h: 'Block diagram explained', b: `• **CPU** fetches instructions from Flash, decodes and executes them using the ALU and registers.
• **Flash** (non-volatile) stores the program; **SRAM** (volatile) stores variables and the stack; **EEPROM** stores settings.
• **Buses** carry addresses and data between CPU, memory and peripherals.
• **Peripherals**: GPIO, ADC, timers/counters (PWM, timing), UART/I2C/SPI, interrupt controller, watchdog timer.
• **Clock** (crystal) sets the instruction speed, e.g. 16 MHz on Arduino Uno.` },
      { h: 'Interrupts and timers', b: `**Interrupts** let hardware events stop the main program briefly to run an **ISR (Interrupt Service Routine)**, then return — essential for counting encoder pulses or reacting to bumpers instantly.
~~~
volatile long ticks = 0;
void countTick() { ticks++; }          // ISR: keep it short

void setup() {
  pinMode(2, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(2), countTick, RISING);
}
void loop() {
  noInterrupts(); long t = ticks; interrupts();
  // use t to compute wheel distance
}
~~~
**Timers** are hardware counters driven by the clock. They generate PWM, measure pulse widths (ultrasonic echo), and create precise periodic tasks without delay(). millis() and micros() on Arduino are based on Timer0.
~~~
unsigned long last = 0;
void loop() {
  if (millis() - last >= 100) {   // run every 100 ms, non-blocking
    last = millis();
    readSensors();
  }
}
~~~` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between a microcontroller and a microprocessor.', a: 'A microcontroller integrates CPU, memory and I/O peripherals on one chip for embedded control; a microprocessor contains only the CPU and needs external memory and I/O.' },
        { q: 'What is an interrupt?', a: 'A hardware or software signal that temporarily stops the main program so that an Interrupt Service Routine can respond immediately to an event.' },
        { q: 'Why should variables shared with an ISR be declared volatile?', a: 'So the compiler always reads the latest value from memory instead of a cached copy, since the ISR can change it at any time.' },
      ],
      long: [
        { q: 'Draw and explain the block diagram of a microcontroller.', a: 'Blocks: CPU (ALU, registers, control unit), Flash program memory, SRAM data memory, EEPROM, clock/oscillator, internal bus, I/O ports (GPIO), ADC, timers/counters, serial interfaces (UART, I2C, SPI), interrupt controller, watchdog. The CPU fetches instructions from Flash, uses SRAM for data, and interacts with the outside world via peripherals over the bus, timed by the clock.' },
        { q: 'Explain the use of interrupts and timers in a robot with code examples.', a: 'Interrupts: wheel encoder pulses on pin 2 trigger an ISR that increments a tick counter so no pulse is missed even while the main loop is busy (attachInterrupt(..., RISING)). Timers: generate PWM for motor speed, measure ultrasonic echo time, and schedule tasks every 100 ms using millis() instead of blocking delay(), keeping the robot responsive.' },
      ],
    },
  },

  c11_mc_2: {
    sections: [
      { h: 'SBC architecture block diagram', b: `**SoC** (CPU cores + GPU + memory controller + video/camera interfaces) ↔ **RAM** (LPDDR) ↔ **storage** (microSD/eMMC) ↔ **USB/Ethernet/Wi-Fi/Bluetooth** ↔ **GPIO header** (I2C, SPI, UART, PWM) ↔ **power management**. It boots an **operating system** (Linux) and runs many programs at once.` },
      { h: 'Choosing MCU vs SBC — decision guide', b: `• Need hard real-time (microsecond) motor timing, low power, instant start → **MCU**.
• Need camera processing, AI, networking, file system, multiple programs → **SBC**.
• Need both → SBC + MCU linked by UART/USB/I2C (e.g. Raspberry Pi + Arduino).` },
    ],
    exam: {
      short: [
        { q: 'Give two reasons to pair an SBC with an MCU in a robot.', a: 'The SBC handles high-level tasks (vision, planning, networking) while the MCU provides precise real-time motor control and sensor reading; it also protects the SBC from electrical noise.' },
        { q: 'Why is an SBC not ideal for precise PWM timing?', a: 'It runs a multitasking OS that can delay tasks unpredictably, so microsecond timing is not guaranteed (not hard real-time).' },
        { q: 'Name two SBCs used in robotics.', a: 'Raspberry Pi and NVIDIA Jetson (also BeagleBone).' },
      ],
      long: [
        { q: 'Compare microcontrollers and single-board computers under six headings.', a: 'Processor — simple CPU (MHz) vs multi-core SoC (GHz); Memory — KB vs GB; OS — none/RTOS vs Linux; Timing — real-time vs not guaranteed; Power — milliwatts vs watts; Interfaces — GPIO/ADC/serial vs USB, HDMI, Ethernet, camera + GPIO; Uses — motor/sensor control vs vision, AI, networking.' },
        { q: 'Describe the layered architecture of a robot using a Raspberry Pi and an Arduino.', a: 'High level (Raspberry Pi): camera input, object detection, path planning, user interface, Wi-Fi. Communication: serial/USB link sending commands like "speed L,R". Low level (Arduino): reads encoders and ultrasonic sensors, runs PID loops at fixed rate, drives motors via H-bridge, sends sensor data back. This combines intelligence with reliable reflexes.' },
      ],
    },
  },

  c11_mc_3: {
    figs: ['flowchartSymbols'],
    sections: [
      { h: 'Basic embedded C', b: `~~~
#define LED 13
const int SENSOR = A0;
int threshold = 500;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(SENSOR);      // 0–1023
  if (value > threshold) {
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
  Serial.println(value);
  delay(50);
}
~~~
Key elements: data types (int, long, float, bool, unsigned), #define and const, functions, if/else, for/while, bitwise operators (&, |, ^, <<, >>).` },
      { h: 'Bit manipulation for registers', b: `~~~
PORTB |=  (1 << 5);   // set bit 5   → pin 13 HIGH
PORTB &= ~(1 << 5);   // clear bit 5 → pin 13 LOW
PORTB ^=  (1 << 5);   // toggle bit 5
bool on = PINB & (1 << 5);   // read bit 5
~~~
Direct register access is much faster than digitalWrite().` },
      { h: 'Algorithm → pseudocode → code', b: `See the lesson "Algorithms, Flowcharts & Pseudocode" for the full method. Always design the logic first, dry-run it, then write the code.` },
    ],
    exam: {
      short: [
        { q: 'What is the role of setup() and loop() in Arduino?', a: 'setup() runs once after reset to initialise pins and peripherals; loop() runs repeatedly forever with the main program logic.' },
        { q: 'Write the C statement to set bit 3 of a register REG without changing other bits.', a: 'REG |= (1 << 3);' },
        { q: 'Why should long delay() calls be avoided?', a: 'delay() blocks the CPU so the program cannot read sensors or respond to events during that time; use millis()-based timing instead.' },
      ],
      long: [
        { q: 'Write an Arduino program that reads a potentiometer on A0 and sets the brightness of an LED on pin 9 accordingly. Explain each step.', a: '~~~\nvoid setup() { pinMode(9, OUTPUT); }\nvoid loop() {\n  int v = analogRead(A0);        // 0–1023 from the ADC\n  int duty = map(v, 0, 1023, 0, 255);\n  analogWrite(9, duty);         // PWM 0–255\n}\n~~~\nThe ADC converts the pot voltage to 0–1023; map() scales it to the 0–255 PWM range; analogWrite sets the duty cycle on PWM pin 9, changing LED brightness.' },
        { q: 'Explain the development workflow for programming a microcontroller.', a: 'Algorithm/flowchart → write code in an IDE (Arduino IDE/PlatformIO) → compile to machine code → flash/upload via USB/programmer → test with serial monitor, LEDs, instruments → debug and iterate; use version control and comments.' },
      ],
    },
  },

  c11_mc_4: {
    sections: [
      { h: 'A systematic debugging example', b: `**Symptom:** the robot's ultrasonic sensor always reads 0.
1. **Check power:** 5 V present at sensor VCC? Yes.
2. **Check wiring:** Trig on pin 12, Echo on pin 11 as in code? Found swapped → fix.
3. **Serial print raw values:** echo time now 0 occasionally → add pulseIn timeout handling.
4. **Oscilloscope:** echo pulse width matches distance → sensor OK.
5. **Log result** and commit the fix in Git.
Rule: check hardware → isolate → reproduce → fix one thing at a time → verify.` },
      { h: 'Pull-up and pull-down resistors', b: `A floating input reads random 0/1. A **pull-up** resistor (to 5 V) makes the pin read HIGH until a button connects it to ground; a **pull-down** does the opposite. Arduino has internal pull-ups: pinMode(2, INPUT_PULLUP).` },
    ],
    exam: {
      short: [
        { q: 'What is a floating input and how is it fixed?', a: 'An input pin not connected to a defined voltage, which reads random values; fixed with a pull-up or pull-down resistor.' },
        { q: 'Differentiate between an oscilloscope and a logic analyser.', a: 'An oscilloscope shows analog voltage waveforms over time; a logic analyser captures many digital lines and decodes protocols like I2C/SPI.' },
        { q: 'What is a brown-out?', a: 'A drop in supply voltage below the minimum, causing the MCU to reset or misbehave.' },
      ],
      long: [
        { q: 'Describe five debugging tools/techniques for embedded systems.', a: 'Serial print debugging — print variables to the PC; LED indicators — show states/errors; multimeter/oscilloscope — check voltages, PWM and timing; logic analyser — decode I2C/SPI/UART traffic; JTAG/SWD debugger — breakpoints, step execution, inspect variables and registers.' },
        { q: 'List common embedded bugs and how to prevent them.', a: 'Floating inputs — pull-up/down resistors; timing/interrupt conflicts — short ISRs, volatile variables, critical sections; buffer overflows — bounds checking; power noise and brown-outs — decoupling capacitors, separate motor supply; wrong pin assignments — wiring diagrams and checks; blocking code — non-blocking timers.' },
      ],
    },
  },

  c11_mc_5: {
    sections: [
      { h: 'Writing a test plan', b: `For a line-following robot:
• **Unit:** PID function returns the expected correction for given errors.
• **Integration:** sensor array + PID + motor driver respond correctly on a test bench.
• **System:** complete lap of the standard track in < 20 s, 10 times in a row.
• **Boundary:** sharp 90° turns, line gaps, low battery (6.4 V).
• **Stress:** run 30 minutes continuously; check motor temperature.
• **Field:** different lighting conditions in the competition hall.
Record expected vs actual results and pass/fail.` },
      { h: 'Black-box and white-box testing', b: `• **Black-box** — test inputs and outputs without looking at the code (does the robot stop at 20 cm?).
• **White-box** — test internal paths of the code (every branch of the if-else executed at least once).` },
    ],
    exam: {
      short: [
        { q: 'What is hardware-in-the-loop testing?', a: 'Testing the real controller and software while the rest of the system (motors, sensors, plant) is simulated in real time by a computer.' },
        { q: 'Differentiate between black-box and white-box testing.', a: 'Black-box tests behaviour from inputs/outputs without seeing code; white-box tests internal logic and code paths.' },
        { q: 'What is test-driven development?', a: 'Writing a failing test first, then writing just enough code to pass it, then refactoring — repeated for each feature.' },
      ],
      long: [
        { q: 'Explain the levels of testing for an embedded robot system.', a: 'Unit testing — each function/module alone; integration testing — modules working together; hardware-in-the-loop — real controller with simulated hardware; system testing — complete robot against requirements; field testing — real environment; plus stress/long-duration and boundary testing for reliability.' },
        { q: 'Prepare a test plan for an obstacle-avoiding robot.', a: 'Objectives and requirements (stop/turn at 20 cm); unit tests for distance function; integration tests for sensor-to-motor response time; boundary tests (object at 19/20/21 cm, very close, out of range, soft objects); environmental tests (lighting, surfaces); battery tests; endurance run; record expected vs actual results and fixes.' },
      ],
    },
  },

  c11_e_1: {
    figs: ['hBridge', 'pwm'],
    sections: [
      { h: 'DC and servo motors — working principle', b: `**DC motor:** a current-carrying coil (armature) in a magnetic field experiences a force (F = BIL) that produces torque; the **commutator and brushes** reverse the current every half turn so rotation continues. Speed ∝ voltage; torque ∝ current.
• Advantages: simple, cheap, easy speed control. Disadvantages: brush wear, sparks/noise, no position control.

**Servo motor:** DC motor + gear train + position sensor (potentiometer/encoder) + control circuit. A PWM signal (1–2 ms pulse every 20 ms) sets the target angle; the internal closed loop drives the motor until the measured angle matches.
• Advantages: precise position, holds angle, compact. Disadvantages: limited rotation (hobby servos), lower speed, can jitter.
• Applications: robot arm joints, grippers, RC steering, camera gimbals.` },
      { h: 'Motor selection numerical', b: `A 2 kg robot must accelerate at 0.5 m/s² up a 10° slope with 6 cm diameter wheels (2 drive motors).
Force = m(a + g sin10°) = 2(0.5 + 9.8 × 0.174) = 2(0.5 + 1.70) = 4.4 N
Torque per wheel = (4.4 × 0.03) ÷ 2 = **0.066 N·m**; add 50% margin → choose ≥ 0.1 N·m per motor (after gearbox).` },
    ],
    exam: {
      short: [
        { q: 'What is the function of the commutator in a DC motor?', a: 'It reverses the direction of current in the armature coil every half rotation so the torque stays in the same direction and the motor keeps turning.' },
        { q: 'How is the angle of a hobby servo controlled?', a: 'By the width of a PWM pulse (about 1 ms to 2 ms, repeated every 20 ms) corresponding to 0° to 180°.' },
        { q: 'State one advantage and one disadvantage of a brushed DC motor.', a: 'Advantage: simple and cheap with easy speed control. Disadvantage: brushes wear out and create electrical noise.' },
      ],
      long: [
        { q: 'Explain the working principle, advantages, disadvantages and applications of DC and servo motors.', a: 'DC: force on a current-carrying conductor in a magnetic field; commutator keeps rotation; advantages — cheap, simple speed control; disadvantages — brush wear, noise, no position feedback; applications — wheels, fans, pumps. Servo: DC motor + gears + potentiometer + controller in closed loop; PWM sets angle; advantages — precise, holds position; disadvantages — limited range, lower speed; applications — arm joints, grippers, steering.' },
        { q: 'A motor gives 0.3 N·m at 3000 rpm. With a 20:1 gearbox of 85% efficiency, find the output torque and speed.', a: 'Output torque = 0.3 × 20 × 0.85 = 5.1 N·m; output speed = 3000 ÷ 20 = 150 rpm.' },
      ],
    },
  },

  c11_e_2: {
    figs: ['ultrasonic'],
    sections: [
      { h: 'Working principles of the six syllabus sensors', b: `**IR (infrared) sensor:** an IR LED emits light; a photodiode/phototransistor measures reflection. More reflection → closer or lighter surface. ✔ cheap, fast, good for line following. ✘ affected by sunlight and surface colour; short range.

**Ultrasonic sensor:** emits 40 kHz sound and times the echo; d = v·t/2. ✔ cheap, works on most colours, 2–400 cm. ✘ soft/angled surfaces absorb or deflect sound; wide beam; slow update.

**LIDAR:** emits laser pulses and measures **time of flight** (or phase); a rotating LIDAR scans 360° giving thousands of distance points (point cloud). ✔ very accurate, long range, used for SLAM and self-driving cars. ✘ expensive, struggles with glass/black surfaces, heavy rain/fog.

**Touch sensor:** a mechanical switch (bumper) closes on contact, or a capacitive sensor detects change in capacitance from a finger. ✔ simple, reliable. ✘ only detects actual contact.

**Gyroscope (MEMS):** a vibrating micro-structure experiences a Coriolis force when rotated; this is measured to give **angular velocity** (°/s). ✔ fast rotation sensing for balance/drones. ✘ **drift** — integrating to get angle accumulates error.

**Accelerometer (MEMS):** a tiny proof mass on springs shifts under acceleration; capacitance change is measured to give **acceleration** in x, y, z (including gravity, so it measures tilt). ✔ measures tilt and vibration. ✘ noisy, disturbed by motion.
An **IMU** combines gyro + accelerometer (+ magnetometer); a complementary or Kalman filter fuses them.` },
      { h: 'Applications table', b: `• IR → line followers, edge detection, proximity.
• Ultrasonic → obstacle avoidance, liquid level, parking sensors.
• LIDAR → SLAM mapping, autonomous vehicles, warehouse AMRs.
• Touch → bumpers, user buttons, gripper contact.
• Gyroscope → drone stabilisation, self-balancing robots, heading.
• Accelerometer → tilt sensing, step counting, crash/vibration detection.` },
    ],
    exam: {
      short: [
        { q: 'State the working principle of LIDAR.', a: 'It emits laser light pulses and measures the time taken for the reflected light to return (time of flight) to calculate distance; scanning gives a 2-D/3-D map of points.' },
        { q: 'Why does a gyroscope-only angle estimate drift?', a: 'Angle is obtained by integrating angular velocity; small bias and noise accumulate over time, causing the angle to drift.' },
        { q: 'Give one advantage and one disadvantage of IR sensors.', a: 'Advantage: cheap and fast for short-range detection/line following. Disadvantage: affected by ambient sunlight and surface colour.' },
      ],
      long: [
        { q: 'Compare IR, ultrasonic and LIDAR sensors in terms of principle, range, accuracy, cost and limitations.', a: 'IR — reflected infrared intensity; few cm–80 cm; moderate; very cheap; affected by sunlight/colour. Ultrasonic — echo time of sound; 2–400 cm; ±3 mm–1 cm; cheap; soft/angled surfaces, wide beam. LIDAR — laser time of flight; up to tens of metres; mm–cm accuracy; expensive; glass/black surfaces, fog.' },
        { q: 'Explain the working of MEMS accelerometers and gyroscopes and why they are combined in an IMU.', a: 'Accelerometer: proof mass on springs moves under acceleration; capacitance change gives acceleration including gravity → tilt; noisy during motion. Gyroscope: vibrating structure; Coriolis force under rotation gives angular rate; smooth but drifts when integrated. Combining them with a complementary/Kalman filter uses the gyro for short-term accuracy and the accelerometer for long-term correction, giving stable orientation for drones and balancing robots.' },
      ],
    },
  },

  c11_e_3: {
    figs: ['batteryCompare'],
    sections: [
      { h: 'Lithium-ion vs lead-acid', b: `**Lithium-ion (Li-ion/LiPo):**
• Characteristics: 3.6–3.7 V per cell, high energy density (150–250 Wh/kg), low self-discharge, no memory effect, high discharge rates (LiPo).
• Applications: drones, mobile robots, phones, laptops, EVs.
• Drawbacks: costlier; needs a BMS; risk of fire/thermal runaway if overcharged, over-discharged, punctured or short-circuited; ageing reduces capacity.

**Lead-acid:**
• Characteristics: 2 V per cell (12 V = 6 cells), low energy density (30–40 Wh/kg), very heavy, cheap, robust, can supply high surge currents.
• Applications: UPS, car starter batteries, large stationary or slow AGVs, solar storage.
• Drawbacks: heavy, short cycle life if deeply discharged, contains lead and sulphuric acid (hazardous, must be recycled), can release hydrogen when overcharged.` },
      { h: 'Run-time calculation', b: `Run time (h) ≈ capacity (Ah) × usable fraction ÷ average current (A).
A 3S 2200 mAh LiPo powering a robot drawing 1.5 A, using 80% of capacity:
t = 2.2 × 0.8 ÷ 1.5 = **1.17 h ≈ 70 minutes**.
Energy = 11.1 V × 2.2 Ah = **24.4 Wh**.` },
    ],
    exam: {
      short: [
        { q: 'Give two advantages of lithium-ion batteries over lead-acid batteries.', a: 'Much higher energy density (lighter for the same energy) and longer cycle life (also lower self-discharge, no memory effect).' },
        { q: 'What is the nominal voltage of a 4S LiPo pack?', a: '4 × 3.7 V = 14.8 V.' },
        { q: 'Why is a BMS required for lithium batteries?', a: 'To prevent overcharge, over-discharge, overcurrent and overheating, and to balance cells — preventing damage and fire.' },
      ],
      long: [
        { q: 'Compare lithium-ion and lead-acid batteries in terms of characteristics, applications and drawbacks.', a: 'Li-ion: 3.7 V/cell, high energy density, light, long life, higher cost; used in drones, mobile robots, EVs; drawbacks — fire risk, needs BMS, costly. Lead-acid: 2 V/cell, low energy density, heavy, cheap, robust surge current; used in UPS, cars, large AGVs; drawbacks — weight, limited deep-cycle life, toxic lead/acid.' },
        { q: 'A robot uses a 12 V, 7 Ah lead-acid battery and draws 2 A. Estimate its run time using 50% depth of discharge. What would change with a Li-ion pack of equal energy?', a: 'Usable = 7 × 0.5 = 3.5 Ah; run time = 3.5 ÷ 2 = 1.75 h. A Li-ion pack of the same energy (84 Wh) would weigh about a quarter as much and allow ~80% usable depth of discharge, giving ~2.8 h, but needs a BMS and costs more.' },
      ],
    },
  },

  c11_e_4: {
    figs: ['commProtocols'],
    sections: [
      { h: 'Comparison table (speed, error detection, reliability)', b: `• **UART** — 2 wires (TX, RX), asynchronous (no clock), point-to-point, ~9.6–115.2 kbps typical (up to Mbps); error detection: optional **parity bit**; reliability: moderate, short distances.
• **I2C** — 2 wires (SDA, SCL), synchronous, multi-device with 7-bit addresses (up to ~112 devices), 100 kHz / 400 kHz / 1 MHz; error detection: **ACK/NACK** after each byte (no CRC); reliability: good on short PCB-level wires.
• **SPI** — 4 wires (MOSI, MISO, SCK, CS per device), synchronous, full-duplex, 1–50+ MHz; error detection: **none built in**; reliability: excellent for short distances, many wires for many devices.
• **CAN** — 2 wires (CAN-H, CAN-L) differential, multi-master, message priority by ID, up to 1 Mbps (CAN FD faster); error detection: **15-bit CRC, ACK, bit stuffing, frame checks**, automatic retransmission, faulty nodes switch off; reliability: very high, noise-immune, used in cars and industrial robots.` },
      { h: 'Choosing a protocol — examples', b: `• Arduino ↔ PC logging → UART (USB serial).
• Several sensors (IMU, OLED, pressure) on one robot → I2C.
• SD card, fast display, high-rate ADC → SPI.
• Motor controllers spread across a large robot or vehicle → CAN.` },
    ],
    exam: {
      short: [
        { q: 'Why is CAN preferred in automobiles and industrial robots?', a: 'It uses differential signalling (noise immune), supports many nodes on one bus with priority arbitration, and has strong error detection (CRC) and automatic retransmission.' },
        { q: 'Which protocol is full-duplex and fastest among UART, I2C and SPI?', a: 'SPI.' },
        { q: 'How are devices identified on an I2C bus?', a: 'By a unique 7-bit (or 10-bit) address sent by the master at the start of each transaction.' },
      ],
      long: [
        { q: 'Compare UART, I2C, SPI and CAN in terms of wires, speed, number of devices, error detection and reliability.', a: 'UART: 2 wires, ~115 kbps, 2 devices, parity optional, moderate. I2C: 2 wires, 100 kHz–1 MHz, many addressed devices, ACK only, good for short distances. SPI: 4+ wires, 10–50 MHz, multiple slaves via CS lines, no error checking, very fast. CAN: 2 differential wires, up to 1 Mbps, many nodes multi-master, CRC + ACK + retransmission, highly reliable and noise immune.' },
        { q: 'Suggest suitable protocols for a mobile robot with an IMU, OLED display, SD-card logger, a Raspberry Pi and four smart motor controllers. Justify.', a: 'IMU and OLED → I2C (two wires, multiple addressed devices). SD card → SPI (high data rate). Raspberry Pi ↔ microcontroller → UART/USB serial (simple command link). Four motor controllers distributed around the chassis → CAN (robust, noise immune near motors, multi-node).' },
      ],
    },
  },

  c11_e_5: {
    figs: ['powerBudget', 'ohmTriangle'],
    sections: [
      { h: 'Power requirements of each part', b: `• **Motors** — the biggest load; check **stall current** (can be 5–10× running current) when sizing drivers, fuses and batteries.
• **Servos** — 0.2–2 A each when moving or holding a load; brown-outs are common if powered from the Arduino 5 V pin.
• **Sensors** — usually 5–50 mA each (LIDAR modules can draw 0.5 A+).
• **Microcontrollers** — 20–100 mA (ESP32 peaks ~250 mA with Wi-Fi).
• **SBCs** — Raspberry Pi 4 needs a 5 V 3 A supply.` },
      { h: 'Worked power budget', b: `Raspberry Pi (5 V, 2.5 A peak) = 12.5 W
Arduino (5 V, 0.05 A) = 0.25 W
2 motors (12 V, 0.8 A each) = 19.2 W
4 sensors (5 V, 0.03 A each) = 0.6 W
Total ≈ 32.6 W → + 25% margin ≈ **41 W**.
From a 12 V battery: I = 41 ÷ 12 ≈ **3.4 A**. A 12 V 5 Ah battery gives roughly 5 × 0.8 ÷ 3.4 ≈ **1.2 h**.
Use a buck converter (12 V → 5 V, ≥ 4 A) for the Pi and logic.` },
    ],
    exam: {
      short: [
        { q: 'Why is a buck converter preferred to a linear regulator for stepping 12 V to 5 V at 3 A?', a: 'A buck converter is efficient (~90%); a linear regulator would waste (12 − 5) × 3 = 21 W as heat.' },
        { q: 'What is stall current?', a: 'The current a motor draws when its shaft is prevented from turning — the maximum current, much higher than normal running current.' },
        { q: 'Why add a safety margin to a power budget?', a: 'To cover peak/stall currents, battery ageing, voltage drops and future additions without brown-outs.' },
      ],
      long: [
        { q: 'Prepare a power budget for a robot with an ESP32 (3.3 V, 0.25 A), two 6 V motors (0.5 A each), a servo (5 V, 1 A) and an ultrasonic sensor (5 V, 15 mA), powered from a 7.4 V battery. Suggest regulators.', a: 'Power: ESP32 0.83 W; motors 6 W; servo 5 W; sensor 0.075 W; total ≈ 11.9 W; +25% ≈ 14.9 W. Current from 7.4 V ≈ 2 A. Use a 5 V buck converter (≥2 A) for servo and sensor, a 3.3 V regulator for ESP32 (or its onboard regulator from 5 V), motors via driver directly from battery; common ground; fuse ~3 A.' },
        { q: 'Explain how motors, sensors, actuators and microcontrollers determine the power design of a robot.', a: 'Each component has a voltage and current requirement; motors dominate current and produce noise/surges, so need separate supply/driver and decoupling; sensors and MCUs need clean regulated low voltages; servos need high peak current. The designer lists all loads, totals power with margin, selects battery capacity and C-rating, regulators (buck/boost/LDO), wire gauge, fuses, and separates motor and logic power with common ground.' },
      ],
    },
  },

  c11_e_6: {
    figs: ['pidLoop', 'openClosedLoop'],
    sections: [
      { h: 'Basics of control systems', b: `• **System/plant** — what we control (motor speed, robot heading, temperature).
• **Input/set point**, **output/controlled variable**, **error**, **controller**, **actuator**, **sensor/feedback**.
• **Open loop** — no feedback; simple, cheap; cannot correct disturbances.
• **Closed loop** — feedback corrects errors; accurate; can become unstable if badly tuned.
• **Performance terms**: rise time, overshoot, settling time, steady-state error.` },
      { h: 'Discrete PID code for a line follower', b: `~~~
float Kp = 0.8, Ki = 0.0, Kd = 4.0;
float integral = 0, lastError = 0;

void loop() {
  int error = readLinePosition() - 0;     // 0 = centred
  integral += error;
  float derivative = error - lastError;
  float correction = Kp * error + Ki * integral + Kd * derivative;
  lastError = error;
  setMotors(150 - correction, 150 + correction);
}
~~~
Tuning recipe: start with Kp only until it oscillates, reduce slightly; add Kd to damp; add a small Ki only if a steady offset remains.` },
    ],
    exam: {
      short: [
        { q: 'Define steady-state error.', a: 'The difference between the desired and actual output that remains after the system has settled.' },
        { q: 'What happens if Kp is too large?', a: 'The system responds aggressively and overshoots/oscillates, possibly becoming unstable.' },
        { q: 'Which PID term reduces overshoot?', a: 'The derivative (D) term.' },
      ],
      long: [
        { q: 'Explain the P, I and D terms of a PID controller with their effect on a robot\'s response.', a: 'P — output proportional to current error; faster response but may leave steady-state error and cause overshoot if large. I — integrates past error; removes steady-state error but can cause overshoot/windup. D — proportional to rate of change of error; predicts and damps overshoot, improves stability but amplifies noise. Combined: u = Kp·e + Ki∫e dt + Kd·de/dt.' },
        { q: 'Draw the block diagram of a closed-loop speed control system for a DC motor and explain it.', a: 'Set speed → Σ (minus measured speed) → error → PID controller → PWM driver (H-bridge) → DC motor → shaft speed → encoder → feedback to Σ. The controller increases PWM when the motor is too slow and decreases it when too fast, keeping speed constant despite load changes.' },
      ],
    },
  },

  c11_app_1: {
    figs: ['robotArmAnatomy', 'workspace'],
    sections: [
      { h: 'Mathematical concepts for manipulators', b: `• **Forward kinematics** — joint angles → tool pose (matrix multiplication of transforms).
• **Inverse kinematics** — desired pose → joint angles (analytical or numerical).
• **Jacobian** — joint velocities → tool velocity (v = J·q̇); used for smooth Cartesian motion and to detect singularities (det J = 0).
• **Trajectory planning** — smooth position/velocity profiles between points (trapezoidal velocity, cubic polynomials) to avoid jerks.
• **Statics/dynamics** — joint torques for payloads and accelerations.` },
      { h: 'Control strategies for industrial automation', b: `• **Point-to-point (PTP)** control — move between taught points; path between them not important (spot welding, pick-and-place).
• **Continuous-path (CP)** control — follow a defined path accurately (arc welding, painting, gluing).
• **Joint-space PID control** — each joint servo has its own PID loop (most common).
• **Computed-torque / feed-forward** — uses the dynamic model plus feedback for fast accurate motion.
• **Force/impedance control** — controls contact force (polishing, assembly, cobots).
• **Vision-guided (visual servoing)** — camera feedback corrects position for randomly placed parts.` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between point-to-point and continuous-path control.', a: 'PTP moves between specified points without controlling the path in between (spot welding); CP controls the entire path accurately (arc welding, painting).' },
        { q: 'What is the Jacobian of a manipulator?', a: 'A matrix relating joint velocities to the end-effector\'s linear and angular velocity; when it loses rank the robot is at a singularity.' },
        { q: 'Name the manipulator configuration best suited to high-speed light pick-and-place.', a: 'Delta (parallel) robot.' },
      ],
      long: [
        { q: 'Explain the mathematical concepts and control strategies used for manipulators in industrial automation.', a: 'Maths: forward kinematics (transforms), inverse kinematics, Jacobian for velocities and singularities, trajectory planning, dynamics for torques. Control: PTP for pick-and-place/spot welding, CP for arc welding/painting, independent joint PID, computed-torque/feed-forward for speed and accuracy, force/impedance control for contact tasks, visual servoing for flexible part handling.' },
        { q: 'Compare Cartesian, SCARA, articulated and Delta manipulators with applications.', a: 'Cartesian (PPP) — simple, accurate, large linear workspace; 3D printers, CNC, gantry loading. SCARA (RRPR) — fast, rigid vertically; electronics assembly. Articulated (6R) — most flexible, any orientation; welding, painting, assembly. Delta (parallel) — very fast, light payload; food and pharmaceutical packing.' },
      ],
    },
  },

  c11_app_2: {
    figs: ['fourWheelRobot', 'wheelTypes'],
    sections: [
      { h: 'Design principles', b: `• **Locomotion choice** by terrain: wheels (flat floors, efficient), tracks (rough ground), legs (stairs, rubble).
• **Stability**: low centre of gravity, support polygon; static stability for wheeled robots, dynamic balance for legged/self-balancing.
• **Manoeuvrability**: differential drive (simple), Ackermann (car-like, high speed), omni/mecanum (holonomic, tight spaces).
• **Energy**: battery capacity vs weight; efficient motors; sleep modes.
• **Payload and size**: must fit aisles/doors and carry required load.
• **Safety**: bumpers, e-stop, speed limits near people.` },
      { h: 'Sensor integration for logistics and search & rescue', b: `**Logistics (warehouse AMR):** 2-D LIDAR for SLAM and obstacle detection, 3-D/depth cameras for pallets and people, wheel encoders + IMU for odometry, QR/fiducial markers on the floor for precise docking, bumpers and safety-rated scanners, Wi-Fi to fleet manager.

**Search and rescue:** tracked or legged base for rubble; thermal camera to detect body heat; gas sensors (CO, methane); microphones and speakers for two-way voice; LIDAR/depth camera for mapping collapsed spaces; IMU for tilt; radio mesh or tether for communication where Wi-Fi fails; ruggedised, waterproof enclosure.

**Sensor fusion** combines odometry, IMU, LIDAR and camera data (e.g. with a Kalman/particle filter) to estimate position reliably.` },
    ],
    exam: {
      short: [
        { q: 'What is differential drive?', a: 'A mobile robot drive with two independently powered wheels on a common axis; turning is achieved by different wheel speeds.' },
        { q: 'Why are tracked robots used in search and rescue?', a: 'Tracks spread weight and grip uneven, loose surfaces like rubble, giving better traction and obstacle-climbing than wheels.' },
        { q: 'What is SLAM?', a: 'Simultaneous Localisation and Mapping — building a map of an unknown environment while tracking the robot\'s location in it.' },
      ],
      long: [
        { q: 'Discuss the design principles of mobile robots for warehouse logistics.', a: 'Wheeled differential/omni base for flat floors; compact footprint for aisles; payload-rated chassis and lifting mechanism; LIDAR-based SLAM and path planning; obstacle detection with safety scanners; docking via fiducials; battery sized for a shift with autonomous charging; fleet communication over Wi-Fi; safety features (e-stop, speed limits, warning lights).' },
        { q: 'Describe the sensors you would integrate into a search-and-rescue robot and justify each.', a: 'Thermal camera — find survivors by body heat; RGB/depth camera and LIDAR — map voids and avoid hazards; gas sensors — detect dangerous gases; microphone/speaker — talk to victims; IMU — detect tilt/rollover; encoders — odometry; GPS (outdoors) — location; robust radio/tether — communication in collapsed structures.' },
      ],
    },
  },

  c11_app_3: {
    figs: ['quadcopter'],
    sections: [
      { h: 'Sensor payloads', b: `• **RGB cameras** — photography, videography, inspection, photogrammetry for 3-D maps.
• **Multispectral/NDVI cameras** — crop health in agriculture.
• **Thermal cameras** — finding people at night, solar-panel faults, firefighting.
• **LIDAR** — terrain mapping, forestry, surveying.
• **Gas and air-quality sensors** — pollution and leak detection.
• **Spray tanks and pumps** — precision spraying of fertiliser/pesticide.
• **Delivery mechanisms** — winches and release hooks for medicines and relief supplies.
Payload weight reduces flight time; the frame, motors and battery must be sized for it.` },
      { h: 'Drone regulations in India', b: `Drones in India are governed by the **Drone Rules, 2021** under the **Directorate General of Civil Aviation (DGCA)**:
• Drones are registered on the **Digital Sky** platform and get a Unique Identification Number (UIN).
• Airspace map with **green** (no permission needed up to 400 ft), **yellow** (permission from air traffic control) and **red** (no-fly) zones — near airports, borders and strategic sites.
• Weight categories: nano (≤ 250 g), micro (250 g–2 kg), small (2–25 kg), medium (25–150 kg), large (> 150 kg).
• A **remote pilot certificate** from a DGCA-authorised training school is needed for most drones; nano drones, and micro drones flown for non-commercial purposes, are exempt.
• Basic rules: keep line of sight, respect privacy, don't fly over crowds, follow height limits.
Always check the latest rules on the DGCA / Digital Sky website before flying.` },
      { h: 'Uses in photography, agriculture and disaster response', b: `• **Photography:** aerial films, weddings, real-estate, journalism; gimbals keep the camera steady.
• **Agriculture:** crop health mapping, spraying (e.g. Kisan drones), counting plants, irrigation planning.
• **Disaster response:** rapid damage mapping after floods/earthquakes, thermal search for survivors, dropping medicines and life jackets, temporary communication relays.` },
    ],
    exam: {
      short: [
        { q: 'How does a quadcopter yaw (turn about its vertical axis)?', a: 'By speeding up the pair of rotors spinning in one direction and slowing the pair spinning in the other, creating a net reaction torque that rotates the body.' },
        { q: 'What is the Digital Sky platform?', a: 'India\'s online platform (DGCA) for registering drones, obtaining a UIN and flight permissions according to the airspace zones.' },
        { q: 'Name two sensor payloads used in agricultural drones.', a: 'Multispectral/NDVI cameras and spray systems (also RGB cameras, thermal cameras).' },
      ],
      long: [
        { q: 'Explain the flight dynamics of a quadcopter — throttle, roll, pitch and yaw.', a: 'Throttle — all four motors speed up/down equally to climb/descend. Roll — increase speed of motors on one side and decrease on the other to tilt sideways and move left/right. Pitch — change front vs rear motor speeds to tilt forward/backward. Yaw — change speed of the clockwise pair relative to the anticlockwise pair; unbalanced reaction torque turns the drone. The flight controller uses IMU data and PID loops to stabilise.' },
        { q: 'Describe the applications of drones in photography, agriculture and disaster response, and the regulations that govern them in India.', a: 'Photography — aerial filming with stabilised gimbals, mapping. Agriculture — NDVI crop-health mapping, precision spraying, monitoring. Disaster response — damage mapping, thermal search, delivering medicines, communication relays. Regulations: Drone Rules 2021 (DGCA), registration on Digital Sky with UIN, green/yellow/red zones, weight categories, remote pilot certificate, line-of-sight and privacy rules.' },
      ],
    },
  },
};
