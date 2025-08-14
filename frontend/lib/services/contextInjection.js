class ContextInjectionService {
  constructor() {
    this.scientificFacts = [
      "Octopuses have three hearts and blue blood",
      "A single teaspoon of neutron star matter would weigh 6 billion tons",
      "Trees communicate through underground fungal networks called mycorrhizae",
      "The human brain contains approximately 86 billion neurons",
      "Time moves slower in stronger gravitational fields",
      "Butterflies can see ultraviolet patterns on flowers invisible to humans",
      "The center of the Milky Way smells like raspberries and rum",
      "Bananas share 60% of their DNA with humans",
      "A group of ravens is called a conspiracy",
      "Lightning creates temperatures 5 times hotter than the sun's surface",
      "The human eye can distinguish 10 million different colors",
      "Honey never spoils - 3000-year-old honey is still edible",
      "A single cloud can weigh more than a million pounds",
      "The shortest war in history lasted 38-45 minutes",
      "Whales sing songs that can travel thousands of miles underwater",
      "Dolphins have names for each other and call to specific individuals",
      "There are more bacterial cells in your body than human cells",
      "A group of flamingos is called a flamboyance",
      "Sharks existed before Saturn's rings formed",
      "The heart of a blue whale is the size of a small car",
      "Crows can hold grudges for generations and teach them to their offspring",
      "A photon takes 170,000 years to travel from the sun's core to its surface",
      "The probability of you existing is essentially zero, yet here you are",
      "Mushrooms are more closely related to humans than to plants",
      "The sound of a cracking whip is actually a sonic boom",
      "Water bears (tardigrades) can survive in the vacuum of space",
      "The longest living organisms on Earth are 80,000-year-old fungi",
      "Your stomach gets an entirely new lining every 3-4 days",
      "A single raindrop can contain up to a million bacteria",
      "The universe is expanding faster than the speed of light"
    ];

    this.historicalWisdom = [
      "Marcus Aurelius wrote 'You have power over your mind - not outside events'",
      "Lao Tzu taught that the journey of a thousand miles begins with one step",
      "Rumi said 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself'",
      "The Oracle at Delphi proclaimed 'Know thyself' as the highest wisdom",
      "Confucius believed that real knowledge is knowing the extent of one's ignorance",
      "Maya Angelou observed that 'There is no greater agony than bearing an untold story inside you'",
      "Einstein noted that 'Imagination is more important than knowledge'",
      "The Buddha taught that pain is inevitable, but suffering is optional",
      "Socrates claimed that 'The unexamined life is not worth living'",
      "Gandhi said 'Be the change you wish to see in the world'",
      "Virginia Woolf wrote 'For most of history, Anonymous was a woman'",
      "Nelson Mandela learned that 'There is no passion to be found playing small'",
      "Ancient Egyptian wisdom: 'The best and shortest road towards knowledge of truth is Nature'",
      "Cherokee proverb: 'When you were born, you cried and the world rejoiced. Live your life so that when you die, the world cries and you rejoice'",
      "African proverb: 'If you want to go fast, go alone. If you want to go far, go together'",
      "Heraclitus declared that 'No man ever steps in the same river twice'",
      "Sun Tzu advised that 'The supreme excellence is to subdue the enemy without fighting'",
      "Aristotle taught that 'We are what we repeatedly do. Excellence is not an act, but a habit'",
      "Leonardo da Vinci observed that 'Simplicity is the ultimate sophistication'",
      "Ibn Khaldun noted that 'History is a mirror of the past and a lesson for the present'",
      "Hildegard of Bingen wrote 'All nature is at the disposal of humankind. We are to work with it'",
      "Seneca advised that 'It is not that we have a short time to live, but that we waste a lot of it'",
      "Al-Ghazali taught that 'Knowledge without action is vanity, and action without knowledge is insanity'",
      "Thich Nhat Hanh said 'Thanks to impermanence, everything is possible'",
      "Persian wisdom: 'Trust in God, but tie your camel'",
      "Japanese principle: 'Fall down seven times, stand up eight'",
      "Nordic saying: 'Fear less, hope more; eat less, chew more; whine less, breathe more'",
      "Aztec proverb: 'We did not inherit this land from our ancestors; we borrowed it from our children'",
      "Sufi wisdom: 'When you do things from your soul, you feel a river moving in you'",
      "Ancient Chinese: 'The best time to plant a tree was 20 years ago. The second best time is now'"
    ];

    this.mythologicalReferences = [
      "Pandora's box reminds us that hope always remains, even after all troubles escape",
      "The Phoenix rises from its own ashes, symbolizing renewal and rebirth",
      "Sisyphus teaches us to find meaning in the struggle itself",
      "The labyrinth of Crete holds both the monster and the path to freedom",
      "Persephone's journey between worlds speaks to the cycles of loss and return",
      "Atlas carries the weight of the heavens, showing strength in responsibility",
      "The Norse concept of Wyrd suggests that fate is woven from our choices",
      "Anansi the spider-trickster teaches that wisdom often comes through cunning and humor",
      "The Hindu concept of Maya reveals that reality is more mysterious than it appears",
      "Celtic druids believed that wisdom grows at the intersection of three realms",
      "Japanese folklore speaks of the kitsune, whose wisdom increases with each tail",
      "The Aboriginal Dreamtime suggests that all time exists simultaneously",
      "Norse Ragnarok promises that endings make way for new beginnings",
      "The Greek Muses remind us that inspiration comes from beyond ourselves",
      "Chinese dragons represent the harmony between opposing forces",
      "Prometheus brought fire to humanity, showing that knowledge comes with responsibility",
      "The Egyptian phoenix-bird Bennu represents the soul's journey through death and rebirth",
      "Native American thunderbirds remind us that great power must serve the whole",
      "The Hindu Garuda teaches that devotion can overcome any obstacle",
      "Mesopotamian Gilgamesh learned that friendship makes us more than the sum of our parts",
      "The Celtic Salmon of Knowledge shows that wisdom often comes through patience",
      "Aztec Quetzalcoatl demonstrates that the greatest leaders serve rather than dominate",
      "Russian Baba Yaga proves that help often comes from unexpected sources",
      "African Yoruba Anansi stories teach that small cleverness can overcome great power",
      "Inuit tales of Sedna remind us that all life depends on respecting the natural world",
      "The Greek Odyssey shows that the journey home often leads us to discover who we really are",
      "Hindu Ramayana teaches that dharma requires difficult choices between competing goods",
      "The Norse World Tree Yggdrasil connects all realms, showing universal interconnection",
      "Polynesian Maui's deeds prove that even tricksters can reshape the world for good",
      "The Egyptian journey through the Duat reveals that transformation requires facing our shadows"
    ];

    this.modernInsights = [
      "Psychology reveals that we are the stories we tell ourselves",
      "Quantum mechanics suggests that observation changes reality",
      "Neuroscience shows that meditation physically reshapes the brain",
      "Sociology demonstrates that individual choices create collective patterns",
      "Environmental science teaches that everything is interconnected",
      "Anthropology reveals that culture shapes what seems 'natural'",
      "Linguistics shows that language influences thought",
      "Behavioral economics proves that humans are beautifully irrational",
      "Astronomy reminds us that we are made of star stuff",
      "Ecology teaches that diversity creates resilience",
      "Cognitive science reveals that memory is more creative than accurate",
      "Network theory shows that small changes can have massive effects",
      "Chaos theory proves that patterns emerge from apparent randomness",
      "Game theory demonstrates that cooperation often beats competition",
      "Systems thinking reveals that problems and solutions are connected",
      "Complexity science shows that emergence creates properties greater than the sum of parts",
      "Evolutionary biology teaches that adaptation is more important than perfection",
      "Information theory proves that uncertainty and information are intimately connected",
      "Thermodynamics reminds us that energy always flows toward equilibrium",
      "Computer science reveals that algorithms shape how we see the world",
      "Artificial intelligence shows that intelligence takes many forms",
      "Biomimetics teaches us that nature has already solved most design problems",
      "Robotics demonstrates that intelligence is embodied, not just computational",
      "Genetics reveals that identity is both fixed and fluid",
      "Epigenetics shows that environment can rewrite our genetic destiny",
      "Nanotechnology proves that the smallest changes can have the largest effects",
      "Cybernetics teaches that feedback loops govern all complex systems",
      "Fractal geometry shows that the same patterns repeat at every scale",
      "Statistical mechanics reveals that macroscopic laws emerge from microscopic chaos",
      "Social psychology demonstrates that context shapes character more than we think"
    ];

    this.randomTrivia = [
      "Cleopatra lived closer in time to the moon landing than to the building of the Great Pyramid",
      "Oxford University is older than the Aztec Empire",
      "Mammoths were still alive when the Great Pyramid was built",
      "The shortest commercial flight in the world lasts 90 seconds",
      "Sharks are older than trees",
      "There are more possible games of chess than atoms in the observable universe",
      "A group of pandas is called an embarrassment",
      "The unicorn is Scotland's national animal",
      "Lobsters were once considered peasant food",
      "The Great Wall of China isn't visible from space with the naked eye",
      "Bubble wrap was originally invented as wallpaper",
      "The longest recorded flight of a chicken is 13 seconds",
      "A jiffy is an actual unit of time - 1/100th of a second",
      "The dot over a lowercase 'i' or 'j' is called a tittle",
      "Bananas are berries, but strawberries aren't",
      "Napoleon was actually average height for his time period",
      "The lighter was invented before the match",
      "A group of owls is called a parliament",
      "The shortest place name in the world is 'Y' in France",
      "Wombat poop is cube-shaped",
      "The word 'set' has the most different meanings in English",
      "A group of pugs is called a grumble",
      "The Eiffel Tower can grow 6 inches during summer due to thermal expansion",
      "Carrots were originally purple",
      "The word 'alphabet' comes from the first two letters of the Greek alphabet: alpha and beta",
      "A group of jellyfish is called a smack",
      "The Vatican City has its own postal system and issues its own stamps",
      "Cashews grow attached to a fruit called a cashew apple",
      "The word 'serendipity' was coined by Horace Walpole in 1754",
      "A group of peacocks is called a muster"
    ];

    this.economicFacts = [
      "Adam Smith's 'invisible hand' suggests markets self-regulate through individual self-interest",
      "The Pareto Principle shows that 80% of effects come from 20% of causes",
      "Behavioral economics reveals that people consistently make predictably irrational choices",
      "Game theory proves that the best strategy often depends on what others choose",
      "The paradox of thrift shows that individual saving can harm collective prosperity",
      "Network effects mean that value increases exponentially with each additional user",
      "Compound interest is what Einstein allegedly called 'the eighth wonder of the world'",
      "The law of diminishing returns suggests that more isn't always better",
      "Opportunity cost reminds us that choosing one thing means giving up another",
      "Economic bubbles form when collective psychology overrides rational valuation",
      "The tragedy of the commons shows how individual rationality can lead to collective ruin",
      "Comparative advantage proves that everyone benefits when people specialize in their strengths",
      "Market failures occur when prices don't reflect true social costs and benefits",
      "The velocity of money shows that circulation creates more value than hoarding",
      "Externalities reveal that the true cost of actions extends beyond immediate participants",
      "Creative destruction shows that innovation requires the old to make way for the new",
      "The efficient market hypothesis suggests that asset prices reflect all available information",
      "Behavioral nudges can guide choices without restricting freedom",
      "The Phillips curve originally suggested an inverse relationship between unemployment and inflation",
      "Economic inequality follows power law distributions across most societies"
    ];

    this.artFacts = [
      "The golden ratio (1.618) appears repeatedly in art, from the Parthenon to da Vinci's works",
      "Rothko's color field paintings were designed to create transcendent emotional experiences",
      "The cave paintings at Lascaux are over 17,000 years old yet remarkably sophisticated",
      "Hokusai's 'Great Wave' was created using Prussian blue, a newly invented pigment",
      "Picasso's Blue Period was triggered by his friend's suicide and his own poverty",
      "The Mona Lisa has no eyebrows because it was fashionable to pluck them in Renaissance Italy",
      "Jackson Pollock's drip paintings follow fractal patterns found in nature",
      "Van Gogh sold only one painting during his lifetime but created 2,100 artworks",
      "The Venus de Milo's missing arms have inspired centuries of speculation about her pose",
      "Banksy's anonymity transforms public spaces into galleries and commentary into rebellion",
      "Islamic geometric art uses mathematical principles to represent infinite divine patterns",
      "Aboriginal dot paintings encode thousands of years of geographical and spiritual knowledge",
      "Impressionism emerged partly because tube paints allowed artists to work outdoors",
      "The Sistine Chapel's ceiling contains over 300 figures painted by Michelangelo",
      "Chinese calligraphy is considered the highest form of visual art in East Asian culture",
      "Frida Kahlo's self-portraits were painted while bedridden, using a mirror above her bed",
      "The Statue of Liberty's green color comes from copper oxidation, not original paint",
      "Andy Warhol's factory produced art as mass-produced consumer goods",
      "African masks were created for spiritual rituals, not aesthetic display",
      "The color ultramarine was once more valuable than gold and made from lapis lazuli"
    ];

    this.literatureFacts = [
      "Shakespeare invented over 1,700 words that we still use today, including 'eyeball' and 'lonely'",
      "The oldest known story is the Epic of Gilgamesh, written 4,000 years ago",
      "Jorge Luis Borges wrote stories about infinite libraries that predicted the internet",
      "Jane Austen's novels were originally published anonymously as 'By a Lady'",
      "The Great Gatsby was a commercial failure during Fitzgerald's lifetime",
      "Toni Morrison was the first African American woman to win the Nobel Prize in Literature",
      "Gabriel García Márquez's magical realism blends the fantastical with the mundane",
      "The Canterbury Tales captures 14th-century English in all its bawdy, irreverent glory",
      "Haiku's 5-7-5 syllable structure creates profound meaning through radical compression",
      "James Joyce's Ulysses recreates a single day in Dublin with stream-of-consciousness technique",
      "The Iliad and Odyssey were oral traditions for centuries before being written down",
      "Kafka's The Metamorphosis begins with a man waking up as a giant insect",
      "Virginia Woolf's writing experiments with time, consciousness, and narrative structure",
      "The 1001 Nights originated from Persian, Indian, and Arab storytelling traditions",
      "Cervantes's Don Quixote is considered the first modern novel",
      "Emily Dickinson wrote nearly 1,800 poems but published fewer than a dozen in her lifetime",
      "The Beat Generation writers revolutionized American literature through spontaneous prose",
      "Ancient Greek tragedies were performed wearing masks in outdoor amphitheaters",
      "The printing press made books affordable and literacy widespread for the first time",
      "Oral storytelling traditions preserved cultural knowledge for millennia before writing"
    ];

    this.mathFacts = [
      "There are more possible arrangements of a deck of cards than atoms on Earth",
      "The number pi is infinite, non-repeating, and contains every possible number sequence",
      "Zero was invented in India and revolutionized mathematics worldwide",
      "The Fibonacci sequence appears throughout nature, from flowers to galaxies",
      "Fractals reveal infinite complexity in finite space",
      "Gödel's incompleteness theorems prove that mathematics contains unprovable truths",
      "The four-color theorem states that any map needs only four colors to avoid adjacent duplicates",
      "Infinity comes in different sizes - some infinities are larger than others",
      "The Monty Hall problem shows that our intuition about probability is often wrong",
      "Euler's identity (e^iπ + 1 = 0) connects five fundamental mathematical constants",
      "The traveling salesman problem has no known efficient solution for large datasets",
      "Prime numbers become less common as numbers get larger but never disappear entirely",
      "Topology studies properties that remain unchanged when shapes are stretched or bent",
      "The butterfly effect shows how tiny mathematical changes can have enormous consequences",
      "Proof by contradiction reveals truth by assuming the opposite and finding impossibility",
      "The birthday paradox shows that 23 people have a 50% chance of sharing birthdays",
      "Game theory applies mathematical principles to strategic decision-making",
      "Chaos theory finds hidden patterns in seemingly random systems",
      "The normal distribution (bell curve) appears naturally in countless phenomena",
      "Mathematics is the universal language that describes physical reality"
    ];
  }

  generateContext(question, themes = [], persona = null) {
    console.log('Generating context with knowledge base sizes:', {
      scientific: this.scientificFacts.length,
      historical: this.historicalWisdom.length,
      mythological: this.mythologicalReferences.length,
      modern: this.modernInsights.length,
      trivia: this.randomTrivia.length,
      economic: this.economicFacts.length,
      art: this.artFacts.length,
      literature: this.literatureFacts.length,
      math: this.mathFacts.length
    });

    const context = {
      scientific: this.selectRandomItems(this.scientificFacts, 1),
      historical: this.selectRandomItems(this.historicalWisdom, 1),
      mythological: this.selectRandomItems(this.mythologicalReferences, 1),
      modern: this.selectRandomItems(this.modernInsights, 1),
      trivia: this.selectRandomItems(this.randomTrivia, 1),
      economic: this.selectRandomItems(this.economicFacts, 1),
      art: this.selectRandomItems(this.artFacts, 1),
      literature: this.selectRandomItems(this.literatureFacts, 1),
      math: this.selectRandomItems(this.mathFacts, 1)
    };

    console.log('Generated context sample:', {
      scientific: context.scientific[0]?.substring(0, 50) + '...',
      economic: context.economic[0]?.substring(0, 50) + '...',
      art: context.art[0]?.substring(0, 50) + '...',
    });

    if (themes.includes('spiritual')) {
      context.spiritual = this.selectRandomItems([
        ...this.mythologicalReferences.filter(ref => ref.includes('wisdom') || ref.includes('realm')),
        ...this.historicalWisdom.filter(wisdom => wisdom.includes('soul') || wisdom.includes('spirit'))
      ], 1);
    }

    if (themes.includes('love')) {
      context.love = this.selectRandomItems([
        "The neurochemistry of love involves dopamine, oxytocin, and serotonin",
        "Ancient Greeks identified six types of love, from eros to agape",
        "Prairie voles mate for life and comfort each other in distress"
      ], 1);
    }

    if (themes.includes('future')) {
      context.future = this.selectRandomItems([
        "Futurists predict that change will accelerate exponentially",
        "The ancient I Ching was designed to divine future possibilities",
        "Quantum mechanics suggests multiple futures exist simultaneously until observed"
      ], 1);
    }

    if (themes.includes('career') || themes.includes('money')) {
      context.economics_focused = this.selectRandomItems([
        "Economic networks create value through connection and exchange",
        "The most valuable assets are often intangible: trust, reputation, knowledge",
        "Markets are ultimately human systems driven by psychology and behavior"
      ], 1);
    }

    if (themes.includes('creative') || themes.includes('expression')) {
      context.art_focused = this.selectRandomItems([
        "Art transforms personal experience into universal truth",
        "Creativity emerges from the tension between constraint and freedom",
        "Every masterpiece began as someone's experiment with possibility"
      ], 1);
    }

    return context;
  }

  selectRandomItems(array, count = 1) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  formatContextForPrompt(context) {
    const contextStrings = [];
    
    for (const [category, items] of Object.entries(context)) {
      if (items && items.length > 0) {
        contextStrings.push(`${category}: ${items.join('; ')}`);
      }
    }
    
    return contextStrings.join('\n');
  }

  getRandomMetaphor(category = 'nature') {
    const metaphors = {
      nature: [
        "like a river finding its way",
        "as a seed containing potential",
        "like the moon in cycles",
        "as mountains standing firm",
        "like the returning tide"
      ],
      technology: [
        "like a network strengthening connections",
        "as code executing logic",
        "like a signal traveling instantly",
        "as data becoming wisdom",
        "like a backup preserving essence"
      ],
      cosmic: [
        "like stars in darkness",
        "as galaxies in spiral dance",
        "like light reaching waiting eyes",
        "as space bending around mystery",
        "like cosmic whispers of origin"
      ]
    };

    const categoryMetaphors = metaphors[category] || metaphors.nature;
    return categoryMetaphors[Math.floor(Math.random() * categoryMetaphors.length)];
  }
}

module.exports = { ContextInjectionService };