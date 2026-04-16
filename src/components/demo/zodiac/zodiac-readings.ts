export type ZodiacReading = {
  name: string;
  dates: string;
  tagline: string;
  personality: string;
  traits: string[];
  loveLife: string;
  bestWith: string[];
  growWith: string[];
};

export const ZODIAC_READINGS: Record<number, ZodiacReading> = {
  0: {
    name: "Aries",
    dates: "Mar 21 – Apr 19",
    tagline: "Fire starter · cardinal courage",
    personality:
      "You move toward life head-on. Honest impulse, quick starts, and a need to feel alive drive most of what you do—you’d rather try and adjust than wait for perfect conditions.",
    traits: [
      "Direct and brave in conflict",
      "Energized by new challenges",
      "Impatient with endless deliberation",
    ],
    loveLife:
      "You fall in fast when someone matches your heat. You need play, honesty, and space to pursue your own quests. Slow burns work only if the spark never dies.",
    bestWith: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    growWith: ["Libra", "Cancer", "Capricorn"],
  },
  30: {
    name: "Taurus",
    dates: "Apr 20 – May 20",
    tagline: "Earth anchor · sensual steadiness",
    personality:
      "You build security through consistency, beauty, and trust. Once committed, you’re loyal and grounding; you show love through presence, patience, and tangible care.",
    traits: [
      "Reliable and devoted",
      "Strong aesthetic and comfort sense",
      "Slow to anger, slow to forgive",
    ],
    loveLife:
      "Touch, loyalty, and calm rituals matter. You want a partner who doesn’t rush intimacy and who respects your pace and your need for stability.",
    bestWith: ["Virgo", "Capricorn", "Cancer", "Pisces"],
    growWith: ["Scorpio", "Aquarius", "Leo"],
  },
  60: {
    name: "Gemini",
    dates: "May 21 – Jun 20",
    tagline: "Air messenger · curious mind",
    personality:
      "Meaning comes from connection, language, and ideas. You adapt quickly, see many sides, and stay young through learning—but depth can feel like a discipline, not a default.",
    traits: [
      "Witty, social, mentally quick",
      "Easily bored without variety",
      "Charmer with a thousand tabs open",
    ],
    loveLife:
      "Conversation is foreplay. You thrive with someone who listens, banters, and gives you room to change your mind without drama.",
    bestWith: ["Libra", "Aquarius", "Aries", "Leo"],
    growWith: ["Sagittarius", "Virgo", "Pisces"],
  },
  90: {
    name: "Cancer",
    dates: "Jun 21 – Jul 22",
    tagline: "Water heart · protective intuition",
    personality:
      "Home, memory, and emotional safety shape your world. You nurture fiercely and read rooms deeply; your softness is strength, even when you hide it behind a shell.",
    traits: [
      "Empathic and loyal",
      "Attached to people and places",
      "Mood tied to environment",
    ],
    loveLife:
      "You need emotional honesty and consistency. Small acts of care build trust; neglect or coldness cuts deeper than loud arguments.",
    bestWith: ["Scorpio", "Pisces", "Taurus", "Virgo"],
    growWith: ["Capricorn", "Aries", "Libra"],
  },
  120: {
    name: "Leo",
    dates: "Jul 23 – Aug 22",
    tagline: "Fire spotlight · generous warmth",
    personality:
      "You lead with heart. Recognition fuels you, but your real gift is loyalty and encouragement—you lift others when you feel seen and trusted.",
    traits: [
      "Creative, proud, warm",
      "Loyal when respected",
      "Sensitive to being ignored",
    ],
    loveLife:
      "Grand gestures and steady admiration both matter. You want a partner who celebrates you without making you perform for every drop of affection.",
    bestWith: ["Aries", "Sagittarius", "Gemini", "Libra"],
    growWith: ["Aquarius", "Scorpio", "Taurus"],
  },
  150: {
    name: "Virgo",
    dates: "Aug 23 – Sep 22",
    tagline: "Earth craft · devoted improvement",
    personality:
      "You find peace in order, usefulness, and refinement. You notice what others miss and show love by fixing, planning, and showing up—sometimes you forget to receive the same.",
    traits: [
      "Precise, helpful, analytical",
      "High standards (for self first)",
      "Quietly anxious under pressure",
    ],
    loveLife:
      "Acts of service and clear communication win you. You relax with someone patient who doesn’t mistake your worry for criticism.",
    bestWith: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
    growWith: ["Pisces", "Sagittarius", "Gemini"],
  },
  180: {
    name: "Libra",
    dates: "Sep 23 – Oct 22",
    tagline: "Air balance · relational art",
    personality:
      "Harmony, beauty, and fairness orient you. You’re diplomatic and charming, but indecision often masks a real fear of choosing the wrong bond or battle.",
    traits: [
      "Diplomatic and aesthetic",
      "Partnership-oriented",
      "Conflict-averse until pushed",
    ],
    loveLife:
      "Romance, fairness, and real dialogue keep you in. You need a partner who meets you halfway and doesn’t exploit your need for peace.",
    bestWith: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
    growWith: ["Aries", "Capricorn", "Cancer"],
  },
  210: {
    name: "Scorpio",
    dates: "Oct 23 – Nov 21",
    tagline: "Water depth · transformative truth",
    personality:
      "Intensity, privacy, and emotional truth define you. You don’t dabble—you merge, investigate, and rebuild. Trust is everything; betrayal reshapes the whole story.",
    traits: [
      "Loyal, perceptive, private",
      "All-or-nothing bonds",
      "Magnetic without trying",
    ],
    loveLife:
      "Surface dating exhausts you. You want emotional nakedness, loyalty, and someone who won’t flinch at your depth or your silences.",
    bestWith: ["Cancer", "Pisces", "Virgo", "Capricorn"],
    growWith: ["Taurus", "Leo", "Aquarius"],
  },
  240: {
    name: "Sagittarius",
    dates: "Nov 22 – Dec 21",
    tagline: "Fire quest · honest horizon",
    personality:
      "Freedom, meaning, and blunt honesty keep you sane. You’re the friend who tells the truth and the spirit that needs a bigger map—restlessness is both fuel and flaw.",
    traits: [
      "Optimistic and adventurous",
      "Philosophical and blunt",
      "Commitment needs room to breathe",
    ],
    loveLife:
      "You bond through shared exploration and laughter. Clinginess backfires; shared values and travel—literal or intellectual—keep the flame.",
    bestWith: ["Aries", "Leo", "Libra", "Aquarius"],
    growWith: ["Gemini", "Virgo", "Pisces"],
  },
  270: {
    name: "Capricorn",
    dates: "Dec 22 – Jan 19",
    tagline: "Earth summit · disciplined heart",
    personality:
      "You climb slowly and seriously. Ambition is love in disguise—building something that lasts. Underneath reserve is devotion that shows in duty, time, and sacrifice.",
    traits: [
      "Responsible and strategic",
      "Patient with long games",
      "Emotions run deep, show late",
    ],
    loveLife:
      "Consistency and respect matter more than fireworks. You open when someone proves reliability and doesn’t mock your seriousness.",
    bestWith: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    growWith: ["Cancer", "Aries", "Libra"],
  },
  300: {
    name: "Aquarius",
    dates: "Jan 20 – Feb 18",
    tagline: "Air future · humane outsider",
    personality:
      "Ideals, friendship, and originality come first. You need mental space and a cause—or a weird, wonderful crew. Emotional rules feel small until the right person rewrites them.",
    traits: [
      "Independent and inventive",
      "Friendly but detached",
      "Rebels against expectations",
    ],
    loveLife:
      "Friendship-first bonds last. You want intellectual chemistry, freedom, and a partner who isn’t threatened by your need for air.",
    bestWith: ["Gemini", "Libra", "Aries", "Sagittarius"],
    growWith: ["Leo", "Taurus", "Scorpio"],
  },
  330: {
    name: "Pisces",
    dates: "Feb 19 – Mar 20",
    tagline: "Water dream · compassionate dissolve",
    personality:
      "Imagination, compassion, and sensitivity blur your edges with the world. You heal and escape in equal measure—art, love, and spirit are lifelines.",
    traits: [
      "Empathic and imaginative",
      "Absorbs others’ moods",
      "Boundaries are a lifelong lesson",
    ],
    loveLife:
      "Romance and soul recognition call you. You need gentleness and honesty—partners who anchor you without dimming your magic.",
    bestWith: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
    growWith: ["Virgo", "Gemini", "Sagittarius"],
  },
};

export function getZodiacReading(angle: number): ZodiacReading | null {
  return ZODIAC_READINGS[angle] ?? null;
}
