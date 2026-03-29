/** Full descriptor for a weapon pickup: name, sound, icon, categories, and description text. */
export interface Weapon {
  name: string;
  sound: string;
  icon: string;
  iconWidth?: number;
  iconHeight?: number;
  category: ('Defensive' | 'Offensive')[];
  desc: string;
}

/** Background icon definition for a weapon category (Defensive / Offensive). */
export interface WeaponBackground {
  type: 'Defensive' | 'Offensive';
  icon: string;
}

/** Background icon definitions for the Defensive and Offensive weapon categories. */
export const weaponBackgrounds: WeaponBackground[] = [
  {
    type: 'Defensive',
    icon: 'defensive.svg'
  },
  {
    type: 'Offensive',
    icon: 'offensive.svg'
  }
];

/**
 * Full weapon roster with names, sound files, icons, categories, and
 * descriptions.
 */
export const weaponData: Weapon[] = [
  {
    name: "Auto-Pilot",
    sound: "auto-pilot.mp3",
    icon: "auto-pilot.svg",
    category: ["Defensive"],
    desc: "Auto-pilot takes control of the craft out of your hands for a short period. A timer will count down the seconds until auto-pilot disengages."
  },
  {
    name: "Cloak", 
    sound: "cloak.mp3",
    icon: "cloak.svg",
    category: ["Offensive"],
    desc: "Instant invisibility prevents your opponents from targeting your craft. Handy for overtaking on the blind side - literally!"
  },
  {
    name: "Energy Drain",
    sound: "energy-drain.mp3",
    icon: "energy-drain.svg",
    category: ["Offensive", "Defensive"], 
    desc: "When fired, the energy drain locks on to the nearest craft. Energy is then drained from the opponent and added to your craft's shield energy reservoir."
  },
  {
    name: "Force Wall",
    sound: "force-wall.mp3",
    icon: "force-wall.svg",
    category: ["Offensive", "Defensive"],
    desc: "Slamming into an impenetrable wall at 250mph is enough to stop anyone dead in their tracks. Unleash a force wall and your competitors will come to a crunching halt, but you will speed on through. Opponents can destroy a force wall with a quake disrupter or a plasma bolt."
  },
  {
    name: "Gravity Shield",
    sound: "shield.mp3",
    icon: "gravity-shield.svg",
    category: ["Defensive"],
    desc: "The gravity shield will safeguard your craft from further shield energy loss. When activated, the gravity shield prevents you from firing another weapon, but you can pick one up."
  },
  {
    name: "Mines",
    sound: "mines.mp3",
    icon: "mines.svg",
    category: ["Offensive"],
    desc: "When launched, mines spew from the back of the craft, causing damage to opponents behind. Although they are a fine deterrent to slip-streaming, rockets and quake disruptors can destroy mines."
  },
  {
    name: "Multi-Missiles",
    sound: "missles.mp3",
    icon: "missles.svg",
    category: ["Offensive"],
    desc: "Launching a double salvo, multi-missiles can target up to two enemy craft at any one time. The two missiles will target the nearest opponent within a fixed short range."
  },
  {
    name: "Plasma Bolt",
    sound: "plasma.mp3",
    icon: "plasma-bolt.svg",
    category: ["Offensive"],
    desc: "When activated, plasma bolts must charge up before launching. They are not target-seeking and are tricky to aim, but more importantly, they destroy enemy craft on impact."
  },
  {
    name: "Quake Disruptor",
    sound: "quake.mp3",
    icon: "quake.svg",
    category: ["Offensive"],
    desc: "One of the most instantly recognizable weapons, the Quake Disruptor flips the race-track up and slams it back down with disdain. Craft caught within this ripple effect will suffer massive shield energy loss."
  },
  {
    name: "Reflector",
    sound: "reflector.mp3",
    icon: "reflector.svg",
    category: ["Defensive"],
    desc: "Reflectors can be used as an offensive weapon, sending an attack back towards its source. Timed correctly the reflector is ideally activated just after an attack is launched."
  },
  {
    name: "Rocket",
    sound: "rocket.mp3",
    icon: "rocket.svg",
    category: ["Offensive"],
    desc: "As front-firing projectiles, rockets fire in rounds of two and drain shield energy on impact. Rockets fire only in a straight line, so a careful aim is required."
  }
];