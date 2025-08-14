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
      "Whales sing songs that can travel thousands of miles underwater"
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
      "African proverb: 'If you want to go fast, go alone. If you want to go far, go together'"
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
      "Chinese dragons represent the harmony between opposing forces"
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
      "Systems thinking reveals that problems and solutions are connected"
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
      "Bananas are berries, but strawberries aren't"
    ];
  }

  generateContext(question, themes = [], persona = null) {
    const context = {
      scientific: this.selectRandomItems(this.scientificFacts, 1),
      historical: this.selectRandomItems(this.historicalWisdom, 1),
      mythological: this.selectRandomItems(this.mythologicalReferences, 1),
      modern: this.selectRandomItems(this.modernInsights, 1),
      trivia: this.selectRandomItems(this.randomTrivia, 1)
    };

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
        "like a river finding its way to the sea",
        "as a seed that contains the entire forest",
        "like the moon that waxes and wanes in perfect cycles",
        "as mountains that stand firm while clouds pass",
        "like the tide that retreats only to return stronger"
      ],
      technology: [
        "like a network where each connection strengthens the whole",
        "as code that executes in perfect logic",
        "like a signal that travels instantly across vast distances",
        "as data that becomes wisdom through processing",
        "like a backup that preserves what matters most"
      ],
      cosmic: [
        "like stars that shine brightest in the deepest darkness",
        "as galaxies that spiral in eternal dance",
        "like light that travels for eons to reach waiting eyes",
        "as black holes that bend space and time around their mystery",
        "like the cosmic background radiation that whispers the universe's origin story"
      ]
    };

    const categoryMetaphors = metaphors[category] || metaphors.nature;
    return categoryMetaphors[Math.floor(Math.random() * categoryMetaphors.length)];
  }
}

module.exports = { ContextInjectionService };