import type { EventPack } from "@/domain/simulation";

export const eventPacks: EventPack[] = [
  { id: "wwii-europe", title: "World War II: Europe", era: "1939–1945", description: "Explore decisive choices in the European theatre, beginning with the fall of France and the Dunkirk evacuation.", scope: "First vertical slice", status: "available" },
  { id: "wwii-pacific", title: "World War II: Pacific", era: "1937–1945", description: "Trace alternate diplomatic, naval, and strategic choices across the Pacific theatre, starting at Midway.", scope: "Pacific expansion", status: "available" },
  { id: "cold-war", title: "The Cold War: On the Brink", era: "1947–1989", description: "Stand at the precipice of nuclear confrontation, partition, and espionage from the Berlin blockade to the Caribbean.", scope: "Cold War expansion", status: "available" },
  { id: "american-civil-war", title: "American Civil War", era: "1861–1865", description: "Investigate the political and military decisions that shaped the conflict and Reconstruction.", scope: "Civil War expansion", status: "available" },
  { id: "american-revolution", title: "American Revolution", era: "1775–1783", description: "Follow the fragile alliances, campaigns, and political choices behind independence.", scope: "Revolutionary expansion", status: "available" },
  { id: "world-war-i", title: "World War I: The Great War", era: "1914–1918", description: "Navigate the diplomatic breakdown, continental mobilizations, and strategic choices of the First World War.", scope: "Great War expansion", status: "available" },
  { id: "space-race", title: "The Space Race: Orbital Dawn", era: "1957–1975", description: "Direct rocket engineering, superpower competition, and lunar landing programs on the ultimate frontier.", scope: "Space Race expansion", status: "available" },
  { id: "early-modern-europe", title: "Age of Sail & Faith", era: "1550–1650", description: "Decide the religious wars, maritime supremacy, and imperial rivalries of early modern Europe.", scope: "Early Modern expansion", status: "available" },
  { id: "fall-of-byzantium", title: "The Fall of Byzantium", era: "1453", description: "Stand at the crossroads of European and Middle Eastern history during the siege of Constantinople.", scope: "Late Medieval expansion", status: "available" },
];
