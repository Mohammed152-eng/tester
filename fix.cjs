const fs = require('fs');

let html = fs.readFileSync('temp-dezznuts/jeskojets.com/index.html', 'utf8');

const replacements = [
    { from: />Jesko Jets</g, to: ">MCQ Mate<" },
    { from: /"Jesko Jets"/g, to: '"MCQ Mate"' },
    { from: /Jesko Jets®/g, to: "MCQ Mate" },
    { from: /Jesko Jets/g, to: "MCQ Mate" },
    { from: /jeskojets\.com/g, to: "mcqmate.com" },
    { from: />\s*Private jet charter worldwide\s*</g, to: ">Cambridge IGCSE & A-Level MCQ Checker<" },
    { from: /Our aircraft are among the first to deliver clients to the most iconic international events\./g, to: "MCQ Mate is a multiple-choice question (MCQ) checker for Cambridge IGCSE and A-Level subjects." },
    { from: /Among DS Jets’ clients are some of the world’s leading companies in the nuclear industry, as well as in the oil and banking sectors\./g, to: "Easily access past papers and check your MCQ answers instantly." },
    { from: /Evgeny Demidenko/g, to: "ZiedDev" },
    { from: /We are movement\. We are distinction\. Your freedom to enjoy life\./g, to: "Instantly check your MCQ answers. Practice makes perfect." },
    { from: /Gulfstream/g, to: "Cambridge" },
    { from: /650ER/g, to: "Syllabus" },
    { from: />Features</g, to: ">Benefits<" },
    { from: />Private Jet Charter</g, to: ">Past Papers<" },
    { from: /info@jeskojets.com/g, to: "support@mcqmate.app" },
    { from: />We are movement</g, to: ">Master your exams<" },
    { from: />We are distinction</g, to: ">Check MCQ answers<" },
    { from: />Your <br\/>freedom to enjoy life</g, to: ">Instant <br/>feedback on answers<" },
    { from: /Every flight is designed around your comfort, time, and ambitions — so you can focus on what truly matters, while we take care of everything else\./g, to: "Every question is designed around your learning, time, and ambitions — so you can focus on mastering your subjects." },
    
    // Changing the button:
    { from: 'href="#about"', to: 'href="/app.html"' },
    { from: '>Scroll down<', to: '>Start Now<' },
    { from: />To start the journey</g, to: ">And boost your grades<" },
    { from: /MCQ Mate\s*<sup>®<\/sup> is a private aviation operator with over 5,000 missions completed across 150\+ countries\. From international executives to global industries, our clients trust us to deliver on time, every\s*time\./g, to: "MCQ Mate is an advanced multiple-choice question checker for Cambridge IGCSE and A-Level subjects. With instant feedback, students trust us to improve their grades and master past papers." },
    { from: />Global private aviation</g, to: ">Global exam preparation<" },

    // More features text:
    { from: />Direct Access to Private Travel</g, to: ">Direct Access to Past Papers<" },
    { from: /Fly beyond boundaries with MCQ Mate\. Our global operations ensure seamless, personalized travel experiences — from the first call to landing\. Every journey is tailored to your comfort, privacy, and schedule\./g, to: "Study beyond boundaries with MCQ Mate. Our platform ensures seamless, personalized practice experiences — from the first question to mastery. Every paper is tailored to your exam board and schedule." },
    
    { from: />Your Freedom to Enjoy Life</g, to: ">Your Freedom to Learn Faster<" },
    { from: /We value your time above all\. MCQ Mate gives you the freedom to live, work, and relax wherever life takes you — without compromise\./g, to: "We value your time above all. MCQ Mate gives you the freedom to study, practice, and learn wherever life takes you — without compromise." },

    { from: />Precision and Excellence</g, to: ">Accuracy and Excellence<" },
    { from: /Each detail of your flight — from route planning to in-flight service — reflects our dedication to perfection\. Our crew and fleet meet the highest global standards, ensuring reliability in every mission\./g, to: "Each detail of your practice — from question checking to score tracking — reflects our dedication to perfection. Our database meets the highest standards, ensuring reliability in every paper." },

    { from: />Global Reach, Personal Touch</g, to: ">Comprehensive Subjects<" },
    { from: /With access to destinations in over 150 countries, MCQ Mate brings the world closer to you\. Our experts manage every aspect of your flight, guaranteeing a smooth and effortless journey\./g, to: "With access to O-Level, A-Level, and IGCSE subjects, MCQ Mate brings the solutions closer to you. Our platform manages every aspect of your practice, guaranteeing a smooth and effortless journey." },

    { from: />Fly the Legacy</g, to: ">Ace the Exams<" },
    { from: />Fly in</g, to: ">Check in<" },
    { from: />Luxury <br\/>that moves with\s*you</g, to: ">Answers <br/>that move with you<" },
    { from: /Featuring wings designed to minimize anything that could disrupt its natural aerodynamic balance, and powered by high-thrust Rolls-Royce BR725 AI-12 engines, the\s*Cambridge G650 is engineered for exceptional range and top-end speed\./g, to: "Featuring an extensive database designed to minimize friction in finding answers, and powered by instant checking capabilities, MCQ Mate is engineered for exceptional practice and top grades." },

    // Spec overview
    { from: />Maximum operating range</g, to: ">Supported Subjects<" },
    { from: />11,263 km</g, to: ">50+ Subjects<" },
    { from: />Speed</g, to: ">Response Time<" },
    { from: />480 knots</g, to: ">Instant<" },
    { from: />Passenger capacity</g, to: ">Paper Capacity<" },
    { from: />Up to 12 seats \(\+1 cabin server\)</g, to: ">Thousands of past papers<" },
    { from: />Endurance</g, to: ">Availability<" },
    { from: />14 hrs \(Maximum for european based aircraft\)</g, to: ">24/7 Access<" },
    { from: />Baggage capacity</g, to: ">Supported Years<" },
    { from: />5\.52 m3</g, to: ">2010 - 2025<" },
    { from: />Cruising altitude</g, to: ">Accuracy<" },
    { from: />15,544 m</g, to: ">99.9%<" },
    { from: />Specification</g, to: ">Information<" },

    { from: />Cabin length</g, to: ">O-Level<" },
    { from: />14\.05 m2</g, to: ">Available<" },
    { from: />Cabin Width</g, to: ">A-Level<" },
    { from: />2\.49 m2</g, to: ">Available<" },
    { from: />Cabin Height</g, to: ">IGCSE<" },
    { from: />1\.92 m2</g, to: ">Available<" },

    { from: />Ultra-long-range Aircraft</g, to: ">Massive Question Bank<" },
    { from: /A true time-saving machine it brings Tokyo and New York an hour closer, and at 92% of the speed of sound, it can circle the globe with just a single stop\./g, to: "A true time-saving machine, it brings past papers and answers closer, and at lightning speed, you can grade your paper with just a single click." },
    
    { from: />A Better Way to Fly</g, to: ">A Better Way to Practice<" },
    { from: />Pets</g, to: ">Mobile Friendly<" },
    { from: /Traveling with pets on a private jet means comfort and peace of mind for both owners and their companions\. Our dedicated team ensures seamless arrangements, from documentation and safety to onboard care, so that your pet enjoys the same level of attention and luxury as you do\. Every detail is managed to create a stress-free and enjoyable journey for everyone on board\./g, to: "Practicing on your mobile device means comfort and peace of mind for students anywhere. Our dedicated platform ensures seamless display, from question diagrams to answer feedback, so that you enjoy the same level of attention and features as you do on desktop. Every detail is managed to create a stress-free and enjoyable journey for everyone." },
    { from: />24\/7 availability</g, to: ">Always Available<" },
    { from: /Our team is available around the clock to handle any request, no matter the time zone or urgency\. From last-minute flight arrangements to personalized services, we provide seamless support whenever you need it\. With us, assistance is never more than a call away\./g, to: "Our platform is online around the clock to handle any request, no matter the time zone or urgency. From last-minute exam prep to personalized tracking, we provide seamless support whenever you need it. With us, answers are never more than a click away." },
    { from: />Onboard services</g, to: ">Instant Feedback<" },
    { from: /Every flight is tailored with a range of personalized onboard services designed to elevate your journey\. From fine dining and curated entertainment to attentive crew and seamless connectivity, every detail is arranged to ensure maximum comfort and enjoyment in the air\./g, to: "Every session is tailored with a range of personalized features designed to elevate your learning. From detailed analytics and curated paper lists to instant feedback and seamless checking, every detail is arranged to ensure maximum effectiveness in your studies." },
    { from: />Efficient</g, to: ">Lightning Fast<" },
    { from: /Efficiency is at the core of every flight we operate\. From optimized routes and streamlined procedures to quick boarding and smooth ground handling, we make sure your time is always used wisely\. The result is a seamless journey that gets you where you need to be, faster and without compromise\./g, to: "Efficiency is at the core of every paper you check. From optimized searching and streamlined checking to quick loading and smooth navigation, we make sure your time is always used wisely. The result is a seamless journey that gets you the answers you need, faster and without compromise." },

    { from: /<img parallax="img" alt="Pets"/g, to: '<img parallax="img" alt="Mobile Friendly"' },
    { from: /<img parallax="img" alt="Onboard services"/g, to: '<img parallax="img" alt="Instant Feedback"' },
    { from: /Each journey reflects years of expertise, precision, and trust\. From last-minute charters to intercontinental business routes — MCQ Mate ensures safety, discretion, and excellence in every flight\./g, to: "Each test reflects years of expertise, precision, and trust. From last-minute cramming to comprehensive study sessions — MCQ Mate ensures accuracy, speed, and excellence in every check." },
    { from: />Our Fleet/ig, to: ">Features" },
    { from: />Advantages/ig, to: ">Benefits" },
    { from: />Global/ig, to: ">Subjects" },
    { from: />Private jet charter/ig, to: ">MCQ Checker" },
    { from: />Fly in Luxury</g, to: ">Practice with Ease<" },
    { from: />We are distinction</g, to: ">We are excellence<" },
    { from: />Your freedom to enjoy life</g, to: ">Your key to top grades<" },
    { from: />Fly beyond boundaries</g, to: ">Learn without limits<" },
];

let replaced = html;
for (const {from, to} of replacements) {
    replaced = replaced.replace(from, to);
}

fs.writeFileSync('index.html', replaced);
console.log('Script done');
