import type { ScenarioDefinition } from "@/domain/scenario";
import { fallOfConstantinople1453 } from "./fall-of-constantinople-1453";
import { spanishArmada1588 } from "./spanish-armada-1588";
import { yorktown1781 } from "./yorktown-1781";
import { gettysburg1863 } from "./gettysburg-1863";
import { julyCrisis1914 } from "./july-crisis-1914";
import { dunkirk1940 } from "./dunkirk-1940";
import { barbarossaMoscow1941 } from "./barbarossa-moscow-1941";
import { midway1942 } from "./midway-1942";
import { berlinAirlift1948 } from "./berlin-airlift-1948";
import { cubanMissileCrisis1962 } from "./cuban-missile-crisis-1962";
import { sovietMoonLanding1969 } from "./soviet-moon-landing-1969";
import { petrovFalseAlarm1983 } from "./petrov-false-alarm-1983";

export const scenarios: readonly ScenarioDefinition[] = [
  fallOfConstantinople1453,
  spanishArmada1588,
  yorktown1781,
  gettysburg1863,
  julyCrisis1914,
  dunkirk1940,
  barbarossaMoscow1941,
  midway1942,
  berlinAirlift1948,
  cubanMissileCrisis1962,
  sovietMoonLanding1969,
  petrovFalseAlarm1983,
];

export const scenariosById = new Map(scenarios.map((scenario) => [scenario.id, scenario]));
