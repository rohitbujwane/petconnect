import { Pet } from '../models/types';

export interface MatchingCriteria {
  preferredSpecies?: string;
  breedPreference?: string;
  agePreference?: 'Puppy/Kitten' | 'Young' | 'Adult' | 'Senior' | 'Any';
  location?: string;
  livingEnvironment?: 'Apartment' | 'Independent House' | 'Villa' | 'Farmhouse';
  activityLevel?: 'Low' | 'Moderate' | 'High';
  experience?: 'First-time' | 'Intermediate' | 'Experienced';
  hasKids?: boolean;
  hasOtherPets?: boolean;
  workSchedule?: 'Work from home' | 'Hybrid' | 'Office full-time';
}

export interface FactorScore {
  name: string;
  score: number; // 0 - 100
  weight: number;
  description: string;
}

export interface MatchResult {
  pet: Pet;
  compatibilityScore: number; // 0 - 100
  summary: string;
  factors: FactorScore[];
}

export class AIMatchingService {
  public static calculateMatch(pet: Pet, criteria: MatchingCriteria): MatchResult {
    const factors: FactorScore[] = [];

    // 1. Species Match (Weight: 25)
    let speciesScore = 70;
    let speciesDesc = 'Species is open for matching';
    if (criteria.preferredSpecies && criteria.preferredSpecies !== 'Any') {
      if (pet.species.toLowerCase() === criteria.preferredSpecies.toLowerCase()) {
        speciesScore = 100;
        speciesDesc = `Exact match for preferred species (${pet.species})`;
      } else {
        speciesScore = 10;
        speciesDesc = `Pet is a ${pet.species}, differs from preferred ${criteria.preferredSpecies}`;
      }
    }
    factors.push({ name: 'Species Preference', score: speciesScore, weight: 0.25, description: speciesDesc });

    // 2. Activity & Lifestyle Compatibility (Weight: 20)
    let activityScore = 80;
    let activityDesc = 'Balanced activity alignment';
    if (criteria.activityLevel) {
      if (criteria.activityLevel === pet.activityLevel) {
        activityScore = 100;
        activityDesc = `Perfect activity match: Both your routine and ${pet.name} are ${pet.activityLevel} energy.`;
      } else if (
        (criteria.activityLevel === 'Moderate' && (pet.activityLevel === 'Low' || pet.activityLevel === 'High')) ||
        (criteria.activityLevel === 'High' && pet.activityLevel === 'Moderate')
      ) {
        activityScore = 75;
        activityDesc = `Compatible energy levels with manageable exercise adjustments.`;
      } else {
        activityScore = 40;
        activityDesc = `Noticeable energy difference: ${pet.name} has ${pet.activityLevel} energy while you requested ${criteria.activityLevel}.`;
      }
    }
    factors.push({ name: 'Activity Compatibility', score: activityScore, weight: 0.20, description: activityDesc });

    // 3. Living Environment & Home Space (Weight: 15)
    let homeScore = 85;
    let homeDesc = 'Suitable living quarters';
    if (criteria.livingEnvironment) {
      if (criteria.livingEnvironment === 'Apartment') {
        if (pet.size === 'Small' || pet.species === 'Cat' || pet.species === 'Rabbit' || pet.species === 'Bird') {
          homeScore = 95;
          homeDesc = `Excellent fit for an apartment space. ${pet.name}'s size and temperament adapt well.`;
        } else if (pet.size === 'Medium' && pet.activityLevel !== 'High') {
          homeScore = 80;
          homeDesc = `Apartment friendly with consistent daily walks.`;
        } else {
          homeScore = 55;
          homeDesc = `Large or high-energy pets in apartments require committed park visits and exercise.`;
        }
      } else {
        // Independent House / Villa / Farmhouse
        homeScore = 95;
        homeDesc = `Spacious home environment provides ample freedom for ${pet.name}.`;
      }
    }
    factors.push({ name: 'Living Space Fit', score: homeScore, weight: 0.15, description: homeDesc });

    // 4. Family & Kids / Pet Compatibility (Weight: 15)
    let familyScore = 90;
    let familyDesc = 'Great social temperament';
    if (criteria.hasKids && !pet.goodWithKids) {
      familyScore -= 40;
      familyDesc = `${pet.name} is recommended for households without young kids.`;
    }
    if (criteria.hasOtherPets && !pet.goodWithPets) {
      familyScore -= 40;
      familyDesc = `${pet.name} prefers being the only pet in the household.`;
    }
    if (criteria.hasKids && pet.goodWithKids && criteria.hasOtherPets && pet.goodWithPets) {
      familyScore = 100;
      familyDesc = `Super family-friendly! Certified gentle with children and other pets.`;
    }
    factors.push({ name: 'Family & Social Match', score: Math.max(20, familyScore), weight: 0.15, description: familyDesc });

    // 5. Experience Level Match (Weight: 15)
    let expScore = 85;
    let expDesc = 'Care difficulty aligns with applicant experience';
    if (criteria.experience === 'First-time') {
      if (pet.specialNeeds) {
        expScore = 45;
        expDesc = `Special medical needs require experienced pet parents.`;
      } else if (pet.activityLevel === 'High' && pet.size === 'Large') {
        expScore = 60;
        expDesc = `Large energetic breeds might be challenging for a first-time guardian.`;
      } else {
        expScore = 95;
        expDesc = `Ideal friendly, forgiving temperament for first-time adopters.`;
      }
    } else {
      expScore = 95;
      expDesc = `Applicant's prior pet experience ensures capable care for ${pet.name}.`;
    }
    factors.push({ name: 'Experience Compatibility', score: expScore, weight: 0.15, description: expDesc });

    // 6. Location Match (Weight: 10)
    let locationScore = 75;
    let locDesc = `Available in ${pet.city}`;
    if (criteria.location && criteria.location.trim()) {
      if (pet.city.toLowerCase() === criteria.location.toLowerCase()) {
        locationScore = 100;
        locDesc = `Same city match (${pet.city}). In-person meetups and adoption trials are quick and easy.`;
      } else {
        locationScore = 60;
        locDesc = `Pet is located in ${pet.city}, travel or inter-city foster coordination may be needed.`;
      }
    }
    factors.push({ name: 'Location Proximity', score: locationScore, weight: 0.10, description: locDesc });

    // Calculate weighted total score
    let totalScore = factors.reduce((sum, f) => sum + (f.score * f.weight), 0);
    const roundedScore = Math.round(totalScore);

    // Summary generation
    let summary = '';
    if (roundedScore >= 85) {
      summary = `High compatibility (${roundedScore}%)! Your lifestyle, living space, and preferences strongly match ${pet.name}'s care and exercise profile.`;
    } else if (roundedScore >= 65) {
      summary = `Moderate compatibility (${roundedScore}%). ${pet.name} could be a good companion with minor schedule or living accommodations.`;
    } else {
      summary = `Lower compatibility (${roundedScore}%). There are key differences in energy requirements, space, or special care needs to consider.`;
    }

    return {
      pet,
      compatibilityScore: roundedScore,
      summary,
      factors
    };
  }

  public static rankPetsForAdopter(pets: Pet[], criteria: MatchingCriteria): MatchResult[] {
    const scored = pets
      .filter(p => p.adoptionStatus === 'Available')
      .map(p => this.calculateMatch(p, criteria));

    return scored.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}
