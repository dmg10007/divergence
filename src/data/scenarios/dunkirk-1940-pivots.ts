/**
 * Pivot content for the Dunkirk scenario: sources, plausibility cases, and horizon-tagged
 * consequence seeds. Each seed is counterfactual, so none is documented fact; evidence
 * strength decays from the aftermath to the present day (see docs/pivot-authoring.md).
 */

export const dunkirkPivotSources = [
  {
    id: "src-museum-pm-001",
    title: "The Cabinet Crisis, May 1940",
    author: "Museum of the Prime Minister",
    kind: "secondary",
    version: "online article, 2025",
    publishedYear: 2025,
    sourceUrl: "https://www.museumofpm.org/articles/the-cabinet-crisis-may-1940/",
    locator: "Whole article; excerpts of War Cabinet minutes, 26-28 May 1940",
    claimsSupported: [
      "Halifax's case for exploring terms through Mussolini",
      "Halifax's suggestion that he might resign",
      "Churchill's opposition to mediation",
      "Chamberlain's position on 27 May",
      "Concern over losing the BEF's trained regulars",
      "American confidence in British survival",
      "Operation Dynamo authorized on 26 May"
    ],
    rightsNote: "Metadata only; excerpts require rights review. Quotes War Cabinet minutes held by the National Archives (CAB 65); verify reuse terms before republication.",
    reviewStatus: "reviewed"
  },
  {
    id: "src-grimsley-peace-001",
    title: "What If Britain Had Made Peace With Hitler?",
    author: "Mark Grimsley",
    kind: "secondary",
    version: "HistoryNet web edition of a November 2007 World War II Magazine article",
    publishedYear: 2007,
    sourceUrl: "https://historynet.com/britain-made-peace-hitler/",
    locator: "Whole article, including its summary of Ian Kershaw's Fateful Choices",
    claimsSupported: [
      "Halifax as the first choice to succeed Chamberlain",
      "Possible terms of a Mussolini-mediated settlement",
      "Kershaw's assessment of a negotiated settlement",
      "About 17,000 evacuated by 28 May",
      "Britain fought on and helped form the Grand Alliance"
    ],
    rightsNote: "Metadata only; excerpts require rights review.",
    reviewStatus: "reviewed"
  },
  {
    id: "src-lengel-halt-001",
    title: "Decisions: Hitler's Halt Order",
    author: "Edward G. Lengel",
    kind: "secondary",
    version: "HistoryNet web edition of a November 2011 Military History article",
    publishedYear: 2011,
    sourceUrl: "https://historynet.com/decisions-hitlers-halt-order/",
    locator: "Whole article",
    claimsSupported: [
      "Panzers about 12 miles from Dunkirk at the Aa Canal",
      "Rundstedt's concern over tank losses and a repeat of the Arras counterattack",
      "Hitler confirming the halt order over Guderian's protest",
      "Pontoon bridges across the Aa Canal",
      "Dunkirk left to the Luftwaffe"
    ],
    rightsNote: "Metadata only; excerpts require rights review.",
    reviewStatus: "reviewed"
  },
  {
    id: "src-historic-england-001",
    title: "Operation Dynamo: The Miracle of Dunkirk",
    author: "Historic England",
    kind: "secondary",
    version: "blog post, 25 May 2020",
    publishedYear: 2020,
    sourceUrl: "https://heritagecalling.com/2020/05/25/operation-dynamo-the-miracle-of-dunkirk/",
    locator: "Whole post",
    claimsSupported: [
      "338,226 soldiers rescued",
      "About 68,000 men of the BEF lost in the campaign",
      "Equipment destroyed or abandoned"
    ],
    rightsNote: "Metadata only; excerpts require rights review.",
    reviewStatus: "reviewed"
  },
  {
    id: "src-ebsco-dunkirk-001",
    title: "Evacuation of Dunkirk",
    author: "EBSCO Research Starters",
    kind: "secondary",
    version: "research starter, 2020",
    publishedYear: 2020,
    sourceUrl: "https://www.ebsco.com/research-starters/military-history-and-science/evacuation-dunkirk/",
    locator: "Whole article",
    claimsSupported: [
      "About 338,000 evacuated, 224,000 of them British",
      "Evacuation exceeded expectations"
    ],
    rightsNote: "Metadata only; excerpts require rights review.",
    reviewStatus: "reviewed"
  },
  {
    id: "src-dunkirk-wiki-001",
    title: "Dunkirk evacuation",
    author: "Wikipedia contributors",
    kind: "reference",
    version: "accessed 2026",
    publishedYear: 2003,
    sourceUrl: "https://en.wikipedia.org/wiki/Dunkirk_evacuation",
    locator: "Whole article",
    claimsSupported: [
      "7,669 evacuated on the first day",
      "338,226 rescued by the eighth day",
      "Halt order timeline"
    ],
    rightsNote: "Community-maintained reference; verify against primary sources before republication.",
    reviewStatus: "reviewed"
  },
  {
    id: "src-deighton-blitzkrieg-001",
    title: "Blitzkrieg: From the Rise of Hitler to the Fall of Dunkirk",
    author: "Len Deighton",
    kind: "secondary",
    version: "HarperCollins edition, 1979",
    publishedYear: 1979,
    sourceUrl: "https://www.harpercollins.com/products/blitzkrieg-len-deighton",
    locator: "Chapters on the Arras counterattack and the Dunkirk perimeter",
    claimsSupported: [
      "Luftwaffe bombing priority on harbor moles",
      "Stuka operations over Dunkirk",
      "German armor logistics and replenishment constraints"
    ],
    rightsNote: "Published historical monograph; excerpts require fair-use review.",
    reviewStatus: "reviewed"
  }
];

export const noHaltOrderPivot = {
  plausibility: {
    minimalRewrite: "The pause began as General von Rundstedt's own caution, not a directive from Hitler: his generals worried about tank losses and a repeat of the Arras counterattack, and Hitler confirmed the order on 24 May over the protests of generals such as Guderian. Guderian's panzers were already within about 12 miles of Dunkirk and had bridged the Aa Canal, so a different judgment by Rundstedt or Hitler would not have required any change in the military situation.",
    evidenceIds: [
      "src-lengel-halt-001",
      "src-dunkirk-wiki-001"
    ]
  },
  seedSelection: {
    aftermath: 2,
    decade: 2,
    present: 1
  },
  consequenceSeeds: [
    {
      id: "nh-a1",
      horizon: "aftermath",
      title: "A hotter perimeter",
      summary: "In this branch, German armour presses the Dunkirk perimeter while Operation Dynamo is still getting started, when only 7,669 soldiers were lifted on the first day. The evacuation would have had to run under far heavier ground pressure than the historical pause allowed.",
      classification: "plausible-projection",
      basis: "The halt order paused armoured pressure on the perimeter in the early days, and Dynamo's first day lifted only 7,669 men.",
      evidenceIds: [
        "src-dunkirk-wiki-001",
        "src-lengel-halt-001"
      ],
      causalFactorIds: [
        "evacuation-capacity"
      ]
    },
    {
      id: "nh-a2",
      horizon: "aftermath",
      title: "More of the army lost",
      summary: "In this branch, fewer than the 338,226 men rescued historically escape, and the number of British soldiers killed or captured grows beyond the roughly 68,000 the BEF lost over the whole campaign.",
      classification: "plausible-projection",
      basis: "About 338,226 were rescued and about 68,000 were lost historically; a perimeter under armoured attack would shrink the first figure and raise the second.",
      evidenceIds: [
        "src-historic-england-001"
      ],
      causalFactorIds: [
        "evacuation-capacity",
        "allied-trained-force"
      ]
    },
    {
      id: "nh-a3",
      horizon: "aftermath",
      title: "A shortage of trained men",
      summary: "In this branch, Britain's pre-war regular army, including the large numbers of trained officers and men who were in France, is hit harder. With the loss of its heavy equipment already certain, the army that faces the summer of 1940 is smaller and less experienced.",
      classification: "plausible-projection",
      basis: "War Cabinet ministers feared that losing the regulars in France, together with all heavy equipment, would be a bitter blow to Britain's prospects.",
      evidenceIds: [
        "src-museum-pm-001",
        "src-historic-england-001"
      ],
      causalFactorIds: [
        "allied-trained-force"
      ]
    },
    {
      id: "nh-d1",
      horizon: "decade",
      title: "Rebuilding from a smaller base",
      summary: "A smaller and less experienced army coming home would likely slow Britain's rebuilding of its land forces after 1940, delaying how soon it could contribute ground troops against Germany.",
      classification: "plausible-projection",
      basis: "Reasoned extension of the loss of trained regulars that ministers feared in May 1940.",
      evidenceIds: [
        "src-museum-pm-001",
        "src-historic-england-001"
      ],
      causalFactorIds: [
        "allied-trained-force"
      ]
    },
    {
      id: "nh-d2",
      horizon: "decade",
      title: "A harder political summer",
      summary: "A heavier defeat on the beaches would likely have strengthened those in the British government who wanted to explore a negotiated peace, and would have tested Churchill's position in the weeks after Dunkirk.",
      classification: "plausible-projection",
      basis: "On 28 May Halifax argued that Britain might get better terms before France left the war and aircraft factories were bombed; a worse military outcome strengthens that case.",
      evidenceIds: [
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "nh-d3",
      horizon: "decade",
      title: "Invasion fears with fewer defenders",
      summary: "With less of its army recovered, Britain would have faced the summer's fear of invasion with fewer trained ground forces to defend the home islands.",
      classification: "plausible-projection",
      basis: "The War Cabinet could not rule out an invasion of Britain once France fell.",
      evidenceIds: [
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "allied-trained-force"
      ]
    },
    {
      id: "nh-p1",
      horizon: "present",
      title: "A smaller part in the Grand Alliance",
      summary: "Over the decades, a Britain that came out of 1940 with a diminished army might have played a smaller part in the Allied war effort, and in the world that followed, than the Britain that actually fought on and helped form a Grand Alliance with the United States and the Soviet Union.",
      classification: "highly-speculative",
      basis: "Grimsley notes that Britain fought on and helped create the Grand Alliance; this seed asks how a weaker start might have shifted that role.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: []
    },
    {
      id: "nh-p2",
      horizon: "present",
      title: "A different national memory",
      summary: "The rescue is remembered as the Miracle of Dunkirk and has become a central story of British resilience. In this branch there may have been no such story, and the national memory of 1940, and what Britons expect of themselves in a crisis, could look very different today.",
      classification: "highly-speculative",
      basis: "Both the Historic England and Wikipedia accounts describe the evacuation as the Miracle of Dunkirk.",
      evidenceIds: [
        "src-historic-england-001",
        "src-dunkirk-wiki-001"
      ],
      causalFactorIds: []
    }
  ]
};

export const reducedEvacuationPivot = {
  plausibility: {
    minimalRewrite: "Operation Dynamo was authorized only on 26 May, and its early results were poor: 7,669 men on the first day and about 17,000 by 28 May. The final total of more than 338,000 exceeded expectations, so modestly less shipping, a shorter holding period, or worse early luck would not have required any change to the military situation.",
    evidenceIds: [
      "src-museum-pm-001",
      "src-dunkirk-wiki-001",
      "src-grimsley-peace-001",
      "src-ebsco-dunkirk-001"
    ]
  },
  seedSelection: {
    aftermath: 2,
    decade: 2,
    present: 1
  },
  consequenceSeeds: [
    {
      id: "he-a1",
      horizon: "aftermath",
      title: "Fewer men reach England",
      summary: "In this branch, fewer ships or fewer days mean far fewer than the 338,226 men rescued historically, and the army that reaches Britain after Dunkirk is correspondingly smaller.",
      classification: "plausible-projection",
      basis: "The historical total depended on the number of vessels and days available to lift men from the beaches and harbour.",
      evidenceIds: [
        "src-dunkirk-wiki-001",
        "src-historic-england-001"
      ],
      causalFactorIds: [
        "evacuation-capacity"
      ]
    },
    {
      id: "he-a2",
      horizon: "aftermath",
      title: "The trained cadre thins",
      summary: "Many of the men left behind would come from Britain's pre-war regular army, large numbers of whom were in France, deepening the loss of trained officers and men that ministers feared.",
      classification: "plausible-projection",
      basis: "War Cabinet ministers noted that much of the pre-war regular army was in France.",
      evidenceIds: [
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "allied-trained-force"
      ]
    },
    {
      id: "he-a3",
      horizon: "aftermath",
      title: "More Allied soldiers left behind",
      summary: "Of the roughly 338,000 men rescued historically, about 224,000 were British. A smaller evacuation would likely have left more Allied soldiers behind, including French troops.",
      classification: "plausible-projection",
      basis: "The French army held the collapsing perimeter and few French soldiers escaped even in the historical evacuation.",
      evidenceIds: [
        "src-ebsco-dunkirk-001",
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "evacuation-capacity",
        "french-resistance-continuity"
      ]
    },
    {
      id: "he-d1",
      horizon: "decade",
      title: "A slower army rebuild",
      summary: "With a smaller rescued army, Britain's land forces would have taken longer to regrow and re-equip, delaying any return to the Continent and putting more weight on air and naval power in the war's middle years.",
      classification: "plausible-projection",
      basis: "The BEF abandoned nearly all its heavy equipment, so manpower was the scarce asset that Dunkirk preserved.",
      evidenceIds: [
        "src-museum-pm-001",
        "src-historic-england-001"
      ],
      causalFactorIds: [
        "allied-trained-force"
      ]
    },
    {
      id: "he-d2",
      horizon: "decade",
      title: "Washington's confidence",
      summary: "A disappointing rescue might have lowered American confidence that Britain could survive, and with it Washington's willingness to risk resources on a country it expected to lose.",
      classification: "plausible-projection",
      basis: "War Cabinet ministers worried that if the Americans thought British defeat inevitable they would not throw good money after bad.",
      evidenceIds: [
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "he-d3",
      horizon: "decade",
      title: "More weight on the air battle",
      summary: "With fewer trained ground troops, the defence of the home islands in 1940 would have leaned even more heavily on denying Germany air superiority, raising the stakes of the coming Battle of Britain.",
      classification: "plausible-projection",
      basis: "The Chief of the Air Staff told ministers the key was preventing German air superiority that would enable an invasion, and Dowding was conserving fighters for that fight.",
      evidenceIds: [
        "src-museum-pm-001",
        "src-dowding-001"
      ],
      causalFactorIds: [
        "raf-fighter-reserve"
      ]
    },
    {
      id: "he-p1",
      horizon: "present",
      title: "A different postwar Britain",
      summary: "A Britain that lost more of its army in 1940 might have emerged from the war with less standing among the victors, changing its place in the world today.",
      classification: "highly-speculative",
      basis: "Grimsley records that Britain fought on and ended the war having lost its empire and status as a world power anyway; a weaker start might have changed the path.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: []
    },
    {
      id: "he-p2",
      horizon: "present",
      title: "A different transatlantic bargain",
      summary: "The balance of the partnership between Britain and the United States might have developed differently today if Britain had reached 1941 weaker.",
      classification: "highly-speculative",
      basis: "Grimsley's account ties American support to Britain's visible will and ability to keep fighting.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: []
    }
  ]
};

export const cabinetNegotiatesChoice = {
  id: "war-cabinet-negotiates",
  label: "Cabinet explores peace",
  description: "On 28 May Churchill fails to carry the War Cabinet, and Lord Halifax's proposal to explore terms through Mussolini goes ahead.",
  interventionSummary: "The War Cabinet authorizes an approach to Italy to explore a settlement instead of rejecting mediation, while the Dunkirk evacuation proceeds as recorded.",
  narrativeEvents: [
    {
      id: "evt-pivot-cabinet-negotiates",
      date: "1940-05-28",
      title: "The Cabinet explores terms",
      summary: "In this counterfactual branch, Churchill fails to carry the War Cabinet on 28 May 1940. Lord Halifax, who had argued that Britain should consider terms from Mussolini if they left its independence intact, and who had suggested he might resign, prevails, and the Cabinet authorizes an approach to Italy to explore a general settlement instead of rejecting mediation.",
      classification: "plausible-projection",
      evidenceIds: [
        "src-museum-pm-001",
        "src-war-cabinet-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    }
  ],
  plausibility: {
    minimalRewrite: "Churchill had been prime minister for less than a month and could not simply overrule his colleagues. Halifax had been the Conservative grandees' other candidate for the premiership, he told a senior official that he could no longer work with Churchill, and Chamberlain, who held the balance in the Cabinet, argued on 27 May that the response to Mussolini should not be a complete rejection. Historian Ian Kershaw, as summarized by Mark Grimsley, treats the decision not to seek negotiations as a genuine fork.",
    evidenceIds: [
      "src-museum-pm-001",
      "src-grimsley-peace-001",
      "src-war-cabinet-001"
    ]
  },
  seedSelection: {
    aftermath: 2,
    decade: 2,
    present: 1
  },
  consequenceSeeds: [
    {
      id: "wc-a1",
      horizon: "aftermath",
      title: "Mussolini as intermediary",
      summary: "In this branch, Britain approaches Italy to explore a general settlement. The Cabinet assumed Mussolini would want concessions in the Mediterranean in return for mediating, and Churchill estimated Italy might seek the neutralization of Gibraltar and the Suez Canal, the demilitarization of Malta, and limits on British warships in the Mediterranean.",
      classification: "plausible-projection",
      basis: "Grimsley reports the Cabinet's assumptions and Churchill's estimate of Italian demands.",
      evidenceIds: [
        "src-grimsley-peace-001",
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "wc-a2",
      horizon: "aftermath",
      title: "The price from Berlin",
      summary: "Kershaw argues that to make sure Britain did not renege, Hitler would have insisted on the return of the colonies taken from Germany after the First World War and on concessions designed to hobble the Royal Navy.",
      classification: "plausible-projection",
      basis: "Grimsley summarizes Kershaw's reasoning about the terms Hitler would have demanded.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "wc-a3",
      horizon: "aftermath",
      title: "A coalition under strain",
      summary: "A Cabinet decision to explore terms would have strained a coalition in which Labour ministers such as Attlee and Greenwood warned that approaches looking like a plea for terms would be disastrous, and Churchill's own position, less than a month old, could have been put in jeopardy.",
      classification: "plausible-projection",
      basis: "The minutes record Greenwood warning of terrible consequences if it got out that Britain had sued for terms, and Halifax's resignation would have triggered a political crisis.",
      evidenceIds: [
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "wc-d1",
      horizon: "decade",
      title: "Hitler turns east",
      summary: "A settlement with Britain would have freed Hitler to turn all of his military might against the Soviet Union.",
      classification: "plausible-projection",
      basis: "Grimsley reports this as Hitler's perspective in Kershaw's account.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "wc-d2",
      horizon: "decade",
      title: "Washington steps back",
      summary: "A negotiated settlement would likely have extinguished President Roosevelt's interest in supporting Britain, and he would reasonably have turned his full attention to the defence of North America.",
      classification: "plausible-projection",
      basis: "Grimsley summarizes Kershaw's judgment about Roosevelt's likely reaction.",
      evidenceIds: [
        "src-grimsley-peace-001",
        "src-museum-pm-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "wc-d3",
      horizon: "decade",
      title: "An enfeebled Britain",
      summary: "In the short term a settlement might have preserved the British Empire, but it would have enfeebled Britain.",
      classification: "plausible-projection",
      basis: "Grimsley summarizes Kershaw on the short-term and long-term effects of a settlement.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "wc-p1",
      horizon: "present",
      title: "No Grand Alliance",
      summary: "In the actual timeline Britain fought on, helped create a Grand Alliance with the United States and the Soviet Union, and paid with 450,000 military and civilian deaths and eventually its empire and status as a world power. In this branch that alliance might never have formed in the same way, and Europe today could look unrecognizably different.",
      classification: "highly-speculative",
      basis: "Grimsley describes what actually happened when Britain fought on.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: []
    },
    {
      id: "wc-p2",
      horizon: "present",
      title: "A Europe in Germany's shadow",
      summary: "Especially given a Nazi triumph over the Soviet Union, it is unlikely in Kershaw's reading that Britain would have kept its empire or escaped eventual invasion, and the political map of Europe today might reflect German dominance.",
      classification: "highly-speculative",
      basis: "Grimsley summarizes Kershaw's long-term assessment.",
      evidenceIds: [
        "src-grimsley-peace-001"
      ],
      causalFactorIds: []
    }
  ]
};

export const expandedEvacuationPivot = {
  plausibility: {
    minimalRewrite: "Admiral Bertram Ramsay coordinates with the French Admiralty forty-eight hours earlier to requisition French merchant coasters and channel ferries, while calmer sea states along Malo-les-Bains permit night-time shallow-draft pier embarkation, lifting over 420,000 personnel including the French First Army rearguard.",
    evidenceIds: [
      "src-dunkirk-001",
      "src-armistice-001"
    ]
  },
  seedSelection: {
    aftermath: 2,
    decade: 2,
    present: 1
  },
  consequenceSeeds: [
    {
      id: "ee-a1",
      horizon: "aftermath",
      title: "Preserved French field divisions",
      summary: "Evacuating eighty thousand additional trained French regulars preserves core divisions that form the nucleus of a reconstituted Free French army in Britain and North Africa.",
      classification: "plausible-projection",
      basis: "Churchill emphasized that French soldiers brought to Britain formed the initial cadres for Charles de Gaulle.",
      evidenceIds: [
        "src-dunkirk-001",
        "src-armistice-001"
      ],
      causalFactorIds: [
        "allied-trained-force",
        "french-resistance-continuity"
      ]
    },
    {
      id: "ee-a2",
      horizon: "aftermath",
      title: "Heightened British defensive readiness",
      summary: "Returning nearly the entire British Expeditionary Force with key artillery cadres reinforces Home Defense divisions ahead of the anticipated invasion threat.",
      classification: "plausible-projection",
      basis: "The return of trained regulars was crucial for re-equipping the home army.",
      evidenceIds: [
        "src-dunkirk-001"
      ],
      causalFactorIds: [
        "allied-trained-force",
        "british-political-resolve"
      ]
    },
    {
      id: "ee-a3",
      horizon: "aftermath",
      title: "Allied solidarity solidified",
      summary: "The successful mass evacuation of French combat troops alongside British soldiers dampens anti-British sentiment across metropolitan France following the fall of Paris.",
      classification: "plausible-projection",
      basis: "Historical recriminations over evacuation priority strained Anglo-French relations.",
      evidenceIds: [
        "src-armistice-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity",
        "british-political-resolve"
      ]
    },
    {
      id: "ee-d1",
      horizon: "decade",
      title: "Stronger early North African counter-offensive",
      summary: "With trained French imperial forces aligned with London, Allied operations in North Africa achieve rapid control of Vichy-held territories in 1941.",
      classification: "plausible-projection",
      basis: "Imperial French territories provided strategic staging points for Mediterranean campaigns.",
      evidenceIds: [
        "src-armistice-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity",
        "allied-trained-force"
      ]
    },
    {
      id: "ee-d2",
      horizon: "decade",
      title: "Accelerated European invasion timetable",
      summary: "An expanded pool of veteran officers and non-commissioned officers accelerates British and Commonwealth divisional readiness, bringing forward the timetable for cross-Channel raiding and liberation plans.",
      classification: "plausible-projection",
      basis: "Veteran manpower shortages constrained British expansion through 1942.",
      evidenceIds: [
        "src-dunkirk-001"
      ],
      causalFactorIds: [
        "allied-trained-force"
      ]
    },
    {
      id: "ee-p1",
      horizon: "present",
      title: "Shared founding memory of liberation",
      summary: "Post-war French and British integration builds on the shared symbol of mutual rescue at Dunkirk, fostering deeper early post-war military and diplomatic confederation.",
      classification: "highly-speculative",
      basis: "Dunkirk's cultural resonance profoundly shaped post-war British and European security discourse.",
      evidenceIds: [
        "src-dunkirk-001",
        "src-armistice-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    }
  ]
};

export const luftwaffeMoleBombardmentChoice = {
  id: "luftwaffe-mole-bombardment",
  label: "Luftwaffe concentrated mole bombardment",
  description: "German Stukas prioritize destroying the East Mole and harbor piers, severing deep-draft berths.",
  interventionSummary: "The Luftwaffe concentrates dive-bombing on Dunkirk's harbor moles rather than dispersed beach targets, shutting down destroyer evacuations.",
  narrativeEvents: [
    {
      id: "evt-mole-destroyed",
      date: "1940-05-27",
      title: "Destruction of the East Mole",
      summary: "Concentrated Stuka dive-bombing fractures the wooden planking and concrete pilings of Dunkirk's East Mole, eliminating the pier that handled over two hundred thousand evacuees and forcing all rescue attempts onto shallow open beaches under continuous artillery fire.",
      classification: "plausible-projection" as const,
      evidenceIds: [
        "src-dunkirk-001",
        "src-deighton-blitzkrieg-001"
      ],
      causalFactorIds: [
        "evacuation-capacity",
        "allied-trained-force"
      ]
    }
  ],
  plausibility: {
    minimalRewrite: "Reichsmarschall Hermann Goering orders Luftflotte 2 and 3 dive-bombers to focus strictly on destroying the concrete pilings of Dunkirk's East Mole and harbor breakwaters rather than strafing dispersed troops on sand dunes, eliminating deep-draft berths.",
    evidenceIds: [
      "src-dunkirk-001",
      "src-deighton-blitzkrieg-001"
    ]
  },
  seedSelection: {
    aftermath: 2,
    decade: 2,
    present: 1
  },
  consequenceSeeds: [
    {
      id: "lm-a1",
      horizon: "aftermath",
      title: "Catastrophic embarkation bottleneck",
      summary: "Denied deep-water piers, Royal Navy destroyers cannot dock, reducing daily evacuation rates by more than seventy percent.",
      classification: "plausible-projection",
      basis: "Historically over two-thirds of all evacuees boarded from the East Mole.",
      evidenceIds: [
        "src-dunkirk-001"
      ],
      causalFactorIds: [
        "evacuation-capacity"
      ]
    },
    {
      id: "lm-a2",
      horizon: "aftermath",
      title: "Surrender of British rear divisions",
      summary: "As German armor closes the perimeter, ammunition exhaustion compels over one hundred and fifty thousand Allied soldiers to surrender on the beaches.",
      classification: "plausible-projection",
      basis: "Churchill feared that loss of the mole would leave the army trapped with days of ammunition remaining.",
      evidenceIds: [
        "src-dunkirk-001",
        "src-deighton-blitzkrieg-001"
      ],
      causalFactorIds: [
        "allied-trained-force",
        "evacuation-capacity"
      ]
    },
    {
      id: "lm-a3",
      horizon: "aftermath",
      title: "Political shockwave in London",
      summary: "News of massive troop captures triggers immediate censure motions against Churchill's nascent coalition government.",
      classification: "plausible-projection",
      basis: "The War Cabinet debates reflected acute anxiety over parliamentary reaction to catastrophic troop losses.",
      evidenceIds: [
        "src-war-cabinet-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    },
    {
      id: "lm-d1",
      horizon: "decade",
      title: "Home defense emergency mobilization",
      summary: "Britain must deploy untrained territorial recruits and emergency local defense volunteers to coastal positions, leaving Commonwealth forces critically understrength in Egypt and Singapore.",
      classification: "plausible-projection",
      basis: "The loss of the professional regular army would have crippled overseas garrisons.",
      evidenceIds: [
        "src-dunkirk-001"
      ],
      causalFactorIds: [
        "allied-trained-force",
        "british-political-resolve"
      ]
    },
    {
      id: "lm-d2",
      horizon: "decade",
      title: "Delayed Mediterranean campaigns",
      summary: "Lacking veteran divisions, British counter-offensives in Libya and East Africa are delayed by eighteen months, enabling Axis consolidation of North African oil routes.",
      classification: "plausible-projection",
      basis: "Middle Eastern theater operations depended on units evacuated from France.",
      evidenceIds: [
        "src-dunkirk-001"
      ],
      causalFactorIds: [
        "allied-trained-force"
      ]
    },
    {
      id: "lm-p1",
      horizon: "present",
      title: "A traumatic military legacy",
      summary: "The catastrophic loss of the expeditionary army establishes a doctrine of insular continental detachment in post-war British strategic thought.",
      classification: "highly-speculative",
      basis: "Interwar British military policy had long resisted continental commitments; catastrophe would have hardened that view.",
      evidenceIds: [
        "src-dunkirk-001",
        "src-war-cabinet-001"
      ],
      causalFactorIds: [
        "british-political-resolve"
      ]
    }
  ]
};

export const frenchBretonRedoubtChoice = {
  id: "french-breton-redoubt",
  label: "French Breton Redoubt and imperial resistance",
  description: "Premier Paul Reynaud overrides defeatist ministers, ordering a retreat into the Brittany redoubt and moving the government to North Africa.",
  interventionSummary: "France refuses an armistice, fighting from a fortified Brittany peninsula while transferring fleet units and government institutions to Algiers.",
  narrativeEvents: [
    {
      id: "evt-breton-defense-order",
      date: "1940-06-13",
      title: "The Imperial Resistance Proclamation",
      summary: "From Tours, French Premier Paul Reynaud issues the Imperial Proclamation, declaring that France will fight on from its colonial territories and establishing the Brittany peninsula redoubt to hold German panzer corps at bay while naval convoys transfer equipment to North Africa.",
      classification: "plausible-projection" as const,
      evidenceIds: [
        "src-armistice-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity",
        "british-political-resolve"
      ]
    }
  ],
  plausibility: {
    minimalRewrite: "French Premier Paul Reynaud rejects Marshal Pétain's counsel on 13 June 1940 and orders General Charles de Gaulle to organize a fighting retreat into the Brittany peninsula redoubt, while the French fleet and government relocate to Algiers to continue the war from the empire.",
    evidenceIds: [
      "src-armistice-001",
      "src-dunkirk-001"
    ]
  },
  seedSelection: {
    aftermath: 2,
    decade: 2,
    present: 1
  },
  consequenceSeeds: [
    {
      id: "br-a1",
      horizon: "aftermath",
      title: "French fleet remains in Allied service",
      summary: "With the French government relocated to Algiers, the French Navy joins the Royal Navy in Alexandria and Gibraltar, eliminating the need for the tragic British attack at Mers-el-Kébir.",
      classification: "plausible-projection",
      basis: "The armistice terms created the naval crisis that led directly to Operation Catapult at Mers-el-Kébir.",
      evidenceIds: [
        "src-armistice-001",
        "src-dunkirk-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity",
        "british-political-resolve"
      ]
    },
    {
      id: "br-a2",
      horizon: "aftermath",
      title: "North African front mobilized immediately",
      summary: "French North African divisions and air bases remain actively belligerent, closing the Mediterranean to Axis supply shipping heading toward Italian Libya.",
      classification: "plausible-projection",
      basis: "Vichy neutrality historically shielded Axis supply lanes across the central Mediterranean.",
      evidenceIds: [
        "src-armistice-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity",
        "allied-trained-force"
      ]
    },
    {
      id: "br-a3",
      horizon: "aftermath",
      title: "German occupation of all metropolitan France",
      summary: "In response to colonial resistance, the German military occupies southern France and the Mediterranean coast immediately, stretching German occupation security battalions across western Europe.",
      classification: "plausible-projection",
      basis: "Case Anton demonstrated German willingness to occupy the southern zone when resistance threatened.",
      evidenceIds: [
        "src-armistice-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity"
      ]
    },
    {
      id: "br-d1",
      horizon: "decade",
      title: "No Vichy collaborationist regime",
      summary: "Without Pétain's Vichy government, the moral and political collaboration apparatus never forms, preserving unified French republican legitimacy throughout the war.",
      classification: "plausible-projection",
      basis: "The legal continuity of the Vichy state divided French loyalties throughout the war.",
      evidenceIds: [
        "src-armistice-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity"
      ]
    },
    {
      id: "br-d2",
      horizon: "decade",
      title: "Early Mediterranean victory",
      summary: "Combined Anglo-French naval and ground superiority in the Mediterranean forces an early collapse of Italian forces in Libya by late 1941.",
      classification: "plausible-projection",
      basis: "Rommel's Afrika Korps required secure sea routes that active French North African bases would have interdicted.",
      evidenceIds: [
        "src-armistice-001",
        "src-dunkirk-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity",
        "allied-trained-force"
      ]
    },
    {
      id: "br-p1",
      horizon: "present",
      title: "An unbroken republican continuity",
      summary: "Post-war France avoids the painful purge and constitutional fractures of the post-Vichy era, leading to earlier European political consolidation under a confident Fourth Republic.",
      classification: "highly-speculative",
      basis: "The legacy of collaboration deeply marked post-war French politics and legal institutions.",
      evidenceIds: [
        "src-armistice-001"
      ],
      causalFactorIds: [
        "french-resistance-continuity"
      ]
    }
  ]
};

export const goringLuftwaffeAnnihilationChoice = {
  id: "goring-luftwaffe-annihilation",
  tier: "extreme-divergence" as const,
  label: "Göring's saturation firestorm: Stukas annihilate the beaches",
  description: "Göring commits all Luftflotte 2 and 3 wings in round-the-clock saturation firebombing of the beaches, sinking the civilian lift and capturing the entire BEF.",
  interventionSummary: "The Luftwaffe concentrates overwhelming air power to annihilate the evacuation, taking 300,000 British and French prisoners.",
  narrativeEvents: [
    {
      id: "evt-goring-annihilation",
      date: "1940-05-28",
      title: "The firestorm on the dunes",
      summary: "In this counterfactual branch, Hermann Göring overrides tactical caution and commits 1,200 bombers and Stukas in continuous rotating waves over the beaches and shallow channels. Incendiaries and armor-piercing bombs obliterate the wooden hulls of the Little Ships and pulverize the East Mole, trapping 300,000 Allied soldiers in an inferno with no escape by sea.",
      classification: "plausible-projection" as const,
      evidenceIds: ["src-lengel-halt-001", "src-historic-england-001"],
      causalFactorIds: ["evacuation-capacity", "allied-trained-force"],
    },
  ],
  plausibility: {
    minimalRewrite: "Göring personally assured Hitler that the Luftwaffe alone could prevent the evacuation; had he massed anti-shipping dive-bombers and incendiaries continuously over the roadsteads instead of prioritizing inland rail junctions, the civilian flotilla would have been eradicated.",
    evidenceIds: ["src-lengel-halt-001", "src-historic-england-001"],
  },
  seedSelection: { aftermath: 2, decade: 2, present: 1 },
  consequenceSeeds: [
    {
      id: "gla-a1",
      horizon: "aftermath" as const,
      title: "Surrender of 300,000 Allied soldiers",
      summary: "Out of ammunition and water on the blazing dunes, Lord Gort is forced to sign the capitulation of the entire British Expeditionary Force on 31 May 1940.",
      classification: "plausible-projection" as const,
      basis: "With the beaches cut off by relentless air attack, defensive supplies were exhausted within days.",
      evidenceIds: ["src-lengel-halt-001", "src-historic-england-001"],
      causalFactorIds: ["allied-trained-force"],
    },
    {
      id: "gla-a2",
      horizon: "aftermath" as const,
      title: "Churchill government falls in no-confidence vote",
      summary: "The catastrophic loss of the nation's entire professional army shatters parliamentary support for Winston Churchill, who resigns in favor of Lord Halifax.",
      classification: "plausible-projection" as const,
      basis: "Churchill's premiership was less than three weeks old and faced severe internal cabinet skepticism.",
      evidenceIds: ["src-museum-pm-001"],
      causalFactorIds: ["british-political-resolve"],
    },
    {
      id: "gla-a3",
      horizon: "aftermath" as const,
      title: "Destruction of Britain's coastal merchant craft",
      summary: "Hundreds of civilian yachts, tugs, and lifeboats are burned to the waterline, leaving southern English ports without coastal vessels.",
      classification: "direct-inference" as const,
      basis: "Unarmored civilian vessels were completely defenseless against Stuka dive-bombers.",
      evidenceIds: ["src-historic-england-001"],
      causalFactorIds: ["evacuation-capacity"],
    },
    {
      id: "gla-d1",
      horizon: "decade" as const,
      title: "The Halifax Armistice and British surrender",
      summary: "Prime Minister Halifax signs an armistice mediated by Mussolini, demobilizing the Royal Navy and acknowledging German continental hegemony.",
      classification: "plausible-projection" as const,
      basis: "Halifax's proposed terms involved Italian mediation to preserve British imperial sovereignty.",
      evidenceIds: ["src-museum-pm-001", "src-grimsley-peace-001"],
      causalFactorIds: ["british-political-resolve"],
    },
    {
      id: "gla-d2",
      horizon: "decade" as const,
      title: "German invasion of the Soviet Union without a western front",
      summary: "With Britain neutralized in summer 1940, Hitler transfers the entire Wehrmacht east in spring 1941, launching Barbarossa with twice the historical armor and air power.",
      classification: "plausible-projection" as const,
      basis: "Germany maintained over 40 divisions in the West that could have deployed against the USSR.",
      evidenceIds: ["src-grimsley-peace-001"],
      causalFactorIds: ["allied-trained-force"],
    },
    {
      id: "gla-d3",
      horizon: "decade" as const,
      title: "Imperial Japanese annexation of British Asian colonies",
      summary: "A defeated Britain surrenders Singapore, Hong Kong, and Malaya to Japan without resistance, consolidating Japanese control over Southeast Asian rubber and oil.",
      classification: "highly-speculative" as const,
      basis: "Japanese military plans were contingent on the vulnerability of European colonial empires.",
      evidenceIds: ["src-grimsley-peace-001"],
      causalFactorIds: ["british-political-resolve"],
    },
    {
      id: "gla-p1",
      horizon: "present" as const,
      title: "Fascist continental hegemony across Europe",
      summary: "Continental Europe remains an integrated totalitarian economic empire dominated by Berlin, with democratic institutions surviving only in the Western Hemisphere.",
      classification: "highly-speculative" as const,
      basis: "Long-term geopolitical consequence of unchallenged Nazi victory in 1940.",
      evidenceIds: ["src-grimsley-peace-001"],
      causalFactorIds: ["british-political-resolve"],
    },
    {
      id: "gla-p2",
      horizon: "present" as const,
      title: "Fortress America isolationist republic",
      summary: "The United States develops as a heavily militarized, garrisoned continent separated by oceans from an Axis-dominated Old World.",
      classification: "highly-speculative" as const,
      basis: "American geopolitical strategy in the event of total British collapse.",
      evidenceIds: ["src-museum-pm-001"],
      causalFactorIds: ["british-political-resolve"],
    },
  ],
};

export const fallSeeloweImmediateAirborneChoice = {
  id: "fall-seelowe-immediate-airborne",
  tier: "extreme-divergence" as const,
  label: "Immediate Fall Seelöwe: Airborne assault on Kent",
  description: "Kurt Student launches a daring mass paratrooper and glider assault seizing Dover and Folkestone while British defense is in total disarray.",
  interventionSummary: "Fallschirmjäger airborne divisions seize the Channel ports in June 1940 before Britain can rearm.",
  narrativeEvents: [
    {
      id: "evt-seelowe-airborne",
      date: "1940-06-12",
      title: "Student's paratroopers drop on Dover",
      summary: "In this counterfactual branch, General Kurt Student coordinates an immediate airborne assault across the English Channel on 12 June 1940. While British home forces are desperately attempting to organize without rifles or tanks, 8,000 German paratroopers and glider commandos land on the cliffs of Dover and Folkestone, securing harbor berths for motorized barges.",
      classification: "plausible-projection" as const,
      evidenceIds: ["src-lengel-halt-001", "src-historic-england-001"],
      causalFactorIds: ["allied-trained-force", "british-political-resolve"],
    },
  ],
  plausibility: {
    minimalRewrite: "Following the fall of France, German paratroop general Kurt Student proposed an immediate surprise airborne drop against Dover before Britain could reorganize its defenses; with the BEF's heavy weapons abandoned in France, a coup de main was at its maximum window of opportunity.",
    evidenceIds: ["src-lengel-halt-001", "src-historic-england-001"],
  },
  seedSelection: { aftermath: 2, decade: 2, present: 1 },
  consequenceSeeds: [
    {
      id: "fsa-a1",
      horizon: "aftermath" as const,
      title: "Fallschirmjäger secure the Dover cliffs",
      summary: "German airborne troops overwhelm local Home Guard volunteers, capturing Dover Castle and turning coastal defense guns against Royal Navy interceptors.",
      classification: "plausible-projection" as const,
      basis: "British home defense in June 1940 possessed almost no anti-tank guns or trained infantry divisions.",
      evidenceIds: ["src-historic-england-001"],
      causalFactorIds: ["allied-trained-force"],
    },
    {
      id: "fsa-a2",
      horizon: "aftermath" as const,
      title: "Battle of the Kentish Weald",
      summary: "General Ironside throws improvised brigade groups into desperate counterattacks across Kent, suffering heavy casualties against veteran German paratroops.",
      classification: "plausible-projection" as const,
      basis: "General Ironside's GHQ Home Forces plans were hastily improvised static stop lines.",
      evidenceIds: ["src-historic-england-001"],
      causalFactorIds: ["allied-trained-force"],
    },
    {
      id: "fsa-a3",
      horizon: "aftermath" as const,
      title: "Royal Navy sorties into minefields",
      summary: "Royal Navy destroyer flotillas sortie into the Dover Strait to cut German supply lines, suffering severe losses to Luftwaffe dive-bombers and coastal batteries.",
      classification: "direct-inference" as const,
      basis: "The Admiralty had pre-arranged sacrificial destroyer attacks to contest any cross-Channel crossing.",
      evidenceIds: ["src-dowding-001"],
      causalFactorIds: ["raf-fighter-reserve"],
    },
    {
      id: "fsa-d1",
      horizon: "decade" as const,
      title: "The Partition of the British Isles",
      summary: "A conquered Britain is partitioned into an occupied military zone in the south, an autonomous fascist puppet administration in London, and an isolated Scottish redoubt.",
      classification: "plausible-projection" as const,
      basis: "German occupation blueprints for Britain (Informationsheft GB) planned for regional military administrations.",
      evidenceIds: ["src-grimsley-peace-001"],
      causalFactorIds: ["british-political-resolve"],
    },
    {
      id: "fsa-d2",
      horizon: "decade" as const,
      title: "Relocation of the British monarchy to Canada",
      summary: "King George VI, the royal family, and Churchill's war cabinet escape aboard cruisers to Halifax, establishing the imperial seat in Ottawa.",
      classification: "plausible-projection" as const,
      basis: "Official contingency plans existed for the royal family and gold reserves to evacuate to Canada.",
      evidenceIds: ["src-museum-pm-001"],
      causalFactorIds: ["british-political-resolve"],
    },
    {
      id: "fsa-d3",
      horizon: "decade" as const,
      title: "Total Axis Mediterranean hegemony",
      summary: "Without British bases in Gibraltar and Malta, the Mediterranean becomes an Axis lake, cutting the Suez Canal and securing Middle Eastern oil fields for Germany.",
      classification: "highly-speculative" as const,
      basis: "British Mediterranean survival was impossible without sea supply from the British home islands.",
      evidenceIds: ["src-grimsley-peace-001"],
      causalFactorIds: ["allied-trained-force"],
    },
    {
      id: "fsa-p1",
      horizon: "present" as const,
      title: "The North American British Commonwealth",
      summary: "The British imperial government evolves into an integrated North American power based in Canada, maintaining an oceanic alliance with the United States.",
      classification: "highly-speculative" as const,
      basis: "Long-term evolution of an empire in exile headquartered in North America.",
      evidenceIds: ["src-museum-pm-001"],
      causalFactorIds: ["british-political-resolve"],
    },
    {
      id: "fsa-p2",
      horizon: "present" as const,
      title: "A scarred and divided post-war Britain",
      summary: "The British Isles endure decades of guerrilla resistance and foreign garrisoning, leaving lasting scars across the modern British social and political landscape.",
      classification: "highly-speculative" as const,
      basis: "Societal legacy of foreign conquest and resistance warfare in the twentieth century.",
      evidenceIds: ["src-historic-england-001"],
      causalFactorIds: ["british-political-resolve"],
    },
  ],
};
