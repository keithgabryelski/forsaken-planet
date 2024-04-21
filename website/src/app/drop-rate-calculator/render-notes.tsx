import {
  perkDescriptions,
  damageTypeDescriptions,
} from "@/models/DungeonsOfEternityCache";

export default function RenderNotes({ selectables }) {
  const perks = selectables.selectedPerks();
  let notesHeader = null;
  let perkNotes = null;
  let damageTypeNotes = null;
  if (perks.length > 0) {
    perkNotes = perks.map((perk) => {
      return (
        <li key={perk.name}>
          <span className="fw-bold">{perk.name}</span>
          {" (perk): "}
          {perkDescriptions[perk.name]?.description}
        </li>
      );
    });
    const damageType = selectables.selectedDamageTypes()[0]?.name;
    if (damageType) {
      damageTypeNotes = (
        <li>
          <span className="fw-bold">{damageType}</span>
          {" (damage type): "}
          {damageTypeDescriptions[damageType]}
        </li>
      );
    }
    if (perkNotes || damageTypeNotes) {
      notesHeader = <h2>Notes:</h2>;
    }
    return (
      <div>
        {notesHeader}
        <ul>
          {perkNotes}
          {damageTypeNotes}
        </ul>
      </div>
    );
  }
  return null;
}
