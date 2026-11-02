import type { ConsequenceSeed } from "@/domain/scenario";
import {
  cabinetNegotiatesChoice as originalCabinet,
  noHaltOrderPivot as originalNoHalt,
  reducedEvacuationPivot as originalReduced,
} from "./dunkirk-1940-pivots";

export {
  dunkirkPivotSources,
  expandedEvacuationPivot,
  luftwaffeMoleBombardmentChoice,
  frenchBretonRedoubtChoice,
  goringLuftwaffeAnnihilationChoice,
  fallSeeloweImmediateAirborneChoice,
} from "./dunkirk-1940-pivots";

function seed(
  id: string,
  horizon: ConsequenceSeed["horizon"],
  title: string,
  summary: string,
  basis: string,
  evidenceIds: string[],
  causalFactorIds: string[],
): ConsequenceSeed {
  return {
    id, horizon, title, summary, basis, evidenceIds, causalFactorIds,
    classification: horizon === "present" ? "highly-speculative" : "plausible-projection",
  };
}

// Evidence IDs anchor the historical premise. They do not establish that the projected
// consequence would follow. New seeds are compatible themes, not mutually exclusive outcomes.
const noHaltAdditions: ConsequenceSeed[] = [
  seed("nh-a4", "aftermath", "Defences built under pressure",
    "Without the pause, units withdrawing toward Dunkirk would have had less time to prepare defensive positions and organize the movement of troops toward embarkation points. The same men needed to hold the perimeter would also have been needed to keep the evacuation moving, turning a shortage of time into a shortage of usable manpower.",
    "The evacuation account describes the halt as time for defensive preparations and the retreat from Lille. Dividing personnel between defence and evacuation under greater pressure is an authored projection, not a recorded outcome.",
    ["src-dunkirk-wiki-001"], ["evacuation-capacity", "allied-trained-force"]),
  seed("nh-a5", "aftermath", "An advance that still needed supplies",
    "Continued German movement would not have removed the problems that led commanders to pause: concern over exposed flanks, tank losses and difficult ground. British and French resistance could still have forced local delays. The evacuation window would have narrowed unevenly rather than disappearing everywhere at once, leaving the outcome dependent on where pressure reached the perimeter.",
    "Lengel and the evacuation account describe tank conservation, flank vulnerability and terrain concerns. Uneven progress is an inference from these constraints; removing the order does not guarantee an immediate German capture of Dunkirk.",
    ["src-lengel-halt-001", "src-dunkirk-wiki-001"], ["evacuation-capacity"]),
  seed("nh-d4", "decade", "Experienced soldiers become instructors",
    "If Britain continued fighting after a worse evacuation, surviving regular soldiers would likely have been pulled between front-line duty and training new formations. A thinner experienced cadre would have made instruction a strategic bottleneck: rebuilding numbers alone would not have restored the army's practical knowledge or its ability to operate together.",
    "The Cabinet account emphasizes the threatened loss of trained officers and men; EBSCO describes the rescued troops as the basis of the future army. The training bottleneck is an authored consequence of losing more of that cadre, conditional on continued war.",
    ["src-museum-pm-001", "src-ebsco-dunkirk-001"], ["allied-trained-force"]),
  seed("nh-d5", "decade", "Ships and aircraft carry more weight",
    "If Britain remained in the war with fewer experienced ground troops, naval operations and home air defence would likely have carried more of the burden while the army recovered. Preserving aircrew and ships would have competed with demands to rebuild an expeditionary force, shaping military priorities beyond the immediate evacuation.",
    "EBSCO connects the equipment losses to reliance on air defence, and the RAF Museum describes Dowding's effort to preserve fighters and pilots. The extended competition for priorities is a projection, not a quantified resource model.",
    ["src-ebsco-dunkirk-001", "src-dowding-001"], ["allied-trained-force", "raf-fighter-reserve"]),
  seed("nh-p3", "present", "Military readiness as a public argument",
    "A society shaped by the loss of more trained soldiers at Dunkirk might have treated the preservation of military experience as a central question of national readiness. Public debates about defence could have focused on whether professional skills survive sudden defeats, rather than assuming that new recruits can quickly replace an experienced army.",
    "This is a speculative cultural extension of the Cabinet's concern about losing trained regulars. The source anchors that concern in 1940, not any present-day political outcome.",
    ["src-museum-pm-001"], ["allied-trained-force"]),
  seed("nh-p4", "present", "A coast remembered through captivity",
    "With more men captured instead of rescued, remembrance of Dunkirk could have given greater prominence to prisoners, missing relatives and the long wait for news. Memorials and family histories might have told a story centered on absence and endurance in captivity, alongside the ships that still brought some soldiers home.",
    "The evacuation account describes captivity and the Historic England article describes memorials. The changed emphasis in remembrance is an authored, highly speculative extension; no specific new monument or individual is asserted.",
    ["src-dunkirk-wiki-001", "src-historic-england-001"], ["allied-trained-force"]),
];

const reducedAdditions: ConsequenceSeed[] = [
  seed("he-a4", "aftermath", "The shoreline becomes a queue",
    "With fewer vessels available, the passage from beach to transport would likely have become a tighter bottleneck. The shallow shoreline already prevented large ships from collecting men directly, making small craft and the mole essential. More soldiers could have waited exposed to attack while boats made repeated journeys, even where the perimeter still held.",
    "Historic England describes the shallow beach, the mole and the small boats' ferrying role. Longer waits under reduced capacity are a projection from those logistical constraints, without inventing a new evacuation total.",
    ["src-historic-england-001"], ["evacuation-capacity"]),
  seed("he-a5", "aftermath", "Who gets the next place aboard?",
    "A smaller evacuation would likely have made the allocation of places between British and French troops more contentious. The two armies depended on the same shrinking route out, while French troops helped sustain the perimeter. Decisions about embarkation could have affected trust between allies as well as the number of trained soldiers reaching Britain.",
    "The evacuation account documents resentment over perceived British priority and the move toward equal treatment. Heightened friction under reduced capacity is an authored inference; it does not claim a particular allocation decision occurred.",
    ["src-dunkirk-wiki-001"], ["evacuation-capacity", "french-resistance-continuity"]),
  seed("he-d4", "decade", "Households waiting for prisoners",
    "If more soldiers were left behind, more households would likely have spent the war awaiting news of men in captivity. The military shortage would have had a civilian counterpart: prolonged absences, disrupted family plans and greater demand for help to relatives, even while the rescued army began rebuilding.",
    "The evacuation account describes forced marches, captivity and prolonged prisoner labour. Effects on households are a plausible social projection from more captures, not a sourced claim about a particular family or support scheme.",
    ["src-dunkirk-wiki-001"], ["allied-trained-force"]),
  seed("he-d5", "decade", "Rebuilding skill and equipment together",
    "If Britain continued the war, a smaller rescued cadre would likely have complicated the reconstruction of its land forces beyond simply replacing abandoned equipment. New supplies would have needed trained crews and officers. Material recovery and military training could have proceeded at different speeds, limiting how quickly restored formations could take on demanding operations.",
    "Historic England documents extensive equipment losses, while EBSCO explains the value of the rescued trained army. Coordinating equipment replacement with skill recovery is an authored projection, not an estimate of production or deployment dates.",
    ["src-historic-england-001", "src-ebsco-dunkirk-001"], ["allied-trained-force"]),
  seed("he-p3", "present", "The little ships tell a harder story",
    "The surviving rescue vessels might have remained treasured reminders of civilian and naval effort, but their public story could have been less triumphant. Museums and commemorations could have emphasized the limits of improvisation and the people it could not save, rather than treating the rescue chiefly as proof of collective resilience.",
    "Historic England describes surviving little ships and memorials. The different commemorative interpretation is speculative; the source supports the existence of these historical objects, not their fictional present-day message.",
    ["src-historic-england-001"], ["evacuation-capacity"]),
  seed("he-p4", "present", "An alliance remembered through the rearguard",
    "A reduced rescue could have left a stronger memory of the French contribution to holding the perimeter and of arguments over embarkation. Public histories of British-French cooperation might have returned more often to the question of who bore the cost of a shared retreat, adding a more uneasy undertone to commemorations of the alliance.",
    "The evacuation account records both French rearguard service and resentment about evacuation priorities. Their prominence in later public memory is highly speculative, not evidence of an inevitable diplomatic rupture.",
    ["src-dunkirk-wiki-001"], ["french-resistance-continuity"]),
];

const cabinetAdditions: ConsequenceSeed[] = [
  seed("wc-a4", "aftermath", "Negotiation is not yet a settlement",
    "Authorizing an approach would not itself have ended the war. Halifax was prepared to reject terms that damaged Britain's independence, and the Cabinet doubted that acceptable terms were available. Diplomats would therefore have faced the problem of exploring concessions without surrendering the ability to refuse them, while the military crisis continued.",
    "The Cabinet minutes describe Halifax's independence condition, willingness to reject unacceptable terms and pessimism about mediation. The conduct of an authorized approach is a projection; opening talks is deliberately distinguished from signing an agreement.",
    ["src-museum-pm-001"], ["british-political-resolve"]),
  seed("wc-a5", "aftermath", "The danger of the news getting out",
    "A decision to explore terms would likely have created a political problem even before any agreement existed: how much could the public be told? Ministers had warned that an apparent request for peace at the price of territory would damage morale and prestige. Keeping the approach private could have protected the government temporarily while making disclosure more explosive.",
    "The Cabinet account records ministers' concern about public knowledge of an approach and territorial concessions. The tension between secrecy and disclosure is an authored projection, not a claim that a particular leak happened.",
    ["src-museum-pm-001"], ["british-political-resolve"]),
  seed("wc-d4", "decade", "Sea power becomes a bargaining constraint",
    "If negotiations produced restrictions on the Royal Navy and British Mediterranean positions, maintaining overseas connections would likely have become more difficult. Shipping, supply routes and the defence of imperial possessions would have been shaped by the settlement's limits, leaving the government responsible for commitments it had less freedom to protect.",
    "Grimsley summarizes possible Mediterranean concessions and Kershaw's argument about restricting naval power. The consequences for overseas connections are conditional projections, not evidence that talks necessarily led to those terms.",
    ["src-grimsley-peace-001"], ["british-political-resolve"]),
  seed("wc-d5", "decade", "Independence under the terms of peace",
    "If Britain accepted a settlement that constrained rearmament, disputes over what independence meant would likely have outlasted the negotiations. Ministers could have retained domestic authority while losing freedom to intervene abroad. The bargain to avoid immediate disaster would then have shaped military planning and political responsibility through the following years.",
    "Churchill warned in the Cabinet discussions that terms could prevent continued rearmament; Halifax insisted on independence. A later gap between domestic authority and foreign-policy freedom is an authored interpretation of that tension, conditional on an agreement.",
    ["src-museum-pm-001", "src-grimsley-peace-001"], ["british-political-resolve"]),
  seed("wc-p3", "present", "A divided memory of the peace choice",
    "If a settlement followed the Cabinet's approach, public memory could have remained divided over whether the decision protected ordinary lives or sacrificed long-term freedom. Families, schools and civic commemorations might have argued over the same choice from different perspectives, making compromise rather than defiance the central controversy in Britain's story of the war.",
    "The Cabinet account documents contemporary disagreement over concessions, morale and independence. Extending that disagreement into cultural memory is highly speculative; it is not a forecast established by those minutes.",
    ["src-museum-pm-001"], ["british-political-resolve"]),
  seed("wc-p4", "present", "Power without freedom to act",
    "If a restrictive peace settlement endured, Britain's international position today might have been shaped by the difference between retaining possessions and controlling its own strategic choices. Political debates could have centered on recovering room to act independently, with Britain's relationship to Europe defined by the legacy of concessions rather than its historical role in the wartime alliance.",
    "Grimsley's account distinguishes possible short-term preservation of empire from strategic weakening. The modern politics of recovering autonomy is an authored extrapolation, conditional on a restrictive settlement; no institution or border is asserted as certain.",
    ["src-grimsley-peace-001"], ["british-political-resolve"]),
];

export const noHaltOrderPivot = {
  ...originalNoHalt,
  consequenceSeeds: [...originalNoHalt.consequenceSeeds, ...noHaltAdditions],
};

export const reducedEvacuationPivot = {
  ...originalReduced,
  consequenceSeeds: [...originalReduced.consequenceSeeds, ...reducedAdditions],
};

export const cabinetNegotiatesChoice = {
  ...originalCabinet,
  consequenceSeeds: [...originalCabinet.consequenceSeeds, ...cabinetAdditions],
};
