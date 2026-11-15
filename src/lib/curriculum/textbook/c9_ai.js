// Class 9 · AI and Computing — textbook notes, diagrams and exam questions.
export default {
  c9_a_1: {
    figs: ['aiVenn', 'turingTest'],
    sections: [
      { h: 'Meaning of Artificial Intelligence', b: `**Artificial Intelligence (AI)** is the ability of a machine to perform tasks that normally need human intelligence — such as understanding language, recognising images, solving problems, learning from experience and making decisions.

John McCarthy, who coined the term in 1956, called it "the science and engineering of making intelligent machines".

A machine is said to show intelligence when it can:
• **Learn** from data or experience,
• **Reason** to reach conclusions,
• **Perceive** the world through sensors (see, hear),
• **Understand and use language**,
• **Solve problems** and make decisions.` },
      { h: 'The Turing Test in detail', b: `In his 1950 paper "Computing Machinery and Intelligence", **Alan Turing** proposed the **Imitation Game**, now called the **Turing Test**:
1. A human judge (interrogator) chats by typing with two hidden players: one human and one machine.
2. The judge asks any questions for a fixed time.
3. If the judge cannot reliably tell which player is the machine, the machine is said to have passed — it shows human-like intelligent behaviour.

**Strengths:** simple, practical, tests behaviour rather than definitions.
**Limitations:** it tests only conversation (not vision or movement); a machine can pass by tricking the judge without real understanding; modern chatbots can sound human but still make basic mistakes.` },
      { h: 'Narrow vs broad (general) AI; weak vs strong AI', b: `• **Narrow AI** — designed for one task or a small set of tasks: face unlock, chess engine, spam filter, voice assistant. All AI that exists today is narrow AI.
• **Broad / General AI (AGI)** — would match human ability across almost any intellectual task and transfer knowledge between them. It does not exist yet.
• **Weak AI** — simulates intelligence without real understanding or consciousness (the machine "acts" intelligent).
• **Strong AI** — would truly understand and have a mind, like a human. It is a theoretical idea.
In school-level usage, narrow ≈ weak and general ≈ strong.` },
      { h: 'Key milestones in brief', b: `1950 Turing Test → 1956 Dartmouth Conference (term "AI") → 1966 ELIZA chatbot → 1997 Deep Blue beats Kasparov → 2011 IBM Watson wins Jeopardy! → 2016 AlphaGo beats Lee Sedol → 2022 ChatGPT and generative AI become popular.` },
    ],
    exam: {
      short: [
        { q: 'Define Artificial Intelligence.', a: 'AI is the ability of a computer or machine to perform tasks that normally require human intelligence, such as learning, reasoning, problem solving, perception and understanding language.' },
        { q: 'Who coined the term "Artificial Intelligence" and when?', a: 'John McCarthy, at the Dartmouth Conference in 1956.' },
        { q: 'Differentiate between narrow AI and general AI.', a: 'Narrow AI performs one specific task (e.g. face recognition) and exists today; general AI would perform any intellectual task a human can and does not yet exist.' },
      ],
      long: [
        { q: 'Explain the Turing Test with a labelled diagram. State one limitation.', a: 'Proposed by Alan Turing in 1950. A judge communicates by text with a hidden human and a hidden machine. If the judge cannot reliably identify the machine, it is said to show human-like intelligence. Diagram: judge on one side of a wall; human (B) and machine (A) on the other, connected by text links. Limitation: it only tests conversation and can be passed by imitation without real understanding.' },
        { q: 'Differentiate between weak AI and strong AI with examples.', a: 'Weak AI simulates intelligent behaviour for specific tasks without understanding — e.g. Siri, Google Maps routing, spam filters. Strong AI would genuinely understand, reason and be self-aware like a human across all tasks — a theoretical goal; no real example exists yet.' },
      ],
    },
  },

  c9_a_2: {
    sections: [
      { h: 'Why progress came in waves', b: `• **Overpromising:** early researchers predicted human-level AI within 20 years.
• **Limited computers:** 1960s–70s machines had tiny memory and speed.
• **Too little data:** the internet, smartphones and digital cameras did not exist.
• **Brittle rules:** expert systems broke when faced with situations their rules did not cover.
When results disappointed, funding was cut → **AI winters** (mid-1970s and late 1980s).` },
      { h: 'Why AI took off after 2010', b: `Three things came together:
1. **Big data** — billions of labelled photos, texts and videos online.
2. **Powerful hardware** — GPUs designed for games turned out to be perfect for training neural networks.
3. **Better algorithms** — deep learning (many-layered neural networks), and in 2017 the **transformer** design that powers today's chatbots.
Cloud computing also made this power available to everyone.` },
      { h: 'From rules to learning', b: `• **Symbolic AI (1950s–80s):** humans wrote explicit rules — "IF fever AND rash THEN measles".
• **Machine learning (1990s–):** computers learn rules from examples.
• **Deep learning (2010s–):** large neural networks learn features directly from raw images, audio and text.
• **Generative AI (2020s–):** models that create new text, images, music and code.` },
    ],
    exam: {
      short: [
        { q: 'What is an AI winter?', a: 'A period when interest and funding for AI research dropped sharply because results did not meet expectations (mid-1970s and late 1980s).' },
        { q: 'What was Deep Blue known for?', a: 'IBM\'s chess computer that defeated world champion Garry Kasparov in 1997.' },
        { q: 'Name three reasons for the recent boom in AI.', a: 'Big data, powerful GPUs/cloud computing, and better algorithms such as deep learning and transformers.' },
      ],
      long: [
        { q: 'Describe the evolution of AI from 1950 to today with important milestones.', a: '1950 — Turing proposes the Turing Test; 1956 — Dartmouth Conference names AI; 1966 — ELIZA chatbot; 1970s — first AI winter; 1980s — expert systems boom then second winter; 1997 — Deep Blue beats Kasparov; 2011 — Watson wins Jeopardy!; 2012 — deep learning breakthrough in image recognition; 2016 — AlphaGo beats Lee Sedol; 2022 — ChatGPT popularises generative AI.' },
        { q: 'Compare symbolic (rule-based) AI with machine learning.', a: 'Symbolic AI uses rules written by human experts; it is transparent but brittle and cannot learn. Machine learning finds patterns from data automatically; it adapts and handles complex tasks like vision, but needs lots of data and is harder to explain.' },
      ],
    },
  },

  c9_a_3: {
    figs: ['aiDomains'],
    sections: [
      { h: 'AI in everyday life', b: `• **Smartphones:** face unlock, camera scene detection, autocorrect and predictive text, voice assistants.
• **Maps and travel:** Google Maps predicts traffic and suggests the fastest route; ride apps estimate arrival time and price.
• **Shopping and entertainment:** recommendations on YouTube, Netflix, Spotify, Amazon.
• **Banking:** fraud alerts when an unusual transaction happens; chatbots answer queries.
• **Email:** spam filtering and smart replies.
• **Social media:** feed ranking, photo tagging, content moderation.` },
      { h: 'AI in India', b: `• **Agriculture:** apps that identify crop disease from a phone photo; weather and price advice to farmers.
• **Healthcare:** AI screening for diabetic retinopathy and tuberculosis from X-rays.
• **Language:** Bhashini — government platform for translation between Indian languages.
• **Governance:** DigiLocker, traffic cameras and smart-city projects.` },
      { h: 'Matching AI domain to application', b: `• **Computer Vision** (images/video) → face unlock, number-plate reading, crop disease detection, self-driving cars.
• **Natural Language Processing** (text/speech) → chatbots, Google Translate, voice assistants, grammar checkers.
• **Data/Statistical AI** (numbers/tables) → price prediction, recommendations, fraud detection, weather forecasting.` },
    ],
    exam: {
      short: [
        { q: 'Give two applications of AI in healthcare.', a: 'Analysing X-rays/scans to detect disease; predicting patient risk; drug discovery; robotic surgery assistance (any two).' },
        { q: 'How does Google Maps use AI?', a: 'It analyses live location data from many phones and past traffic patterns to predict congestion and suggest the fastest route and arrival time.' },
        { q: 'Name the AI domain used in face unlock.', a: 'Computer Vision.' },
      ],
      long: [
        { q: 'Explain the use of AI in any five sectors with one example each.', a: 'Healthcare — X-ray analysis for TB; Agriculture — crop-disease detection app; Transport — self-driving cars/traffic prediction; Finance — fraud detection; Education — adaptive learning apps; Entertainment — recommendations on Netflix/YouTube.' },
        { q: 'List five ways in which you use AI in your daily life and identify the AI domain for each.', a: 'Face unlock (CV); voice assistant (NLP); YouTube recommendations (Data); autocorrect/predictive text (NLP); Google Maps traffic prediction (Data); photo filters that detect faces (CV).' },
      ],
    },
  },

  c9_a_4: {
    sections: [
      { h: 'Benefits with Indian examples', b: `• **Speed at scale:** UPI fraud-detection systems check millions of payments in real time.
• **Better decisions:** AI weather models help farmers decide when to sow.
• **Accessibility:** screen readers, live captions and sign-language apps help people with disabilities; translation between Indian languages breaks language barriers.
• **Safety:** AI cameras detect helmetless riders; predictive maintenance warns before a train part fails.
• **Personal learning:** apps adapt question difficulty to each student.
• **Healthcare reach:** AI screening lets one doctor review many more scans, helping rural areas.` },
      { h: 'Benefits always come with responsibilities', b: `Every benefit has a matching risk that must be managed: efficiency may reduce some jobs; personalisation needs personal data (privacy); automated decisions may be biased. That is why the next lesson discusses **AI ethics**.` },
    ],
    exam: {
      short: [
        { q: 'State two benefits of AI.', a: 'Works 24×7 without tiring; processes huge data quickly and accurately (also: personalisation, accessibility, safety).' },
        { q: 'How does AI help people with disabilities?', a: 'Through speech-to-text, text-to-speech, live captions, image description for the visually impaired and voice control of devices.' },
        { q: 'What is predictive maintenance?', a: 'Using AI on sensor data to predict when a machine is likely to fail so it can be repaired before it breaks down.' },
      ],
      long: [
        { q: 'Discuss any five benefits of AI with suitable examples.', a: 'Efficiency — chatbots handle routine queries; Accuracy — AI spots tiny defects in products; Availability — 24×7 fraud monitoring; Speed — analysing millions of transactions in seconds; Personalisation — adaptive learning apps; Accessibility — live captions and translation; Safety — predictive maintenance in railways.' },
        { q: '"AI is a tool that helps humans rather than replaces them." Justify with examples.', a: 'AI handles repetitive or data-heavy work, freeing people for creative and caring tasks: a radiologist uses AI to flag suspicious scans but makes the final diagnosis; a teacher uses AI analytics to find weak topics but teaches the class; farmers use AI advice but decide what to plant. New jobs such as AI trainers and data analysts also appear.' },
      ],
    },
  },

  c9_a_5: {
    sections: [
      { h: 'The six ethical principles in your syllabus', b: `• **Bias** — unfair preference built into an AI system, usually because the training data is unbalanced. A face recognition system trained mostly on one skin tone works worse for others.
• **Fairness** — the AI should treat all groups equally and not discriminate by gender, caste, religion, region or skin colour.
• **Accountability** — a human or organisation must be responsible for the AI's decisions and their consequences.
• **Transparency** — people should know when AI is being used, what data it uses and how it is used.
• **Interpretability** — humans can understand how the model works internally (e.g. a simple decision tree is interpretable).
• **Explainability** — the AI can give a reason for a particular decision ("your loan was refused because your income is below X").` },
      { h: 'Case studies', b: `1. **Hiring tool:** an AI trained on past hiring data learned to prefer male candidates because most past hires were men → **bias** and **fairness** problem. Fix: balanced data, regular audits.
2. **Self-driving car accident:** who is responsible — owner, maker or programmer? → **accountability**.
3. **Loan refusal with no reason given** → lack of **explainability** and **transparency**.
4. **Deepfake video of a public figure** → misinformation, consent and trust.` },
      { h: 'How to build responsible AI', b: `• Collect diverse, representative data.
• Test the model for bias on different groups.
• Keep a human in the loop for important decisions.
• Explain decisions in simple language.
• Protect privacy: collect only necessary data, store it safely, get consent.
• Follow laws such as India's **Digital Personal Data Protection Act, 2023**.` },
    ],
    exam: {
      short: [
        { q: 'What is AI bias?', a: 'Unfair or prejudiced results from an AI system, usually caused by unbalanced or biased training data or design.' },
        { q: 'Differentiate between transparency and explainability.', a: 'Transparency means being open about when and how AI and data are used; explainability means the AI can give understandable reasons for a specific decision.' },
        { q: 'What is meant by accountability in AI?', a: 'Clearly identifying who (person or organisation) is responsible for an AI system\'s decisions and any harm they cause.' },
      ],
      long: [
        { q: 'Explain bias, fairness, accountability, transparency and explainability in AI with one example each.', a: 'Bias — a face-recognition app that fails on darker skin. Fairness — a loan AI that gives equal treatment regardless of gender. Accountability — a car maker held responsible for a self-driving crash. Transparency — an app telling users their data trains its AI. Explainability — a credit AI stating "refused because income below limit".' },
        { q: 'Suggest five steps to make AI systems ethical and responsible.', a: '1) Use diverse, balanced training data; 2) test and audit for bias regularly; 3) keep humans in control of important decisions; 4) make systems explainable and transparent; 5) protect privacy and obtain consent; 6) follow laws and set clear accountability.' },
      ],
    },
  },

  c9_a_6: {
    figs: ['dataToInfo'],
    sections: [
      { h: 'Types of data by form (syllabus)', b: `• **Numeric data** — numbers: marks, temperatures, sensor readings, prices.
• **Text data** — words and sentences: messages, reviews, documents.
• **Audio data** — sound: speech, music, machine noise recorded by microphones.
• **Visual data** — images and videos from cameras and scanners.
AI chooses a technique based on data type: numbers → statistics/ML; text → NLP; images → computer vision; audio → speech recognition.` },
      { h: 'Converting data into information', b: `**Data** = raw facts with no context. **Information** = processed data that is meaningful and useful for decisions. **Knowledge** = understanding gained from information.

Example — a smart greenhouse:
• Data: 31, 33, 35, 36 (°C, every hour)
• Processing: sort by time, calculate the trend and average, compare with the safe limit 32 °C
• Information: "Temperature is rising and has crossed the safe limit"
• Decision: switch on the fans and open the vents.` },
      { h: 'Qualities of good data', b: `• **Accurate** — free of errors.
• **Complete** — no missing values.
• **Consistent** — same format everywhere (all dates as DD-MM-YYYY).
• **Relevant** — related to the problem.
• **Timely** — up to date.
• **Representative** — covers all groups and situations fairly (prevents bias).` },
    ],
    exam: {
      short: [
        { q: 'Differentiate between data and information.', a: 'Data is raw, unprocessed facts (e.g. 98, 102, 99); information is processed data with meaning (e.g. "the patient\'s fever is falling").' },
        { q: 'Name the four types of data in the syllabus with an example each.', a: 'Numeric — marks; Text — a review; Audio — a voice note; Visual — a photo/video.' },
        { q: 'What is meant by "garbage in, garbage out"?', a: 'If the input data is poor or wrong, the output of the AI/computer will also be poor or wrong.' },
      ],
      long: [
        { q: 'Explain with an example how raw data is converted into information.', a: 'Raw data such as hourly temperatures (31, 33, 35, 36 °C) is collected, organised by time, processed (average, trend, comparison with 32 °C limit) and presented, giving information: "temperature is rising above the safe limit". This information supports the decision to switch on cooling.' },
        { q: 'Why is data called the fuel of AI? Explain the qualities of good data.', a: 'AI systems learn patterns from data; without data they cannot learn, and bad data gives bad results. Good data is accurate, complete, consistent, relevant, timely and representative of all cases, which leads to reliable and fair models.' },
      ],
    },
  },

  c9_a_7: {
    figs: ['mlTypes'],
    sections: [
      { h: 'Expert systems', b: `An **expert system** is an AI program that copies the decision-making of a human expert in a narrow field using a set of IF–THEN rules.
Parts:
• **Knowledge base** — facts and rules collected from experts.
• **Inference engine** — applies the rules to the user's facts to reach a conclusion.
• **User interface** — asks questions and shows the answer and explanation.
Examples: **MYCIN** (1970s, identified bacterial infections), **DENDRAL** (chemistry), crop-advice systems for farmers.
Advantage: explains its reasoning; consistent. Limitation: cannot learn by itself and fails outside its rules.` },
      { h: 'The three domains: CV, NLP and neural networks (overview)', b: `Your syllabus lists three domains you will study in their own chapters:
• **Computer Vision** — teaching machines to see and understand images.
• **Natural Language Processing** — teaching machines to understand and produce human language.
• **Neural Networks** — brain-inspired models made of layers of artificial neurons; the engine behind deep learning in CV and NLP.` },
      { h: 'Machine learning in one example', b: `Predicting whether a mango is ripe:
• **Supervised:** show 1,000 photos labelled "ripe" or "unripe"; the model learns which colours and textures mean ripe.
• **Unsupervised:** give unlabelled photos; the model groups similar mangoes into clusters which a human then names.
• **Reinforcement:** a robot picker gets +1 for picking a ripe mango and −1 for an unripe one, and slowly learns the best picking strategy.` },
    ],
    exam: {
      short: [
        { q: 'What is an expert system? Give one example.', a: 'An AI program that uses a knowledge base of IF–THEN rules from human experts and an inference engine to solve problems in a narrow field, e.g. MYCIN for diagnosing infections.' },
        { q: 'Differentiate between supervised and unsupervised learning.', a: 'Supervised learning trains on labelled data to predict labels; unsupervised learning finds groups or patterns in unlabelled data.' },
        { q: 'Name the three main parts of an expert system.', a: 'Knowledge base, inference engine and user interface.' },
      ],
      long: [
        { q: 'Explain the three types of machine learning with a real-life example of each.', a: 'Supervised — learns from labelled examples, e.g. spam filter trained on emails marked spam/not spam. Unsupervised — finds hidden groups in unlabelled data, e.g. grouping customers by buying habits. Reinforcement — learns by trial and error using rewards, e.g. an AI learning to play a game or a robot learning to walk.' },
        { q: 'Describe the structure of an expert system with a diagram. State its advantages and limitations.', a: 'Structure: User ↔ User interface ↔ Inference engine ↔ Knowledge base (facts + rules). Advantages: consistent, available any time, can explain its reasoning, preserves expert knowledge. Limitations: cannot learn on its own, limited to narrow domain, costly to build and update, no common sense.' },
      ],
    },
  },

  c9_a_8: {
    figs: ['aiProjectCycle', 'fourWs'],
    sections: [
      { h: 'The five stages in your syllabus', b: `The syllabus counts **five stages** of the AI Project Cycle: Problem Scoping → Data Acquisition → Data Exploration → Modelling → Evaluation. Many books add **Deployment** as a sixth step after evaluation — it is good to know both.` },
      { h: 'Problem scoping with the 4Ws canvas', b: `• **Who** — who are the stakeholders affected by the problem?
• **What** — what exactly is the problem, and what evidence shows it exists?
• **Where** — in what situation or location does it occur?
• **Why** — why is it worth solving, and how will the solution help?
These lead to a **problem statement**: "Our [stakeholders] have a problem of [issue] when/while [context]. An ideal solution would [benefit]."` },
      { h: 'Worked example: reducing food waste in the school canteen', b: `1. **Problem scoping:** Who — students, canteen staff. What — 20% of cooked food is thrown away daily. Where — school canteen at lunch. Why — saves money and food.
2. **Data acquisition:** daily menu, number of students present, weather, food cooked and food wasted for 3 months (from canteen records and surveys).
3. **Data exploration:** bar graph of waste per dish; line graph of attendance vs waste — finds that waste rises on rainy days and on exam days.
4. **Modelling:** train a model to predict how many plates of each dish will be eaten tomorrow.
5. **Evaluation:** test on two new weeks of data; compare predicted vs actual (accuracy). If good, **deploy** as a simple app for the canteen manager.` },
    ],
    exam: {
      short: [
        { q: 'Name the stages of the AI Project Cycle.', a: 'Problem scoping, data acquisition, data exploration, modelling and evaluation (followed by deployment).' },
        { q: 'What are the 4Ws of problem scoping?', a: 'Who (stakeholders), What (the problem and evidence), Where (context/situation), Why (benefit of solving it).' },
        { q: 'What is the purpose of the evaluation stage?', a: 'To test the trained model on new, unseen data to check how accurate and reliable it is before it is used.' },
      ],
      long: [
        { q: 'Explain the stages of the AI Project Cycle with a labelled diagram.', a: 'Diagram: a circle of five stages. 1) Problem scoping — understand and define the problem using the 4Ws; 2) Data acquisition — collect relevant, reliable data from sources such as surveys, sensors, websites; 3) Data exploration — clean and visualise data to find patterns; 4) Modelling — choose an approach (rule-based or learning-based) and train the model; 5) Evaluation — test with unseen data using measures like accuracy. Then deploy and improve in cycles.' },
        { q: 'Apply the AI Project Cycle to the problem of traffic congestion near your school.', a: 'Scoping: who — students, parents, residents; what — 30-minute jams at 7:30 am; where — school gate road; why — safety and punctuality. Acquisition: traffic camera counts, arrival times, weather. Exploration: line graph of vehicles per minute vs time — peak 7:20–7:40. Modelling: predict jam level and suggest staggered arrival slots. Evaluation: compare predicted and actual jam over two weeks; deploy as a timing advisory app.' },
      ],
    },
  },

  c9_c_1: {
    figs: ['computingGenerations'],
    sections: [
      { h: 'Before electronic computers', b: `• **Abacus** (c. 2500 BC) — beads for counting.
• **Napier's bones** (1617) and the **slide rule** — helped multiplication.
• **Pascaline** (1642) — Blaise Pascal's mechanical adding machine.
• **Charles Babbage** designed the **Difference Engine** and the **Analytical Engine** (1830s) — the Analytical Engine had a "mill" (processor) and "store" (memory), so Babbage is called the **father of the computer**.
• **Ada Lovelace** wrote an algorithm for it and is regarded as the **first computer programmer**.` },
      { h: 'Comparing the generations', b: `• **1st (1940s–50s): vacuum tubes** — very large, hot, unreliable, machine language. ENIAC, UNIVAC.
• **2nd (1950s–60s): transistors** — smaller, faster, assembly language and early high-level languages (FORTRAN, COBOL).
• **3rd (1960s–70s): integrated circuits** — many transistors on one chip, keyboards, monitors, operating systems.
• **4th (1971–now): microprocessors** — whole CPU on one chip (Intel 4004), personal computers, internet, smartphones.
• **5th (present and future): AI, parallel processing, quantum computing** — natural language, learning and reasoning.` },
      { h: 'Pre-AI computing: binary logic and deterministic problems', b: `Computers before AI were built on **binary logic** — everything as 0 and 1 — and **logic gates** that make fixed decisions (AND, OR, NOT). They are perfect for **deterministic problems**, where the same input always gives the same output: calculating salaries, sorting names, controlling traffic lights on a timer. The lesson "Deterministic vs Probabilistic" explains why the real world also needs AI.` },
    ],
    exam: {
      short: [
        { q: 'Why is Charles Babbage called the father of the computer?', a: 'He designed the Analytical Engine (1830s), a mechanical general-purpose computer with a processing unit ("mill"), memory ("store"), input and output — the basic plan of modern computers.' },
        { q: 'Which technology was used in the third generation of computers?', a: 'Integrated circuits (ICs).' },
        { q: 'State Moore\'s law.', a: 'The number of transistors on a chip doubles about every two years, so computing power keeps increasing while cost falls.' },
      ],
      long: [
        { q: 'Compare the five generations of computers in terms of technology, size, speed and one example.', a: '1st — vacuum tubes, room-sized, slow, ENIAC. 2nd — transistors, smaller, faster, IBM 1401/7094. 3rd — ICs, minicomputers, faster, IBM 360. 4th — microprocessors, desktops/laptops/phones, very fast, Intel-based PCs. 5th — AI and parallel/quantum processing, varied sizes, extremely fast, AI supercomputers and quantum prototypes.' },
        { q: 'Trace the development of computing devices from the abacus to the microprocessor.', a: 'Abacus (counting beads) → Napier\'s bones and slide rule → Pascal\'s mechanical calculator (1642) → Babbage\'s Analytical Engine (1830s, programmable concept; Ada Lovelace\'s program) → electromechanical and vacuum-tube computers (ENIAC, 1945) → transistors (1950s) → integrated circuits (1960s) → microprocessor (Intel 4004, 1971) leading to PCs and smartphones.' },
      ],
    },
  },

  c9_c_2: {
    sections: [
      { h: 'The data processing cycle', b: `**Input → Processing → Output → Storage** (with feedback).
• Input: keyboard, sensor, camera, microphone.
• Processing: CPU performs calculations and comparisons.
• Output: screen, speaker, motor, printer.
• Storage: RAM (temporary), SSD/HDD/flash (permanent).` },
      { h: 'Storage units — exact values', b: `• 1 nibble = 4 bits
• 1 byte (B) = 8 bits
• 1 kilobyte (KB) = 1024 bytes
• 1 megabyte (MB) = 1024 KB
• 1 gigabyte (GB) = 1024 MB
• 1 terabyte (TB) = 1024 GB
• 1 petabyte (PB) = 1024 TB
Worked example: a 2 MB photo = 2 × 1024 × 1024 × 8 = 16,777,216 bits.` },
      { h: 'How different data is stored as bits', b: `• **Text:** each character has a code — ASCII uses 7/8 bits ('A' = 65 = 01000001); **Unicode** covers all scripts including Hindi and emoji.
• **Images:** a grid of pixels; each pixel stores colour as numbers (red, green, blue, 0–255 each).
• **Sound:** the wave is sampled thousands of times a second and each sample stored as a number.
• **Video:** many images (frames) per second plus sound.` },
    ],
    exam: {
      short: [
        { q: 'How many bits are there in 1 KB?', a: '1 KB = 1024 bytes = 1024 × 8 = 8192 bits.' },
        { q: 'What is a nibble?', a: 'A group of 4 bits (half a byte).' },
        { q: 'Write the steps of the data processing cycle.', a: 'Input → Processing → Output → Storage.' },
      ],
      long: [
        { q: 'Explain how text, images and sound are represented in a computer.', a: 'Text: each character is given a numeric code (ASCII/Unicode) stored in binary, e.g. A = 65 = 01000001. Images: divided into pixels; each pixel\'s colour stored as RGB numbers (0–255). Sound: the sound wave is sampled at regular intervals and each sample\'s amplitude stored as a binary number.' },
        { q: 'Arrange the storage units in ascending order and convert 3 GB into KB.', a: 'bit < nibble < byte < KB < MB < GB < TB < PB. 3 GB = 3 × 1024 MB = 3072 MB = 3072 × 1024 KB = 3,145,728 KB.' },
      ],
    },
  },

  c9_c_3: {
    figs: ['logicGates', 'truthTable2'],
    sections: [
      { h: 'Boolean expressions for each gate', b: `• AND: Y = A · B
• OR: Y = A + B
• NOT: Y = A̅ (A-bar)
• NAND: Y = (A · B)̅
• NOR: Y = (A + B)̅
• XOR: Y = A ⊕ B = A·B̅ + A̅·B
• XNOR: Y = (A ⊕ B)̅` },
      { h: 'Gates as conditional decisions (pre-AI computing)', b: `Logic gates are how early computers made decisions — fixed, **deterministic** rules:
• A car's seat-belt alarm: ALARM = ENGINE_ON AND (NOT BELT_FASTENED).
• A staircase light controlled from two switches uses XOR — flipping either switch changes the light.
• A robot stops if FRONT_SENSOR OR LEFT_SENSOR detects an obstacle (OR gate).
These rules always give the same output for the same input — they cannot handle uncertainty.` },
      { h: 'Building other gates from NAND only', b: `• NOT A = A NAND A
• A AND B = (A NAND B) NAND (A NAND B)
• A OR B = (A NAND A) NAND (B NAND B)
Because every gate can be built from NAND (or NOR) alone, they are called **universal gates**. Chips are cheaper when factories make only one type of gate.` },
    ],
    exam: {
      short: [
        { q: 'Why are NAND and NOR called universal gates?', a: 'Because any other logic gate (AND, OR, NOT, XOR…) can be built using only NAND gates or only NOR gates.' },
        { q: 'Draw the truth table of an XOR gate.', a: 'A B | Y: 0 0 | 0; 0 1 | 1; 1 0 | 1; 1 1 | 0.' },
        { q: 'Write the Boolean expression for a NOR gate.', a: 'Y = (A + B)̅, i.e. NOT (A OR B).' },
      ],
      long: [
        { q: 'Draw the symbols and truth tables of AND, OR and NOT gates, and give a real-life example of each.', a: 'AND — D-shaped symbol; output 1 only when both inputs are 1 (0 0→0, 0 1→0, 1 0→0, 1 1→1); example: a machine runs only if both safety guards are closed. OR — curved symbol; output 1 if any input is 1 (0 0→0, others→1); example: a doorbell rung from front or back door. NOT — triangle with bubble; output is opposite (0→1, 1→0); example: a night light turns on when it is NOT bright.' },
        { q: 'A robot should sound an alarm when its battery is low AND it is NOT at the charging dock. Write the Boolean expression, draw the logic circuit and the truth table.', a: 'Let L = battery low, D = at dock. Alarm Y = L · D̅. Circuit: D through a NOT gate, then AND with L. Truth table (L D | Y): 0 0 | 0; 0 1 | 0; 1 0 | 1; 1 1 | 0.' },
      ],
    },
  },

  c9_c_4: {
    sections: [
      { h: 'Three-input truth table method', b: `For Y = A·B + C (3 inputs → 2³ = 8 rows):
~~~
A B C | A·B | Y
0 0 0 |  0  | 0
0 0 1 |  0  | 1
0 1 0 |  0  | 0
0 1 1 |  0  | 1
1 0 0 |  0  | 0
1 0 1 |  0  | 1
1 1 0 |  1  | 1
1 1 1 |  1  | 1
~~~
Tip: write the inputs as counting in binary (000 to 111) so you never miss a row, and add intermediate columns.` },
      { h: 'More Boolean laws', b: `• Complement: A + A̅ = 1 ; A · A̅ = 0
• Double negation: (A̅)̅ = A
• Absorption: A + A·B = A ; A·(A + B) = A
• Distributive: A·(B + C) = A·B + A·C
• De Morgan's (both forms): (A·B)̅ = A̅ + B̅ and (A + B)̅ = A̅ · B̅

Proving De Morgan's law with a truth table: compute (A·B)̅ and A̅ + B̅ for all 4 rows — both columns give 1, 1, 1, 0, so they are equal.` },
    ],
    exam: {
      short: [
        { q: 'How many rows will a truth table with 4 inputs have?', a: '2⁴ = 16 rows.' },
        { q: 'State both forms of De Morgan\'s theorem.', a: '(A·B)̅ = A̅ + B̅ and (A + B)̅ = A̅·B̅.' },
        { q: 'Simplify A + A·B.', a: 'A (absorption law).' },
      ],
      long: [
        { q: 'Draw the truth table for Y = (A + B)·C̅.', a: 'Rows (A B C | A+B | C̅ | Y): 000|0|1|0; 001|0|0|0; 010|1|1|1; 011|1|0|0; 100|1|1|1; 101|1|0|0; 110|1|1|1; 111|1|0|0.' },
        { q: 'Verify De Morgan\'s theorem (A + B)̅ = A̅·B̅ using a truth table.', a: 'A B | A+B | (A+B)̅ | A̅ | B̅ | A̅·B̅: 0 0 | 0 | 1 | 1 | 1 | 1; 0 1 | 1 | 0 | 1 | 0 | 0; 1 0 | 1 | 0 | 0 | 1 | 0; 1 1 | 1 | 0 | 0 | 0 | 0. The two columns are identical, so the theorem is verified.' },
      ],
    },
  },

  c9_c_5: {
    figs: ['binaryPlace', 'decToBin'],
    sections: [
      { h: 'Converting fractions (extension)', b: `Binary also has a "binary point": 101.1₂ = 4 + 0 + 1 + 0.5 = 5.5₁₀ (place values after the point are ½, ¼, ⅛…).` },
      { h: 'Binary addition with carries', b: `~~~
    1 1 1        ← carries
    1 0 1 1   (11)
  + 0 1 1 1   (7)
  ---------
  1 0 0 1 0   (18)
~~~
Rules: 0+0=0, 0+1=1, 1+1=10 (write 0 carry 1), 1+1+1=11 (write 1 carry 1).` },
      { h: 'Signed numbers: 2\'s complement (overview)', b: `To store negative numbers, computers use **2's complement**: invert all bits and add 1.
Example (8-bit): +5 = 00000101 → invert 11111010 → add 1 → 11111011 = −5.
With 8 bits, the range becomes −128 to +127.` },
    ],
    exam: {
      short: [
        { q: 'Convert 45₁₀ into binary.', a: '45 = 32 + 8 + 4 + 1 → 101101₂.' },
        { q: 'Convert 110110₂ into decimal.', a: '32 + 16 + 0 + 4 + 2 + 0 = 54₁₀.' },
        { q: 'Add 1101₂ and 1011₂.', a: '11000₂ (13 + 11 = 24).' },
      ],
      long: [
        { q: 'Convert 156₁₀ to binary showing all steps, and check your answer by converting back.', a: '156÷2=78 r0; 78÷2=39 r0; 39÷2=19 r1; 19÷2=9 r1; 9÷2=4 r1; 4÷2=2 r0; 2÷2=1 r0; 1÷2=0 r1 → read upwards: 10011100₂. Check: 128 + 16 + 8 + 4 = 156 ✓.' },
        { q: 'Why do computers use the binary number system? Explain place values with the example 1011₂.', a: 'Electronic circuits have two reliable states (on/off, high/low voltage), so two digits 0 and 1 are easy to store and process with little error. Place values are powers of 2 from the right: 1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11₁₀.' },
      ],
    },
  },

  c9_c_6: {
    figs: ['numberSystems'],
    sections: [
      { h: 'Worked conversions', b: `**Hexadecimal to decimal:** 2F₁₆ = 2×16 + 15×1 = 47₁₀
**Octal to decimal:** 157₈ = 1×64 + 5×8 + 7×1 = 111₁₀
**Decimal to hexadecimal:** 300 ÷ 16 = 18 r 12 (C); 18 ÷ 16 = 1 r 2; 1 ÷ 16 = 0 r 1 → **12C₁₆**
**Hex to binary:** replace each hex digit with 4 bits: 3A₁₆ = 0011 1010₂
**Octal to binary:** replace each octal digit with 3 bits: 64₈ = 110 100₂
**Octal ↔ hex:** go through binary.` },
      { h: 'Where you meet these systems', b: `• Web colours: #FF8800 = red 255, green 136, blue 0.
• MAC addresses: 3C:5A:B4:12:9F:01 (hex).
• Memory addresses in debuggers: 0x1F40.
• Linux file permissions: chmod 755 (octal: rwx r-x r-x).
• Arduino code: 0b1010 (binary literal), 0xFF (hex literal).` },
    ],
    exam: {
      short: [
        { q: 'Convert 3F₁₆ into decimal.', a: '3 × 16 + 15 = 63₁₀.' },
        { q: 'Convert 101110₂ into octal.', a: 'Group in 3s: 101 110 → 5 6 → 56₈.' },
        { q: 'Why do programmers prefer hexadecimal to binary?', a: 'It is much shorter and easier to read; each hex digit represents exactly 4 bits, so converting is simple.' },
      ],
      long: [
        { q: 'Convert 250₁₀ into binary, octal and hexadecimal.', a: 'Binary: 11111010₂. Octal (groups of 3 from right: 011 111 010): 372₈. Hex (groups of 4: 1111 1010): FA₁₆.' },
        { q: 'Convert (a) 1A7₁₆ to decimal (b) 725₈ to binary (c) 11010111₂ to hexadecimal.', a: '(a) 1×256 + 10×16 + 7 = 423₁₀. (b) 7 = 111, 2 = 010, 5 = 101 → 111010101₂. (c) 1101 0111 → D7₁₆.' },
      ],
    },
  },
};
