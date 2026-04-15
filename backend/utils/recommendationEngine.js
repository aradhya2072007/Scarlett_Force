/**
 * EventSphere Recommendation Engine
 * Scores events against a user's personality profile and returns ranked recommendations.
 */

// Tag → trait weight mappings
const TAG_TRAIT_WEIGHTS = {
  // social trait
  networking: { social: 1.0, analytical: 0.4 },
  music: { social: 0.8, creative: 0.8, energetic: 0.6 },
  festival: { social: 0.9, energetic: 0.8, outdoor: 0.6 },
  party: { social: 1.0, energetic: 0.9 },
  conference: { social: 0.5, analytical: 0.9, tech: 0.6 },

  // tech trait
  tech: { tech: 1.0, analytical: 0.7 },
  startup: { tech: 0.8, networking: 0.7, analytical: 0.6 },
  hackathon: { tech: 1.0, analytical: 0.9, competitive: 0.7 },
  ai: { tech: 1.0, analytical: 1.0 },
  coding: { tech: 1.0, analytical: 0.9 },
  gaming: { tech: 0.7, competitive: 0.8, energetic: 0.5 },
  science: { analytical: 1.0, tech: 0.6 },

  // creative trait
  art: { creative: 1.0, social: 0.4 },
  design: { creative: 0.9, analytical: 0.5 },
  film: { creative: 0.8, social: 0.5 },
  photography: { creative: 0.9, outdoor: 0.4 },
  dance: { creative: 0.8, energetic: 0.9, social: 0.7 },
  theater: { creative: 0.9, social: 0.6 },
  workshop: { creative: 0.7, analytical: 0.5 },

  // outdoor trait
  sports: { outdoor: 0.9, energetic: 1.0, competitive: 0.8 },
  adventure: { outdoor: 1.0, energetic: 0.9 },
  hiking: { outdoor: 1.0, energetic: 0.8 },
  marathon: { outdoor: 0.9, energetic: 1.0, competitive: 0.8 },
  yoga: { outdoor: 0.5, wellness: 1.0 },
  fitness: { outdoor: 0.5, energetic: 0.9 },

  // wellness trait
  wellness: { wellness: 1.0 },
  meditation: { wellness: 1.0 },
  food: { social: 0.6, creative: 0.4 },
  cooking: { creative: 0.7, social: 0.5 },
  education: { analytical: 0.8, tech: 0.3 },
};

// Trait intensity multipliers
const INTENSITY_MULTIPLIERS = {
  high: 1.0,
  medium: 0.55,
  low: 0.15,
};

/**
 * Score a single event against a personality profile.
 * @param {Object} event - Event document with tags[]
 * @param {Object} profile - User personality profile
 * @returns {number} Score (higher = better match)
 */
function scoreEvent(event, profile) {
  if (!profile || !event.tags || event.tags.length === 0) return 0;

  let totalScore = 0;

  for (const tag of event.tags) {
    const tagWeights = TAG_TRAIT_WEIGHTS[tag.toLowerCase()];
    if (!tagWeights) continue;

    for (const [trait, weight] of Object.entries(tagWeights)) {
      const userLevel = profile[trait];
      if (!userLevel) continue;
      const multiplier = INTENSITY_MULTIPLIERS[userLevel] || 0;
      totalScore += weight * multiplier;
    }
  }

  // Budget preference bonus
  if (profile.budget === 'free' && event.price === 0) totalScore += 0.5;
  if (profile.budget === 'paid' && event.price > 0) totalScore += 0.3;

  // Interest tag direct match bonus
  if (profile.interests && Array.isArray(profile.interests)) {
    for (const interest of profile.interests) {
      if (event.tags.includes(interest.toLowerCase())) {
        totalScore += 1.0;
      }
    }
  }

  return Math.round(totalScore * 100) / 100;
}

/**
 * Get ranked recommendations for a user.
 * @param {Array} events - Array of event documents
 * @param {Object} profile - User personality profile
 * @param {number} limit - Max results
 * @returns {Array} Events sorted by score, with score property added
 */
function getRecommendations(events, profile, limit = 20) {
  const scored = events.map((event) => ({
    ...event.toObject ? event.toObject() : event,
    recommendationScore: scoreEvent(event, profile),
  }));

  return scored
    .filter((e) => e.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
}

/**
 * Compute a personality profile from quiz answers.
 * @param {Array} answers - Array of { question, answer } objects
 * @returns {Object} Personality profile
 */
function computePersonalityFromQuiz(answers) {
  const profile = {
    social: 'medium',
    creative: 'medium',
    tech: 'medium',
    outdoor: 'medium',
    analytical: 'medium',
    energetic: 'medium',
    budget: 'any',
    preferredDays: ['weekend'],
    interests: [],
  };

  const scores = {
    social: 0, creative: 0, tech: 0, outdoor: 0, analytical: 0, energetic: 0,
  };
  let maxScore = 0;

  for (const { questionId, answer } of answers) {
    switch (questionId) {
      case 'social_pref':
        if (answer === 'large_crowd') { scores.social += 2; maxScore += 2; }
        else if (answer === 'small_group') { scores.social += 1; maxScore += 2; }
        else { maxScore += 2; }
        break;
      case 'environment':
        if (answer === 'outdoor') { scores.outdoor += 2; maxScore += 2; }
        else if (answer === 'both') { scores.outdoor += 1; maxScore += 2; }
        else { maxScore += 2; }
        break;
      case 'interests':
        // Multi-select — can have multiple
        const selected = Array.isArray(answer) ? answer : [answer];
        profile.interests = selected;
        for (const sel of selected) {
          if (sel === 'tech' || sel === 'coding') scores.tech += 1;
          if (sel === 'music' || sel === 'art' || sel === 'dance') scores.creative += 1;
          if (sel === 'sports' || sel === 'hiking') scores.outdoor += 1;
          if (sel === 'networking' || sel === 'conferences') scores.social += 1;
          if (sel === 'gaming' || sel === 'science') scores.analytical += 1;
        }
        maxScore += 2;
        break;
      case 'energy':
        if (answer === 'high') { scores.energetic += 2; maxScore += 2; }
        else if (answer === 'medium') { scores.energetic += 1; maxScore += 2; }
        else { maxScore += 2; }
        break;
      case 'schedule':
        profile.preferredDays = answer === 'weekday' ? ['weekday'] :
          answer === 'weekend' ? ['weekend'] : ['weekday', 'weekend'];
        break;
      case 'budget':
        profile.budget = answer; // 'free', 'paid', 'any'
        break;
      case 'personality_type':
        if (answer === 'creative') { scores.creative += 2; maxScore += 2; }
        else if (answer === 'analytical') { scores.analytical += 2; maxScore += 2; }
        else { scores.creative += 1; scores.analytical += 1; maxScore += 2; }
        break;
      case 'goal':
        if (answer === 'learn') { scores.analytical += 1; scores.tech += 0.5; maxScore += 2; }
        else if (answer === 'network') { scores.social += 2; maxScore += 2; }
        else if (answer === 'compete') { scores.energetic += 1.5; maxScore += 2; }
        else { scores.social += 0.5; maxScore += 2; }
        break;
    }
  }

  // Convert raw scores to high/medium/low
  const normalize = (score) => {
    if (score >= 1.5) return 'high';
    if (score >= 0.8) return 'medium';
    return 'low';
  };

  profile.social = normalize(scores.social);
  profile.creative = normalize(scores.creative);
  profile.tech = normalize(scores.tech);
  profile.outdoor = normalize(scores.outdoor);
  profile.analytical = normalize(scores.analytical);
  profile.energetic = normalize(scores.energetic);

  return profile;
}

module.exports = { scoreEvent, getRecommendations, computePersonalityFromQuiz };
