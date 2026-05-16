// ============================================================
//  IELTS Speaking Part 2 — Keyword Association Game
//  questions.js
//
//  Each topic has:
//    id         — unique number
//    title      — short display name
//    prompt     — full Part 2 cue card text
//    keywords   — words that FIT this topic (correct = true)
//    distractors— words that do NOT fit (correct = false)
//
//  Each word object:
//    word        — the vocabulary item
//    correct     — true (fits) | false (distractor)
//    explanation — one-line note shown in review screen
// ============================================================

const topics = [

  // ─────────────────────────────────────────────
  //  1. Perfect Job
  // ─────────────────────────────────────────────
  {
    id: 1,
    title: "Perfect Job",
    prompt: `Describe a perfect job you would like to have in the future.\n\nYou should say:\n• What it is\n• How you knew about it\n• What you need to learn to get this job\n• And explain why you think it is a perfect job for you`,
    keywords: [
      { word: "vocation",      correct: true,  explanation: "A strong feeling that a particular career is your calling — ideal for describing a dream job." },
      { word: "aspiration",    correct: true,  explanation: "A hope or ambition to achieve something; central to talking about your ideal future career." },
      { word: "qualification", correct: true,  explanation: "A skill or certificate needed for a job — directly relevant to what you need to learn." },
      { word: "fulfilment",    correct: true,  explanation: "A feeling of satisfaction from doing meaningful work; key to explaining why a job is 'perfect'." },
      { word: "stimulating",   correct: true,  explanation: "Intellectually exciting — a great adjective for describing why a role appeals to you." },
      { word: "rewarding",     correct: true,  explanation: "Giving satisfaction in return for effort; very natural when describing a dream job." },
      { word: "expertise",     correct: true,  explanation: "High-level skill in a field — useful when discussing what you need to develop." },
      { word: "autonomy",      correct: true,  explanation: "Freedom to make your own decisions at work; a common reason people choose certain careers." },
      { word: "prospect",      correct: true,  explanation: "The possibility of future success or advancement in a career." },
      { word: "mentor",        correct: true,  explanation: "An experienced person who guides you; useful when explaining how you would develop skills." },
      // distractors
      { word: "landlord",      correct: false, explanation: "Relates to property rental — not relevant to describing a dream career." },
      { word: "precipitation", correct: false, explanation: "A weather term — belongs to environment/scenery topics, not careers." },
      { word: "souvenir",      correct: false, explanation: "A keepsake from travel — better suited to travel or family heirloom topics." },
      { word: "fluorescent",   correct: false, explanation: "Describes bright lighting or colour — not a vocabulary item for career discussions." },
      { word: "hibernate",     correct: false, explanation: "An animal behaviour term — fits pets/animals topics, not jobs." },
    ]
  },

  // ─────────────────────────────────────────────
  //  2. Famous Person You'd Like to Meet
  // ─────────────────────────────────────────────
  {
    id: 2,
    title: "Famous Person to Meet",
    prompt: `Describe a famous person you would like to meet.\n\nYou should say:\n• Who he/she is\n• How you knew about him/her\n• How/where you would like to meet him/her\n• And explain why you would like to meet him/her`,
    keywords: [
      { word: "renowned",      correct: true,  explanation: "Famous and respected — a strong adjective for describing a well-known figure." },
      { word: "idol",          correct: true,  explanation: "Someone you admire greatly; very natural when talking about a famous person you look up to." },
      { word: "influential",   correct: true,  explanation: "Having a great effect on people — ideal for explaining why someone is admirable." },
      { word: "pioneering",    correct: true,  explanation: "Introducing new ideas; excellent for describing innovators or trailblazers." },
      { word: "interact",      correct: true,  explanation: "To communicate with someone — useful when imagining a meeting scenario." },
      { word: "admiration",    correct: true,  explanation: "Respect and warm approval; key emotion when explaining why you want to meet someone." },
      { word: "celebrity",     correct: true,  explanation: "A famous person, especially in entertainment — core vocabulary for this topic." },
      { word: "inspiration",   correct: true,  explanation: "Something that motivates creativity or action; central to why you admire someone." },
      { word: "charisma",      correct: true,  explanation: "A compelling attractiveness or charm — a vivid word for describing famous personalities." },
      { word: "legacy",        correct: true,  explanation: "What a person leaves behind after their life — powerful for explaining long-term influence." },
      // distractors
      { word: "terraced",      correct: false, explanation: "Describes a type of housing or landscape — belongs to building/home topics." },
      { word: "overdraft",     correct: false, explanation: "A banking term — fits spending/money topics, not famous people." },
      { word: "camouflage",    correct: false, explanation: "A disguise technique — more relevant to nature or military contexts." },
      { word: "thermostat",    correct: false, explanation: "A temperature-control device — not applicable to describing famous people." },
      { word: "migrate",       correct: false, explanation: "To move from one place to another — better suited to travel or animal topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  3. Occasion When Mobile Phone Was Banned
  // ─────────────────────────────────────────────
  {
    id: 3,
    title: "No Mobile Phone Occasion",
    prompt: `Describe an occasion when you were not allowed to use your mobile phone.\n\nYou should say:\n• When it was\n• Where it was\n• Why you were not allowed to use your mobile phone\n• And how you felt about it`,
    keywords: [
      { word: "prohibited",    correct: true,  explanation: "Officially forbidden — strong formal word for describing a rule against phone use." },
      { word: "distraction",   correct: true,  explanation: "Something that prevents concentration — a key reason phones get banned in many places." },
      { word: "ceremony",      correct: true,  explanation: "A formal event (wedding, graduation) where phones are often restricted." },
      { word: "compelled",     correct: true,  explanation: "Forced to do something — useful for describing how you had to comply with the rule." },
      { word: "etiquette",     correct: true,  explanation: "The code of polite behaviour — explains why phone use is inappropriate in certain settings." },
      { word: "disconnected",  correct: true,  explanation: "Cut off from communication — a natural feeling when your phone is taken away." },
      { word: "restriction",   correct: true,  explanation: "A rule that limits what you can do — central vocabulary for this topic." },
      { word: "compliance",    correct: true,  explanation: "Obeying a rule or policy — describes your response to the no-phone rule." },
      { word: "venue",         correct: true,  explanation: "The place where an event is held — important for setting the scene of your story." },
      { word: "confiscated",   correct: true,  explanation: "Officially taken away — vivid and accurate if your phone was physically removed." },
      // distractors
      { word: "photosynthesis",correct: false, explanation: "A biological process in plants — belongs to science or nature topics." },
      { word: "embroidery",    correct: false, explanation: "A needlework craft — fits hobbies or childhood activities topics." },
      { word: "archipelago",   correct: false, explanation: "A group of islands — a geography/travel term, not relevant here." },
      { word: "dividend",      correct: false, explanation: "A financial return on investment — fits money/spending topics." },
      { word: "symmetrical",   correct: false, explanation: "Having equal proportions on both sides — fits art or building topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  4. Giving Advice to Others
  // ─────────────────────────────────────────────
  {
    id: 4,
    title: "Giving Advice",
    prompt: `Describe a time when you gave advice to others.\n\nYou should say:\n• When it was\n• To whom you gave the advice\n• What the advice was\n• And explain why you gave the advice`,
    keywords: [
      { word: "guidance",      correct: true,  explanation: "Advice or information aimed at resolving a problem — core vocabulary for this topic." },
      { word: "perspective",   correct: true,  explanation: "A particular way of thinking about something — useful when explaining the advice you gave." },
      { word: "empathy",       correct: true,  explanation: "Understanding another's feelings — important quality in a good advisor." },
      { word: "reassure",      correct: true,  explanation: "To say things to reduce worry — natural when describing supportive advice." },
      { word: "dilemma",       correct: true,  explanation: "A difficult choice — sets the scene for why someone needed advice." },
      { word: "constructive",  correct: true,  explanation: "Useful and positive — a key adjective for describing good advice." },
      { word: "candid",        correct: true,  explanation: "Honest and straightforward — describes the tone of sincere advice." },
      { word: "recommend",     correct: true,  explanation: "To suggest something as a good course of action — directly relevant to giving advice." },
      { word: "concern",       correct: true,  explanation: "A worry or interest in someone's wellbeing — motivates giving advice." },
      { word: "outcome",       correct: true,  explanation: "The result of following advice — useful for explaining what happened after." },
      // distractors
      { word: "carburetor",    correct: false, explanation: "A car engine component — belongs to vehicles/transport topics." },
      { word: "monsoon",       correct: false, explanation: "A seasonal weather pattern — fits travel or scenery topics." },
      { word: "anthology",     correct: false, explanation: "A collection of literary works — more relevant to reading topics." },
      { word: "fluoride",      correct: false, explanation: "A chemical compound used in dental care — not relevant to advice-giving." },
      { word: "wingspan",      correct: false, explanation: "The measurement of a bird's wings — fits pets/animals topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  5. Technology Product You'd Like to Own
  // ─────────────────────────────────────────────
  {
    id: 5,
    title: "Technology Product",
    prompt: `Describe a piece of technology (not a phone) that you would like to own.\n\nYou should say:\n• What it is\n• How much it costs\n• How you knew about it\n• And explain why you would like to own it`,
    keywords: [
      { word: "innovative",    correct: true,  explanation: "Introducing new ideas or methods — a key adjective for cutting-edge technology." },
      { word: "gadget",        correct: true,  explanation: "A small mechanical or electronic device — perfect for talking about tech products." },
      { word: "functionality", correct: true,  explanation: "The range of operations a device can perform — central to describing technology." },
      { word: "efficient",     correct: true,  explanation: "Achieving results without wasted effort — important quality in a desirable tech product." },
      { word: "affordable",    correct: true,  explanation: "Not too expensive — relevant when discussing the cost of the product." },
      { word: "cutting-edge",  correct: true,  explanation: "The most advanced stage of development — vivid phrase for describing new technology." },
      { word: "wireless",      correct: true,  explanation: "Operating without physical connections — a common feature of modern tech." },
      { word: "upgrade",       correct: true,  explanation: "An improvement to a newer or better version — natural in tech discussions." },
      { word: "automated",     correct: true,  explanation: "Operating with minimal human intervention — a key feature of smart devices." },
      { word: "intuitive",     correct: true,  explanation: "Easy to use without instruction — a desirable quality in technology." },
      // distractors
      { word: "deciduous",     correct: false, explanation: "Describes trees that shed leaves — a nature/environment term." },
      { word: "cholesterol",   correct: false, explanation: "A health/biology term — not relevant to technology topics." },
      { word: "serenade",      correct: false, explanation: "A piece of music performed outdoors — fits music topics." },
      { word: "feudal",        correct: false, explanation: "Relating to a medieval social system — a history term." },
      { word: "lacquer",       correct: false, explanation: "A type of varnish — fits art or building topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  6. Person Good at Planning
  // ─────────────────────────────────────────────
  {
    id: 6,
    title: "Person Good at Planning",
    prompt: `Describe a person who makes plans a lot and is good at planning.\n\nYou should say:\n• Who he/she is\n• How you knew him/her\n• What plans he/she makes\n• And explain how you feel about this person`,
    keywords: [
      { word: "meticulous",    correct: true,  explanation: "Very careful and precise — a perfect adjective for someone who plans thoroughly." },
      { word: "organised",     correct: true,  explanation: "Arranging things efficiently — core quality of a good planner." },
      { word: "proactive",     correct: true,  explanation: "Taking initiative before problems arise — essential trait of a planner." },
      { word: "schedule",      correct: true,  explanation: "A plan that lists tasks and times — central vocabulary for this topic." },
      { word: "prioritise",    correct: true,  explanation: "To rank tasks by importance — key skill of an effective planner." },
      { word: "foresight",     correct: true,  explanation: "The ability to predict future needs — a defining quality of a good planner." },
      { word: "deadline",      correct: true,  explanation: "A time by which something must be done — a planning concept." },
      { word: "strategy",      correct: true,  explanation: "A plan of action designed to achieve a goal — directly relevant." },
      { word: "disciplined",   correct: true,  explanation: "Showing controlled, orderly behaviour — a trait of reliable planners." },
      { word: "contingency",   correct: true,  explanation: "A backup plan for unexpected events — advanced vocabulary for this topic." },
      // distractors
      { word: "aquatic",       correct: false, explanation: "Relating to water — fits scenery or animal topics." },
      { word: "diameter",      correct: false, explanation: "A geometry measurement — not relevant to describing a person's planning habits." },
      { word: "trilogy",       correct: false, explanation: "A set of three works — more relevant to books or movies." },
      { word: "pesticide",     correct: false, explanation: "A chemical for killing pests — fits environment topics." },
      { word: "avalanche",     correct: false, explanation: "A mass of snow falling — fits scenery or travel topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  7. Child Who Loves Drawing
  // ─────────────────────────────────────────────
  {
    id: 7,
    title: "Child Who Loves Drawing",
    prompt: `Describe a child who loves drawing/painting.\n\nYou should say:\n• Who he/she is\n• How/when you knew him/her\n• How often he/she draws/paints\n• And explain why you think he/she loves drawing/painting`,
    keywords: [
      { word: "creative",      correct: true,  explanation: "Having the ability to produce original ideas — essential for describing an artistic child." },
      { word: "canvas",        correct: true,  explanation: "The surface used for painting — specific art vocabulary." },
      { word: "palette",       correct: true,  explanation: "A board for mixing colours — vivid, specific word for a drawing/painting topic." },
      { word: "imaginative",   correct: true,  explanation: "Having a lively imagination — a key trait of a child who loves art." },
      { word: "sketch",        correct: true,  explanation: "A rough drawing — directly related to the drawing topic." },
      { word: "expressive",    correct: true,  explanation: "Effectively conveying thoughts or feelings — describes art as communication." },
      { word: "talented",      correct: true,  explanation: "Having a natural ability — natural for describing an artistically gifted child." },
      { word: "illustrate",    correct: true,  explanation: "To draw pictures to explain or decorate — core art vocabulary." },
      { word: "masterpiece",   correct: true,  explanation: "A work of outstanding quality — useful for describing impressive artwork." },
      { word: "passionate",    correct: true,  explanation: "Having strong enthusiasm — describes the child's love of drawing." },
      // distractors
      { word: "mortgage",      correct: false, explanation: "A loan for property — belongs to money/spending topics." },
      { word: "turbulence",    correct: false, explanation: "Irregular air movement — fits travel or weather contexts." },
      { word: "metabolism",    correct: false, explanation: "A biological process — not relevant to art or children's hobbies." },
      { word: "referendum",    correct: false, explanation: "A public vote — belongs to politics or society topics." },
      { word: "bandwidth",     correct: false, explanation: "Internet capacity — fits technology topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  8. App or Computer Program
  // ─────────────────────────────────────────────
  {
    id: 8,
    title: "App or Program",
    prompt: `Describe a program or app on your computer or phone.\n\nYou should say:\n• What it is\n• How often you use it\n• When/how you use it\n• When/how you found it\n• And explain how you feel about it`,
    keywords: [
      { word: "interface",     correct: true,  explanation: "The visual layout of an app — important vocabulary for describing how an app looks and works." },
      { word: "notification",  correct: true,  explanation: "An alert from an app — directly relevant to how apps interact with users." },
      { word: "seamless",      correct: true,  explanation: "Smooth and without problems — a great adjective for a well-designed app." },
      { word: "platform",      correct: true,  explanation: "The system an app runs on (iOS, Android) — relevant to describing any app." },
      { word: "subscription",  correct: true,  explanation: "A regular payment to use a service — common feature of many apps." },
      { word: "navigate",      correct: true,  explanation: "To move through an app's menus — practical vocabulary for describing app use." },
      { word: "download",      correct: true,  explanation: "To install an app — directly relevant to how you found/got the app." },
      { word: "personalised",  correct: true,  explanation: "Adapted to individual preferences — a feature many apps offer." },
      { word: "algorithm",     correct: true,  explanation: "A set of rules a program follows — advanced vocabulary for discussing how apps work." },
      { word: "update",        correct: true,  explanation: "A new version of an app with improvements — natural in app discussions." },
      // distractors
      { word: "irrigation",    correct: false, explanation: "A farming/water management term — belongs to environment or nature topics." },
      { word: "tectonic",      correct: false, explanation: "Relating to the earth's crust — a geography/science term." },
      { word: "heirloom",      correct: false, explanation: "A valued family object — fits the family keepsake topic." },
      { word: "nocturnal",     correct: false, explanation: "Active at night — an animal behaviour term." },
      { word: "cathedral",     correct: false, explanation: "A large church building — fits building or city topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  9. Occasion When People Were Smiling
  // ─────────────────────────────────────────────
  {
    id: 9,
    title: "Occasion with Smiling",
    prompt: `Describe an occasion when many people were smiling.\n\nYou should say:\n• When it happened\n• Who you were with\n• What happened\n• And explain why most people were smiling`,
    keywords: [
      { word: "joyful",        correct: true,  explanation: "Full of happiness — a key adjective for describing a cheerful occasion." },
      { word: "atmosphere",    correct: true,  explanation: "The mood or feeling of a place — essential for setting the scene." },
      { word: "celebration",   correct: true,  explanation: "A special event to mark something happy — common context for group smiling." },
      { word: "elated",        correct: true,  explanation: "Extremely happy and excited — vivid emotion word for this topic." },
      { word: "infectious",    correct: true,  explanation: "Spreading easily to others — describes how smiling and laughter spread in a crowd." },
      { word: "heartwarming",  correct: true,  explanation: "Causing feelings of happiness — a natural adjective for a touching moment." },
      { word: "laughter",      correct: true,  explanation: "The sound of being amused — directly relevant to a smiling occasion." },
      { word: "beaming",       correct: true,  explanation: "Smiling radiantly — a vivid verb/adjective for describing happy faces." },
      { word: "gathered",      correct: true,  explanation: "Assembled together — useful for describing a group occasion." },
      { word: "uplifting",     correct: true,  explanation: "Making you feel happier — perfect for describing the effect of the event." },
      // distractors
      { word: "conductor",     correct: false, explanation: "Someone who leads an orchestra OR controls electricity — not specific to smiling occasions." },
      { word: "tidal",         correct: false, explanation: "Relating to ocean tides — belongs to scenery or environment topics." },
      { word: "prototype",     correct: false, explanation: "An early model of a product — fits technology topics." },
      { word: "manuscript",    correct: false, explanation: "A handwritten document — fits reading or history topics." },
      { word: "altitude",      correct: false, explanation: "Height above sea level — fits travel or scenery topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  10. Proud of a Family Member
  // ─────────────────────────────────────────────
  {
    id: 10,
    title: "Proud of a Family Member",
    prompt: `Describe a time when you felt proud of a family member.\n\nYou should say:\n• When it happened\n• Who the person is\n• What the person did\n• And explain why you felt proud of him/her`,
    keywords: [
      { word: "achievement",   correct: true,  explanation: "Something accomplished successfully — central to why you feel proud of someone." },
      { word: "admire",        correct: true,  explanation: "To regard with respect and approval — key emotion in this topic." },
      { word: "perseverance",  correct: true,  explanation: "Continued effort despite difficulty — a common reason for family pride." },
      { word: "overcome",      correct: true,  explanation: "To succeed in dealing with a challenge — useful for describing what the person did." },
      { word: "sibling",       correct: true,  explanation: "A brother or sister — a specific family vocabulary word." },
      { word: "milestone",     correct: true,  explanation: "An important event in someone's life — graduation, promotion etc." },
      { word: "devoted",       correct: true,  explanation: "Very loving and loyal — describes a family member's dedication." },
      { word: "honour",        correct: true,  explanation: "A sense of respect and pride — directly relevant to feeling proud." },
      { word: "resilient",     correct: true,  explanation: "Able to recover quickly from difficulties — a praiseworthy quality." },
      { word: "sacrifice",     correct: true,  explanation: "Giving up something valuable — often at the root of family pride." },
      // distractors
      { word: "velocity",      correct: false, explanation: "The speed of something in a direction — a physics/science term." },
      { word: "perimeter",     correct: false, explanation: "The boundary of a shape — a geometry term." },
      { word: "lagoon",        correct: false, explanation: "A body of water separated from the sea — a travel/scenery word." },
      { word: "antibiotic",    correct: false, explanation: "A medicine — belongs to health topics, not family pride." },
      { word: "algorithm",     correct: false, explanation: "A computing term — fits technology/app topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  11. Important Family Keepsake
  // ─────────────────────────────────────────────
  {
    id: 11,
    title: "Important Family Keepsake",
    prompt: `Describe something important that has been kept in your family for a long time.\n\nYou should say:\n• What it is\n• When your family had it\n• How your family got it\n• And explain why it is important to your family`,
    keywords: [
      { word: "heirloom",      correct: true,  explanation: "A valuable object passed down through generations — the core vocabulary for this topic." },
      { word: "keepsake",      correct: true,  explanation: "A small item kept as a reminder of a person or event — perfect for family objects." },
      { word: "sentimental",   correct: true,  explanation: "Connected with emotions and memories — explains why the item is important." },
      { word: "inherited",     correct: true,  explanation: "Received from a previous generation — directly describes how the family got it." },
      { word: "cherish",       correct: true,  explanation: "To hold dear — a natural verb for describing how the family feels about the object." },
      { word: "generation",    correct: true,  explanation: "All the people of a similar age in a family — central to this topic." },
      { word: "ancestral",     correct: true,  explanation: "Relating to ancestors — useful for explaining the object's long history." },
      { word: "preserve",      correct: true,  explanation: "To keep something in its original state — describes how the family cares for the item." },
      { word: "memorable",     correct: true,  explanation: "Worth remembering — describes the significance of the object." },
      { word: "irreplaceable", correct: true,  explanation: "Too valuable to be replaced — powerful word for a precious family object." },
      // distractors
      { word: "accelerate",    correct: false, explanation: "To go faster — a transport/physics term." },
      { word: "transcript",    correct: false, explanation: "A written record of speech — fits academic or work topics." },
      { word: "turbine",       correct: false, explanation: "A machine for generating power — belongs to technology or environment topics." },
      { word: "rehearsal",     correct: false, explanation: "A practice session — fits music or performance topics." },
      { word: "gradient",      correct: false, explanation: "A slope or rate of change — a maths/geography term." },
    ]
  },

  // ─────────────────────────────────────────────
  //  12. Bicycle / Motorcycle / Car Trip
  // ─────────────────────────────────────────────
  {
    id: 12,
    title: "Vehicle Trip",
    prompt: `Describe a bicycle/motorcycle/car trip you would like to go on.\n\nYou should say:\n• Who you would like to go with\n• Where you would like to go\n• When you would like to go\n• And explain why you would like to go by bicycle/motorcycle/car`,
    keywords: [
      { word: "scenic",        correct: true,  explanation: "Having beautiful natural scenery — a key adjective for describing a road trip route." },
      { word: "itinerary",     correct: true,  explanation: "A planned route or schedule for a trip — directly relevant." },
      { word: "adventurous",   correct: true,  explanation: "Willing to take risks or try new experiences — ideal for a road trip description." },
      { word: "destination",   correct: true,  explanation: "The place you are travelling to — essential vocabulary for any trip topic." },
      { word: "navigate",      correct: true,  explanation: "To plan and follow a route — relevant to driving or cycling trips." },
      { word: "refreshing",    correct: true,  explanation: "Making you feel less tired or hot — great for describing the experience of a trip." },
      { word: "spontaneous",   correct: true,  explanation: "Done on impulse without planning — describes a free-spirited trip style." },
      { word: "terrain",       correct: true,  explanation: "The physical features of land — important when describing cycling or driving routes." },
      { word: "milestone",     correct: true,  explanation: "A stone marker on a road OR a significant point in a journey." },
      { word: "pit stop",      correct: true,  explanation: "A brief stop during a long journey — very natural travel vocabulary." },
      // distractors
      { word: "mortgage",      correct: false, explanation: "A property loan — belongs to money or home topics." },
      { word: "chromosome",    correct: false, explanation: "A biological structure — a science term, not travel." },
      { word: "tuition",       correct: false, explanation: "Teaching or instruction fees — fits work/study topics." },
      { word: "quarantine",    correct: false, explanation: "Isolation for health reasons — not relevant to a leisure trip topic." },
      { word: "solvent",       correct: false, explanation: "A liquid used to dissolve substances — a chemistry term." },
    ]
  },

  // ─────────────────────────────────────────────
  //  13. Person Who Solved a Problem Cleverly
  // ─────────────────────────────────────────────
  {
    id: 13,
    title: "Clever Problem Solver",
    prompt: `Describe a person who solved a problem in a smart way.\n\nYou should say:\n• Who this person is\n• What the problem was\n• How he/she solved it\n• And explain why you think he/she did it in a smart way`,
    keywords: [
      { word: "ingenious",     correct: true,  explanation: "Clever and inventive — a vivid adjective for describing a smart solution." },
      { word: "resourceful",   correct: true,  explanation: "Able to find quick solutions using whatever is available — perfect for this topic." },
      { word: "logical",       correct: true,  explanation: "Using clear, sound reasoning — describes the thinking behind a smart solution." },
      { word: "obstacle",      correct: true,  explanation: "Something that blocks progress — sets up the problem that needed solving." },
      { word: "innovative",    correct: true,  explanation: "Introducing a new approach — describes a creative solution." },
      { word: "analyse",       correct: true,  explanation: "To examine in detail — the first step in solving any problem cleverly." },
      { word: "breakthrough",  correct: true,  explanation: "A sudden important discovery — useful for describing a moment of clever insight." },
      { word: "lateral",       correct: true,  explanation: "'Lateral thinking' — solving problems through creative, indirect methods." },
      { word: "implement",     correct: true,  explanation: "To put a plan into action — describes applying the solution." },
      { word: "efficient",     correct: true,  explanation: "Achieving results with minimum wasted effort — quality of a smart solution." },
      // distractors
      { word: "symphony",      correct: false, explanation: "A long musical composition — fits music topics." },
      { word: "fossil",        correct: false, explanation: "Preserved remains of ancient life — a science/nature term." },
      { word: "condominium",   correct: false, explanation: "A type of apartment — fits home/accommodation topics." },
      { word: "mural",         correct: false, explanation: "A large wall painting — fits art or building topics." },
      { word: "pedigree",      correct: false, explanation: "An animal's recorded ancestry — fits pets/animals topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  14. Friend Who Taught Themselves Something
  // ─────────────────────────────────────────────
  {
    id: 14,
    title: "Friend Who Self-Studied",
    prompt: `Describe one of your friends who learned something without a teacher.\n\nYou should say:\n• Who he/she is\n• What he/she learned\n• Why he/she learned this\n• And explain whether it would be easier to learn from a teacher`,
    keywords: [
      { word: "self-taught",   correct: true,  explanation: "Having learned a skill without formal teaching — the defining phrase for this topic." },
      { word: "determined",    correct: true,  explanation: "Having a firm decision to do something — describes the friend's mindset." },
      { word: "tutorial",      correct: true,  explanation: "A lesson, often online — the resource self-learners often use." },
      { word: "discipline",    correct: true,  explanation: "Controlled, orderly behaviour in studying — essential for self-directed learning." },
      { word: "initiative",    correct: true,  explanation: "The ability to decide and act independently — key trait of a self-learner." },
      { word: "curiosity",     correct: true,  explanation: "A strong desire to learn — motivates self-study." },
      { word: "persistent",    correct: true,  explanation: "Continuing firmly despite difficulty — needed when learning without a teacher." },
      { word: "trial and error",correct: true, explanation: "Learning by trying different approaches — common in self-directed learning." },
      { word: "proficiency",   correct: true,  explanation: "A high degree of skill — the goal of any learning process." },
      { word: "independent",   correct: true,  explanation: "Not relying on others — the core quality of self-study." },
      // distractors
      { word: "boulevard",     correct: false, explanation: "A wide road — a travel/city vocabulary word." },
      { word: "cholesterol",   correct: false, explanation: "A health/biology term — not relevant to learning topics." },
      { word: "longitude",     correct: false, explanation: "A geographical coordinate — fits travel or scenery topics." },
      { word: "amphibious",    correct: false, explanation: "Able to live on land and water — fits animals topics." },
      { word: "centrifuge",    correct: false, explanation: "A scientific instrument — belongs to science/technology." },
    ]
  },

  // ─────────────────────────────────────────────
  //  15. Music Event You Didn't Enjoy
  // ─────────────────────────────────────────────
  {
    id: 15,
    title: "Music Event You Didn't Enjoy",
    prompt: `Describe an event you attended in which you didn't enjoy the music played.\n\nYou should say:\n• What it was\n• Who you went with\n• Why you decided to go there\n• And explain why you didn't enjoy it`,
    keywords: [
      { word: "genre",         correct: true,  explanation: "A category of music (jazz, classical, pop) — essential for explaining your music preferences." },
      { word: "melody",        correct: true,  explanation: "A sequence of musical notes — relevant when describing what you heard." },
      { word: "rhythm",        correct: true,  explanation: "A strong regular pattern of sound — core music vocabulary." },
      { word: "venue",         correct: true,  explanation: "The place where the event was held — important for setting the scene." },
      { word: "acoustic",      correct: true,  explanation: "Relating to sound — useful for describing the sound quality at the event." },
      { word: "monotonous",    correct: true,  explanation: "Dull and lacking variety — a strong adjective for music you didn't enjoy." },
      { word: "overwhelmed",   correct: true,  explanation: "Feeling overpowered by something — describes a reaction to loud or unpleasant music." },
      { word: "performer",     correct: true,  explanation: "Someone who performs on stage — relevant to any music event." },
      { word: "discordant",    correct: true,  explanation: "Sounds that clash unpleasantly — vivid word for music you disliked." },
      { word: "reluctantly",   correct: true,  explanation: "Doing something without wanting to — describes why you went despite doubts." },
      // distractors
      { word: "precipitation", correct: false, explanation: "A weather term — not relevant to music events." },
      { word: "herbivore",     correct: false, explanation: "An animal that eats plants — fits animals topics." },
      { word: "invoice",       correct: false, explanation: "A bill for payment — belongs to work or money topics." },
      { word: "camouflage",    correct: false, explanation: "A disguise technique — more relevant to nature or military contexts." },
      { word: "glacier",       correct: false, explanation: "A large mass of ice — belongs to travel or scenery topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  16. Movie You Watched Recently
  // ─────────────────────────────────────────────
  {
    id: 16,
    title: "Movie You Enjoyed",
    prompt: `Describe a movie you watched and enjoyed recently.\n\nYou should say:\n• When and where you watched it\n• Who you watched it with\n• What it was about\n• And explain why you watched this movie`,
    keywords: [
      { word: "plot",          correct: true,  explanation: "The sequence of events in a story — essential vocabulary for describing a film." },
      { word: "gripping",      correct: true,  explanation: "So exciting it holds your attention — a powerful adjective for a good film." },
      { word: "soundtrack",    correct: true,  explanation: "The music of a film — adds detail when describing the movie experience." },
      { word: "protagonist",   correct: true,  explanation: "The main character — useful when explaining what the film is about." },
      { word: "genre",         correct: true,  explanation: "The category of film (thriller, comedy, drama) — helps describe the movie." },
      { word: "cinematography",correct: true,  explanation: "The art of filming — impressive vocabulary for describing visual style." },
      { word: "compelling",    correct: true,  explanation: "Evoking interest or attention — great adjective for a film you enjoyed." },
      { word: "sequel",        correct: true,  explanation: "A film that continues a story — useful contextual vocabulary." },
      { word: "depict",        correct: true,  explanation: "To show or represent — useful verb for describing what a film portrays." },
      { word: "thought-provoking", correct: true, explanation: "Making you think deeply — excellent for explaining why you enjoyed the film." },
      // distractors
      { word: "nitrogen",      correct: false, explanation: "A chemical element — a science term not relevant to movies." },
      { word: "stalagmite",    correct: false, explanation: "A rock formation in caves — belongs to travel/scenery topics." },
      { word: "tendon",        correct: false, explanation: "A body tissue — a health/biology term." },
      { word: "photovoltaic",  correct: false, explanation: "Relating to solar power — fits technology or environment topics." },
      { word: "archipelago",   correct: false, explanation: "A group of islands — a geography/travel term." },
    ]
  },

  // ─────────────────────────────────────────────
  //  17. Interesting Building
  // ─────────────────────────────────────────────
  {
    id: 17,
    title: "Interesting Building",
    prompt: `Describe an interesting building.\n\nYou should say:\n• Where it is\n• What it looks like\n• What function it has\n• And explain why you think it is interesting`,
    keywords: [
      { word: "architecture",  correct: true,  explanation: "The art of designing buildings — the core vocabulary for this topic." },
      { word: "facade",        correct: true,  explanation: "The front exterior of a building — specific architecture vocabulary." },
      { word: "structure",     correct: true,  explanation: "The way a building is built or organised — relevant to describing any building." },
      { word: "magnificent",   correct: true,  explanation: "Impressively beautiful — a strong adjective for a notable building." },
      { word: "heritage",      correct: true,  explanation: "Things passed down from the past — relevant for historic buildings." },
      { word: "landmark",      correct: true,  explanation: "An easily recognised building — perfectly describes a famous/interesting building." },
      { word: "contemporary",  correct: true,  explanation: "Belonging to the present — useful for describing modern architecture." },
      { word: "symmetrical",   correct: true,  explanation: "Having equal proportions on both sides — specific architectural description." },
      { word: "striking",      correct: true,  explanation: "Attracting attention by beauty — excellent adjective for an impressive building." },
      { word: "renovation",    correct: true,  explanation: "The process of repairing/improving a building — useful for discussing older buildings." },
      // distractors
      { word: "migraine",      correct: false, explanation: "A type of severe headache — a health term." },
      { word: "hibernate",     correct: false, explanation: "An animal behaviour — fits pets/animals topics." },
      { word: "dividend",      correct: false, explanation: "A financial return — belongs to money topics." },
      { word: "fermentation",  correct: false, explanation: "A chemical process in food/drink — not relevant to buildings." },
      { word: "camouflage",    correct: false, explanation: "A disguise technique — not relevant to architecture." },
    ]
  },

  // ─────────────────────────────────────────────
  //  18. Time You Used Your Imagination
  // ─────────────────────────────────────────────
  {
    id: 18,
    title: "Using Your Imagination",
    prompt: `Describe a time you needed to use your imagination.\n\nYou should say:\n• When it was\n• Why you needed to use imagination\n• How difficult or easy it was\n• And explain how you felt about it`,
    keywords: [
      { word: "visualise",     correct: true,  explanation: "To form a mental image of something — directly relates to using imagination." },
      { word: "creative",      correct: true,  explanation: "Involving the use of imagination — core adjective for this topic." },
      { word: "inventive",     correct: true,  explanation: "Having the ability to create new ideas — describes imaginative thinking." },
      { word: "scenario",      correct: true,  explanation: "An imagined sequence of events — useful for describing what you imagined." },
      { word: "inspiration",   correct: true,  explanation: "The process of being mentally stimulated — often triggers imagination." },
      { word: "conceptualise", correct: true,  explanation: "To form an idea in your mind — advanced vocabulary for using imagination." },
      { word: "abstract",      correct: true,  explanation: "Existing in thought rather than physical form — describes imaginative concepts." },
      { word: "brainstorm",    correct: true,  explanation: "To produce ideas spontaneously — a common way imagination is used." },
      { word: "envisage",      correct: true,  explanation: "To imagine or expect something in the future — formal word for imagining." },
      { word: "original",      correct: true,  explanation: "Not derivative — describes the output of imagination." },
      // distractors
      { word: "hydraulic",     correct: false, explanation: "Relating to water pressure — a mechanical/engineering term." },
      { word: "peninsula",     correct: false, explanation: "A piece of land surrounded by water — a geography term." },
      { word: "quarantine",    correct: false, explanation: "Isolation for health purposes — not relevant to imagination." },
      { word: "mortgage",      correct: false, explanation: "A property loan — fits money or home topics." },
      { word: "pollen",        correct: false, explanation: "A powdery substance from plants — fits nature/environment topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  19. Person Who Helps Others
  // ─────────────────────────────────────────────
  {
    id: 19,
    title: "Person Who Helps Others",
    prompt: `Describe a person who often helps others.\n\nYou should say:\n• Who this person is\n• How often he/she helps others\n• How/why he/she helps others\n• And how you feel about this person`,
    keywords: [
      { word: "compassionate", correct: true,  explanation: "Feeling concern for others' suffering — a key quality of someone who helps." },
      { word: "volunteer",     correct: true,  explanation: "To freely offer to do something — describes helping without being asked." },
      { word: "generous",      correct: true,  explanation: "Willing to give time or money — central quality for this topic." },
      { word: "selfless",      correct: true,  explanation: "Putting others' needs before your own — the essence of being helpful." },
      { word: "charitable",    correct: true,  explanation: "Giving to those in need — describes someone who regularly helps others." },
      { word: "supportive",    correct: true,  explanation: "Providing encouragement or assistance — natural adjective for a helpful person." },
      { word: "community",     correct: true,  explanation: "A group of people in an area — often the beneficiary of a helpful person's work." },
      { word: "considerate",   correct: true,  explanation: "Careful not to inconvenience others — describes the thoughtfulness of a helper." },
      { word: "dedicate",      correct: true,  explanation: "To commit time and effort to a cause — describes a person who regularly helps." },
      { word: "altruistic",    correct: true,  explanation: "Showing selfless concern for others — advanced vocabulary for this topic." },
      // distractors
      { word: "velocity",      correct: false, explanation: "Speed in a direction — a physics term." },
      { word: "biodiversity",  correct: false, explanation: "The variety of life in an area — an environment term." },
      { word: "amplifier",     correct: false, explanation: "A device that increases sound — fits music or technology topics." },
      { word: "lagoon",        correct: false, explanation: "A body of coastal water — fits travel or scenery topics." },
      { word: "syntax",        correct: false, explanation: "The arrangement of words in a sentence — a language/grammar term." },
    ]
  },

  // ─────────────────────────────────────────────
  //  20. Item That Cost More Than Expected
  // ─────────────────────────────────────────────
  {
    id: 20,
    title: "Expensive Unexpected Purchase",
    prompt: `Describe an item on which you spent more than expected.\n\nYou should say:\n• What it is\n• How much you spent on it\n• Why you bought it\n• And explain why you think you spent more than expected`,
    keywords: [
      { word: "impulse",       correct: true,  explanation: "A sudden desire — describes unplanned spending, very natural for this topic." },
      { word: "budget",        correct: true,  explanation: "A financial plan — directly relevant when you went over budget." },
      { word: "splurge",       correct: true,  explanation: "To spend money freely — colloquial but effective for this topic." },
      { word: "overpriced",    correct: true,  explanation: "Costing more than it is worth — useful for explaining the excess spending." },
      { word: "indulge",       correct: true,  explanation: "To allow yourself something pleasurable — explains treating yourself." },
      { word: "worthwhile",    correct: true,  explanation: "Worth the time or money spent — useful when justifying the purchase." },
      { word: "tempted",       correct: true,  explanation: "Feeling a desire for something — natural when explaining why you bought it." },
      { word: "premium",       correct: true,  explanation: "High quality, therefore more expensive — describes why the item cost more." },
      { word: "regret",        correct: true,  explanation: "Feeling sorry about something — a possible reaction to overspending." },
      { word: "transaction",   correct: true,  explanation: "An instance of buying or selling — formal vocabulary for the purchase." },
      // distractors
      { word: "predator",      correct: false, explanation: "An animal that hunts — fits animals or nature topics." },
      { word: "foliage",       correct: false, explanation: "Plant leaves — fits nature or scenery topics." },
      { word: "trilogy",       correct: false, explanation: "A set of three works — fits reading or movies topics." },
      { word: "chromosome",    correct: false, explanation: "A biological structure — a science term." },
      { word: "seismic",       correct: false, explanation: "Relating to earthquakes — a geography/science term." },
    ]
  },

  // ─────────────────────────────────────────────
  //  21. Encouraging Someone to Do Something
  // ─────────────────────────────────────────────
  {
    id: 21,
    title: "Encouraging Someone",
    prompt: `Describe a time when you encouraged someone to do something that he/she didn't want to do.\n\nYou should say:\n• Who he or she is\n• What you encouraged him/her to do\n• How he/she reacted\n• And explain why you encouraged him/her to do it`,
    keywords: [
      { word: "motivate",      correct: true,  explanation: "To give someone a reason to act — the core action of encouragement." },
      { word: "reluctant",     correct: true,  explanation: "Unwilling to do something — describes the person's initial attitude." },
      { word: "persuade",      correct: true,  explanation: "To cause someone to do something through reasoning — directly relevant." },
      { word: "hesitant",      correct: true,  explanation: "Slow to act due to uncertainty — describes the person's hesitation." },
      { word: "reassure",      correct: true,  explanation: "To remove doubt or fear — a key part of encouragement." },
      { word: "overcome",      correct: true,  explanation: "To succeed in dealing with a fear or obstacle — what you helped someone do." },
      { word: "confidence",    correct: true,  explanation: "Belief in one's ability — what encouragement helps build." },
      { word: "convince",      correct: true,  explanation: "To make someone believe or agree — describes the result of encouragement." },
      { word: "apprehensive",  correct: true,  explanation: "Anxious about the future — describes the person's feeling before being encouraged." },
      { word: "persistence",   correct: true,  explanation: "Continuing to try — needed when someone refuses to be encouraged at first." },
      // distractors
      { word: "telescope",     correct: false, explanation: "An optical instrument — belongs to science topics." },
      { word: "dune",          correct: false, explanation: "A hill of sand — fits travel or scenery topics." },
      { word: "bacteria",      correct: false, explanation: "Microscopic organisms — a biology/health term." },
      { word: "insulate",      correct: false, explanation: "To cover with material to prevent heat loss — belongs to building/home topics." },
      { word: "folklore",      correct: false, explanation: "Traditional stories and customs — fits culture or hometown topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  22. Short-Term Job Abroad
  // ─────────────────────────────────────────────
  {
    id: 22,
    title: "Short-Term Job Abroad",
    prompt: `Describe a short-term job you want to have in a foreign country.\n\nYou should say:\n• Where it is\n• How you know of it\n• What the job is\n• And explain why you want to do it`,
    keywords: [
      { word: "overseas",      correct: true,  explanation: "In or to a foreign country — directly relevant to working abroad." },
      { word: "cultural exchange", correct: true, explanation: "Sharing cultures between people of different backgrounds — a key reason for working abroad." },
      { word: "internship",    correct: true,  explanation: "A short-term work experience position — a common type of overseas job." },
      { word: "immerse",       correct: true,  explanation: "To involve yourself deeply in an experience — describes living in a new culture." },
      { word: "adaptability",  correct: true,  explanation: "The ability to adjust to new conditions — essential for working in a foreign country." },
      { word: "exposure",      correct: true,  explanation: "Experience of a wide range of things — a benefit of working abroad." },
      { word: "networking",    correct: true,  explanation: "Building professional relationships — a practical benefit of overseas work." },
      { word: "temporary",     correct: true,  explanation: "Lasting for a limited time — describes the nature of a short-term job." },
      { word: "fluency",       correct: true,  explanation: "The ability to speak a language easily — a motivation for working in another country." },
      { word: "broaden",       correct: true,  explanation: "To expand in scope — as in 'broaden your horizons' — natural for this topic." },
      // distractors
      { word: "hibernate",     correct: false, explanation: "An animal behaviour — fits pets/animals topics." },
      { word: "renaissance",   correct: false, explanation: "A historical cultural movement — fits history or building topics." },
      { word: "isotope",       correct: false, explanation: "A chemistry/physics term — not relevant to jobs." },
      { word: "stethoscope",   correct: false, explanation: "A medical instrument — not relevant to working abroad in general." },
      { word: "typography",    correct: false, explanation: "The art of arranging text — fits art or design topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  23. Person Who Cares for Nature
  // ─────────────────────────────────────────────
  {
    id: 23,
    title: "Person Who Cares for Nature",
    prompt: `Describe a person who likes to look after the natural world.\n\nYou should say:\n• Who this person is\n• What he or she does\n• How he or she does it\n• How often he or she does it\n• And explain how you feel about this person`,
    keywords: [
      { word: "conservation",  correct: true,  explanation: "The protection of natural environments — central vocabulary for this topic." },
      { word: "sustainable",   correct: true,  explanation: "Causing little or no damage to the environment — key quality of someone who cares for nature." },
      { word: "eco-friendly",  correct: true,  explanation: "Not harmful to the environment — describes the person's lifestyle choices." },
      { word: "biodiversity",  correct: true,  explanation: "The variety of plant and animal life — what a nature-lover tries to protect." },
      { word: "recycle",       correct: true,  explanation: "To convert waste into reusable material — a concrete action this person might take." },
      { word: "carbon footprint", correct: true, explanation: "The amount of carbon dioxide produced by a person — reducing it is a nature-care goal." },
      { word: "habitat",       correct: true,  explanation: "The natural home of a plant or animal — what nature lovers seek to protect." },
      { word: "environmentalist", correct: true, explanation: "A person who works to protect the environment — directly describes this topic." },
      { word: "reforestation", correct: true,  explanation: "Planting trees in deforested areas — a concrete nature-care activity." },
      { word: "mindful",       correct: true,  explanation: "Conscious and aware of one's impact — describes the attitude of a nature-carer." },
      // distractors
      { word: "auditorium",    correct: false, explanation: "A large room for performances — fits music or building topics." },
      { word: "mortgage",      correct: false, explanation: "A property loan — belongs to money or home topics." },
      { word: "chromosome",    correct: false, explanation: "A biological structure — a science term not related to nature care." },
      { word: "torque",        correct: false, explanation: "A rotational force — a physics/engineering term." },
      { word: "invoice",       correct: false, explanation: "A bill for payment — belongs to work or money topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  24. Interesting / Famous City
  // ─────────────────────────────────────────────
  {
    id: 24,
    title: "Interesting or Famous City",
    prompt: `Describe a city that you think is very interesting/famous.\n\nYou should say:\n• Where it is\n• What it is famous for\n• How you knew this city\n• And explain why you think it is very interesting/famous`,
    keywords: [
      { word: "cosmopolitan",  correct: true,  explanation: "Including people from many countries — a great adjective for a diverse, famous city." },
      { word: "iconic",        correct: true,  explanation: "Widely recognised and admired — perfect for describing a famous city's features." },
      { word: "bustling",      correct: true,  explanation: "Full of energetic activity — vivid word for a lively city." },
      { word: "metropolitan",  correct: true,  explanation: "Relating to a large city — formal vocabulary for discussing a major urban area." },
      { word: "vibrant",       correct: true,  explanation: "Full of energy and enthusiasm — describes a dynamic, exciting city." },
      { word: "diverse",       correct: true,  explanation: "Showing variety — describes a city with many cultures, foods, or architecture." },
      { word: "attraction",    correct: true,  explanation: "A place of interest — natural when discussing why a city is famous." },
      { word: "renowned",      correct: true,  explanation: "Famous and respected — describes a city's worldwide reputation." },
      { word: "skyline",       correct: true,  explanation: "The outline of a city against the sky — vivid visual vocabulary for a city topic." },
      { word: "tourism",       correct: true,  explanation: "The business of travel for pleasure — relevant to any famous city." },
      // distractors
      { word: "antibody",      correct: false, explanation: "A protein that fights infection — a biology/health term." },
      { word: "propeller",     correct: false, explanation: "A rotating device on aircraft — a transport/engineering term." },
      { word: "hibernate",     correct: false, explanation: "An animal behaviour — fits animals topics." },
      { word: "spreadsheet",   correct: false, explanation: "A data management tool — fits technology or work topics." },
      { word: "pollen",        correct: false, explanation: "A plant powder — fits nature topics." },
    ]
  },

  // ─────────────────────────────────────────────
  //  25. City You Enjoyed Visiting
  // ─────────────────────────────────────────────
  {
    id: 25,
    title: "City You Enjoyed Visiting",
    prompt: `Describe a city you enjoyed visiting.\n\nYou should say:\n• Where it is\n• When you visited it\n• How long you stayed there\n• What you did there\n• And explain why you enjoyed visiting it`,
    keywords: [
      { word: "immersed",      correct: true,  explanation: "Deeply involved in an experience — describes being absorbed in a new city." },
      { word: "cuisine",       correct: true,  explanation: "A style of cooking — experiencing local food is a key part of visiting a city." },
      { word: "wander",        correct: true,  explanation: "To walk without a fixed route — captures the relaxed exploration of a city." },
      { word: "captivating",   correct: true,  explanation: "Attracting and holding attention — strong adjective for a city you loved." },
      { word: "local",         correct: true,  explanation: "Belonging to a particular area — useful when describing what you discovered." },
      { word: "itinerary",     correct: true,  explanation: "A travel plan — relevant to describing how you organised your visit." },
      { word: "authentic",     correct: true,  explanation: "Genuine, not fake — describes real local culture you experienced." },
      { word: "architecture",  correct: true,  explanation: "The style of buildings — often a highlight of visiting a new city." },
      { word: "souvenir",      correct: true,  explanation: "An item bought to remember a trip — natural travel vocabulary." },
      { word: "memorable",     correct: true,  explanation: "Worth remembering — describes the overall experience of a great city visit." },
      // distractors
      { word: "dividend",      correct: false, explanation: "A financial term — belongs to money topics." },
      { word: "cumulonimbus",  correct: false, explanation: "A type of cloud — a weather/science term." },
      { word: "electrode",     correct: false, explanation: "An electrical conductor — a physics/engineering term." },
      { word: "antibody",      correct: false, explanation: "A health/biology term — not relevant to city visits." },
      { word: "hibernate",     correct: false, explanation: "An animal behaviour — fits animals topics." },
    ]
  }

]; // end of topics array


// ── Helper: get a shuffled subset of keywords for a round ──
// Takes a topic and desired count, returns a shuffled array
// with as many correct + distractor words as possible up to count.
function getKeywordsForRound(topic, count) {
  // topic.keywords contains ALL words (correct:true and correct:false distractors)
  const all = [...topic.keywords];
  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, Math.min(count, all.length));
}

// ── Helper: get a random topic that hasn't been played yet ──
function getNextTopic(playedIds) {
  const remaining = topics.filter(t => !playedIds.includes(t.id));
  if (remaining.length === 0) return null;
  return remaining[Math.floor(Math.random() * remaining.length)];
}