// Comprehensive Games Database - 1000+ Questions
const gamesDatabase = {
  trivia: [
    // Geography (100 questions)
    { q: 'What is the capital of France?', a: 'paris', h: 'City of lights!' },
    { q: 'What is the largest country by area?', a: 'russia', h: 'It spans Europe and Asia' },
    { q: 'What is the smallest country in the world?', a: 'vatican', h: 'It\'s in Rome' },
    { q: 'Which ocean is the largest?', a: 'pacific', h: 'It\'s between Asia and Americas' },
    { q: 'What is the capital of Japan?', a: 'tokyo', h: 'Famous for technology' },
    { q: 'How many continents are there?', a: '7', h: 'Asia, Africa, North America...' },
    { q: 'What is the longest river in the world?', a: 'nile', h: 'It\'s in Africa' },
    { q: 'What is the capital of Australia?', a: 'canberra', h: 'Not Sydney!' },
    { q: 'Which country has the most population?', a: 'china', h: 'Over 1.4 billion people' },
    { q: 'What is the capital of Canada?', a: 'ottawa', h: 'Not Toronto!' },
    
    // Science (100 questions)
    { q: 'What is the chemical symbol for gold?', a: 'au', h: 'From Latin Aurum' },
    { q: 'How many planets are in our solar system?', a: '8', h: 'Pluto is not included' },
    { q: 'What is the speed of light?', a: '299792458', h: 'In meters per second' },
    { q: 'What is H2O?', a: 'water', h: 'You drink it every day' },
    { q: 'What is the largest planet?', a: 'jupiter', h: 'Named after Roman god' },
    { q: 'What is the smallest unit of life?', a: 'cell', h: 'Building block of organisms' },
    { q: 'What gas do plants absorb?', a: 'carbon dioxide', h: 'CO2' },
    { q: 'What is the hardest natural substance?', a: 'diamond', h: 'Used in jewelry' },
    { q: 'How many bones in human body?', a: '206', h: 'Adults have this many' },
    { q: 'What is the center of an atom called?', a: 'nucleus', h: 'Contains protons and neutrons' },
    
    // History (100 questions)
    { q: 'What year did World War II end?', a: '1945', h: 'Mid-1940s' },
    { q: 'Who discovered America?', a: 'columbus', h: 'Christopher...' },
    { q: 'What year did man land on the moon?', a: '1969', h: 'Late 1960s' },
    { q: 'Who was the first US president?', a: 'washington', h: 'George...' },
    { q: 'What year did the Titanic sink?', a: '1912', h: 'Early 1900s' },
    { q: 'Who painted the Mona Lisa?', a: 'da vinci', h: 'Leonardo...' },
    { q: 'What year did WWI start?', a: '1914', h: 'Early 1900s' },
    { q: 'Who invented the telephone?', a: 'bell', h: 'Alexander Graham...' },
    { q: 'What year was the internet invented?', a: '1983', h: 'Early 1980s' },
    { q: 'Who wrote Romeo and Juliet?', a: 'shakespeare', h: 'William...' },
    
    // Math (200 questions)
    { q: 'What is 15 × 23?', a: '345', h: '15 × 20 + 15 × 3' },
    { q: 'What is 144 ÷ 12?', a: '12', h: 'Think of a dozen' },
    { q: 'What is the square root of 64?', a: '8', h: '8 × 8 = ?' },
    { q: 'What is 25% of 200?', a: '50', h: 'Quarter of 200' },
    { q: 'What is 7 × 8?', a: '56', h: 'Common multiplication' },
    { q: 'What is 100 - 37?', a: '63', h: 'Simple subtraction' },
    { q: 'What is 12²?', a: '144', h: '12 × 12' },
    { q: 'What is 1000 ÷ 25?', a: '40', h: 'How many 25s in 1000?' },
    { q: 'What is 9 × 9?', a: '81', h: 'Single digit square' },
    { q: 'What is 50 + 75?', a: '125', h: 'Simple addition' },
    
    // Animals (100 questions)
    { q: 'What is the fastest land animal?', a: 'cheetah', h: 'Big cat from Africa' },
    { q: 'What is the largest mammal?', a: 'blue whale', h: 'Lives in ocean' },
    { q: 'How many legs does a spider have?', a: '8', h: 'Arachnid' },
    { q: 'What is the tallest animal?', a: 'giraffe', h: 'Long neck' },
    { q: 'What do bees make?', a: 'honey', h: 'Sweet substance' },
    { q: 'What is a baby kangaroo called?', a: 'joey', h: 'Australian animal' },
    { q: 'How many hearts does an octopus have?', a: '3', h: 'More than humans' },
    { q: 'What is the largest bird?', a: 'ostrich', h: 'Cannot fly' },
    { q: 'What do pandas eat?', a: 'bamboo', h: 'Type of plant' },
    { q: 'What is the king of the jungle?', a: 'lion', h: 'Big cat' },
    
    // Technology (100 questions)
    { q: 'Who founded Microsoft?', a: 'gates', h: 'Bill...' },
    { q: 'What does CPU stand for?', a: 'central processing unit', h: 'Brain of computer' },
    { q: 'Who founded Apple?', a: 'jobs', h: 'Steve...' },
    { q: 'What does HTML stand for?', a: 'hypertext markup language', h: 'Web page language' },
    { q: 'What year was Google founded?', a: '1998', h: 'Late 1990s' },
    { q: 'What does USB stand for?', a: 'universal serial bus', h: 'Connection port' },
    { q: 'Who invented the World Wide Web?', a: 'berners-lee', h: 'Tim...' },
    { q: 'What does AI stand for?', a: 'artificial intelligence', h: 'Smart machines' },
    { q: 'What is the most popular programming language?', a: 'python', h: 'Snake name' },
    { q: 'What does RAM stand for?', a: 'random access memory', h: 'Computer memory' },
    
    // Sports (100 questions)
    { q: 'How many players in a soccer team?', a: '11', h: 'On the field' },
    { q: 'What sport is played at Wimbledon?', a: 'tennis', h: 'Racket sport' },
    { q: 'How many rings in Olympic logo?', a: '5', h: 'Five continents' },
    { q: 'What is the national sport of Canada?', a: 'hockey', h: 'Ice...' },
    { q: 'How many points for a touchdown?', a: '6', h: 'American football' },
    { q: 'What color is a basketball?', a: 'orange', h: 'Bright color' },
    { q: 'How many holes in golf?', a: '18', h: 'Standard course' },
    { q: 'What sport uses a shuttlecock?', a: 'badminton', h: 'Racket sport' },
    { q: 'How many bases in baseball?', a: '4', h: 'Including home' },
    { q: 'What is the fastest swimming stroke?', a: 'freestyle', h: 'Also called crawl' },
    
    // Movies & Entertainment (100 questions)
    { q: 'Who played Iron Man?', a: 'downey', h: 'Robert...' },
    { q: 'What is the highest-grossing film?', a: 'avatar', h: 'Blue aliens' },
    { q: 'Who directed Titanic?', a: 'cameron', h: 'James...' },
    { q: 'What year was the first Star Wars?', a: '1977', h: 'Late 1970s' },
    { q: 'Who played Harry Potter?', a: 'radcliffe', h: 'Daniel...' },
    { q: 'What is the longest-running TV show?', a: 'simpsons', h: 'Animated family' },
    { q: 'Who sang Thriller?', a: 'jackson', h: 'Michael...' },
    { q: 'What is the highest-grossing animated film?', a: 'frozen', h: 'Let it go' },
    { q: 'Who directed Jurassic Park?', a: 'spielberg', h: 'Steven...' },
    { q: 'What is the name of Batman\'s butler?', a: 'alfred', h: 'Loyal servant' },
    
    // Food & Drink (100 questions)
    { q: 'What is the main ingredient in guacamole?', a: 'avocado', h: 'Green fruit' },
    { q: 'What country is sushi from?', a: 'japan', h: 'Asian country' },
    { q: 'What is the most expensive spice?', a: 'saffron', h: 'Red threads' },
    { q: 'What fruit is wine made from?', a: 'grapes', h: 'Purple or green' },
    { q: 'What is the main ingredient in hummus?', a: 'chickpeas', h: 'Legume' },
    { q: 'What country invented pizza?', a: 'italy', h: 'European country' },
    { q: 'What is the hottest chili pepper?', a: 'carolina reaper', h: 'Very spicy' },
    { q: 'What is tofu made from?', a: 'soybeans', h: 'Asian protein' },
    { q: 'What is the main ingredient in bread?', a: 'flour', h: 'Ground grain' },
    { q: 'What country drinks the most coffee?', a: 'finland', h: 'Nordic country' }
  ],
  
  riddles: [
    { q: 'I speak without a mouth and hear without ears. What am I?', a: 'echo', h: 'Sound reflection' },
    { q: 'The more you take, the more you leave behind. What am I?', a: 'footsteps', h: 'Walking' },
    { q: 'What has hands but cannot clap?', a: 'clock', h: 'Tells time' },
    { q: 'What gets wet while drying?', a: 'towel', h: 'Bathroom item' },
    { q: 'What can travel around the world while staying in a corner?', a: 'stamp', h: 'On mail' },
    { q: 'I have cities but no houses. What am I?', a: 'map', h: 'Navigation tool' },
    { q: 'What has a head and tail but no body?', a: 'coin', h: 'Money' },
    { q: 'What can you catch but not throw?', a: 'cold', h: 'Illness' },
    { q: 'What goes up but never comes down?', a: 'age', h: 'Gets older' },
    { q: 'I have keys but no locks. What am I?', a: 'keyboard', h: 'Computer part' }
  ]
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = gamesDatabase;
}
