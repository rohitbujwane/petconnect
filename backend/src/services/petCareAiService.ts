export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  disclaimer?: string;
  category?: string;
}

export interface KnowledgeTopic {
  keywords: string[];
  title: string;
  category: string;
  response: string;
  followUpSuggestions: string[];
}

export class PetCareAIService {
  private static disclaimer = '⚠️ PetCare AI provides general educational information and does not replace professional veterinary advice. In life-threatening emergencies, immediately rush your pet to the nearest veterinary clinic.';

  private static knowledgeBase: KnowledgeTopic[] = [
    {
      keywords: ['feed', 'puppy', 'food', 'diet', 'nutrition', 'what to feed'],
      title: 'Puppy Feeding & Nutrition Guide',
      category: 'Nutrition',
      response: `Puppy nutrition varies by age and expected adult size:\n\n` +
        `• 0–4 Weeks: Mother's milk or specialized commercial canine milk replacer (KMR). Never cow's milk.\n` +
        `• 4–8 Weeks (Weaning): Starter puppy porridge mixed with lukewarm water or puppy milk formula.\n` +
        `• 2–6 Months: High-protein puppy kibble 3 to 4 times daily. Include clean boiled chicken, rice, pumpkin, or curd in moderation.\n` +
        `• 6–12 Months: Transition to 2 balanced meals per day.\n\n` +
        `🚫 Dangerous Foods: Chocolate, onions, garlic, raisins, grapes, cooked poultry bones, caffeine, and xylitol artificial sweetener. Always provide 24/7 access to fresh drinking water!`,
      followUpSuggestions: [
        'How often should I vaccinate my dog?',
        'How can I prepare my home for adoption?',
        'Can dogs eat curd and rice?'
      ]
    },
    {
      keywords: ['vaccine', 'vaccinate', 'vaccination', 'shots', 'rabies', 'schedule', 'dhpp'],
      title: 'Canine & Feline Vaccination Protocol',
      category: 'Preventive Healthcare',
      response: `Core Vaccination Schedule for Dogs:\n\n` +
        `1. 6–8 Weeks: First DHPPiL (Distemper, Hepatitis, Parvovirus, Parainfluenza, Leptospirosis).\n` +
        `2. 10–12 Weeks: DHPPiL Booster + Corona vaccine (if recommended by vet).\n` +
        `3. 14–16 Weeks: Third DHPPiL booster + Anti-Rabies Vaccine (ARV).\n` +
        `4. Annual: Yearly DHPPiL and Anti-Rabies boosters are mandatory by law.\n\n` +
        `Core Schedule for Cats:\n` +
        `• 8–9 Weeks: FVRCP / Tricat (Rhinotracheitis, Calicivirus, Panleukopenia).\n` +
        `• 12 Weeks: FVRCP Booster + Anti-Rabies.\n` +
        `• Annual: FVRCP & Rabies yearly booster.\n\n` +
        `Always have a licensed veterinarian record batch stickers in your pet's official health card.`,
      followUpSuggestions: [
        'Book an appointment with a verified vet',
        'What should I feed my puppy?',
        'My cat is not eating, what should I do?'
      ]
    },
    {
      keywords: ['not eating', 'refusing food', 'loss of appetite', 'anorexia', 'vomit', 'lethargic', 'cat not eating'],
      title: 'Pet Inappetence & Lethargy Advice',
      category: 'Health & First Aid',
      response: `Loss of appetite can indicate minor stress or serious medical illness:\n\n` +
        `🚨 RED FLAGS (Require Immediate Vet Visit):\n` +
        `• In cats: Not eating for >24 hours risks Hepatic Lipidosis (acute fatty liver disease).\n` +
        `• Persistent vomiting, watery diarrhea, blood in stool, or extreme fever/hypothermia.\n` +
        `• Heavy panting, pale white gums, or inability to stand.\n\n` +
        `🩺 At-Home Gentle Steps (if pet is otherwise alert):\n` +
        `1. Slightly warm wet food or plain boiled chicken broth to heighten scent.\n` +
        `2. Check mouth for foreign bones, bad teeth, or mouth ulcers.\n` +
        `3. Verify if pet drank water and check for dehydration (gently tent neck skin).\n` +
        `If no improvement within 12–24 hours, take your pet to a registered veterinarian.`,
      followUpSuggestions: [
        'Book an appointment with Dr. Rajesh Sharma or Dr. Ananya Deshmukh',
        'How can I prepare my home for adoption?',
        'What should I do if I find an injured animal?'
      ]
    },
    {
      keywords: ['prepare', 'adoption', 'home', 'adopt', 'arrival', 'puppy proof', 'new pet'],
      title: 'Preparing Your Home For Pet Adoption',
      category: 'Adoption Preparation',
      response: `Congratulations on welcoming a rescued friend! Here is your adoption checklist:\n\n` +
        `1. Pet-Proofing Your Home: Hide electrical cables, lock away household cleaning detergents, secure balcony netting/grills, and remove toxic indoor plants (lilies, poinsettias, dieffenbachia).\n` +
        `2. Essential Supplies: Stainless steel food & water bowls, age-appropriate food, collar with ID tag, 6-ft leash, cozy bed or crate, chew toys, litter box + litter (for cats).\n` +
        `3. The 3-3-3 Rule:\n` +
        `   • First 3 Days: Pet feels overwhelmed, nervous, and may hide or refuse food.\n` +
        `   • First 3 Weeks: Begins settling, learning routines, and showing true personality.\n` +
        `   • First 3 Months: Completely trusts you, feels secure, and bonds deeply.\n` +
        `4. Set up an initial vet wellness exam within the first 48 hours.`,
      followUpSuggestions: [
        'Browse available pets on Pet Connect',
        'Find a nearby veterinarian',
        'How often should I vaccinate my dog?'
      ]
    },
    {
      keywords: ['injured', 'rescue', 'accident', 'bleeding', 'hit by car', 'emergency', 'stray animal', 'find animal'],
      title: 'Emergency Protocol For Injured Stray Animals',
      category: 'Rescue & First Aid',
      response: `Follow these crucial safety steps when assisting an injured animal:\n\n` +
        `1. Ensure Personal Safety: Frightened injured animals may bite reflexively. Approach calmly and talk in a soft voice.\n` +
        `2. Gentle Muzzling: For conscious dogs, use a cloth strip or gauze to gently secure the muzzle (never muzzle if vomiting or struggling for breath).\n` +
        `3. Stop Active Bleeding: Apply firm, gentle pressure with a clean cloth or sterile gauze pad for 3–5 minutes.\n` +
        `4. Spinal & Bone Injuries: Do not bend the spine. Slide a flat wooden board, stiff cardboard, or thick blanket underneath to lift the animal like a stretcher.\n` +
        `5. Report on Pet Connect: Use our 'Report Animal in Need' feature immediately with precise GPS location and photo to alert on-duty volunteers and ambulances!`,
      followUpSuggestions: [
        'Report Animal in Need now',
        'Call local NGO / Rescue Helpline',
        'What should I feed my puppy?'
      ]
    },
    {
      keywords: ['deworm', 'deworming', 'worms', 'parasite', 'ticks', 'fleas'],
      title: 'Deworming & Parasite Control',
      category: 'Preventive Healthcare',
      response: `Intestinal worms and ectoparasites drain vital nutrients:\n\n` +
        `• Puppies & Kittens: Deworm every 2 weeks until 3 months of age, then monthly until 6 months.\n` +
        `• Adult Dogs & Cats: Deworm every 3 months using veterinary broad-spectrum tablets (e.g., Praziquantel + Pyrantel pamoate).\n` +
        `• Ticks & Fleas: Use topical spot-on pipettes or oral chewables (e.g., Bravecto, Simparica, Revolution) especially during warm, humid months.\n` +
        `⚠️ Never use dog tick treatments on cats, as permethrins are fatal to feline nervous systems!`,
      followUpSuggestions: [
        'How often should I vaccinate my dog?',
        'Book an appointment with a vet',
        'What should I feed my puppy?'
      ]
    }
  ];

  public static async answerQuestion(userQuery: string): Promise<ChatMessage> {
    const query = userQuery.toLowerCase().trim();

    let bestMatch: KnowledgeTopic | null = null;
    let highestScore = 0;

    for (const topic of this.knowledgeBase) {
      let score = 0;
      for (const kw of topic.keywords) {
        if (query.includes(kw)) {
          score += 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = topic;
      }
    }

    if (bestMatch && highestScore > 0) {
      return {
        id: `chat-${Date.now()}`,
        sender: 'assistant',
        text: `### ${bestMatch.title}\n\n${bestMatch.response}`,
        timestamp: new Date().toISOString(),
        suggestions: bestMatch.followUpSuggestions,
        disclaimer: this.disclaimer,
        category: bestMatch.category
      };
    }

    // Contextual fallback response
    return {
      id: `chat-${Date.now()}`,
      sender: 'assistant',
      text: `Thank you for consulting PetCare AI regarding: "${userQuery}".\n\n` +
        `For specific veterinary conditions, our verified veterinarians on Pet Connect can examine your pet, review laboratory diagnostics, and prescribe appropriate medication.\n\n` +
        `Here are reliable pet care principles:\n` +
        `• Keep your pet hydrated with clean water at all times.\n` +
        `• Monitor changes in behavior, temperature, water intake, urination, and stool quality.\n` +
        `• Avoid human medications like Paracetamol (Crocin), Ibuprofen, or Aspirin, which are toxic and lethal to dogs and cats.\n\n` +
        `You can also browse our Veterinarian Directory or connect directly with our partner NGOs!`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'What should I feed my puppy?',
        'How often should I vaccinate my dog?',
        'My cat is not eating.',
        'What should I do if I find an injured animal?'
      ],
      disclaimer: this.disclaimer,
      category: 'General Guidance'
    };
  }
}
