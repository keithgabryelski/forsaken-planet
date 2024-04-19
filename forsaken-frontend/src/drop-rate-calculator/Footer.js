import {
  perkDescriptions,
  damageTypeDescriptions,
} from "../models/DungeonsOfEternityCache";

function Footer({ selectables }) {
  const perks = selectables.selectedPerks();
  let notesHeader = null;
  let perkNotes = null;
  let damageTypeNotes = null;
  if (perks.length > 0) {
    perkNotes = perks.map((perk) => {
      return (
        <div key={perk.name}>
          <span className="fw-bold">{perk.name}</span>
          {" (perk): "}
          {perkDescriptions[perk.name]?.description}
        </div>
      );
    });
    const damageType = selectables.selectedDamageTypes()[0]?.name;
    if (damageType) {
      damageTypeNotes = (
        <div>
          <span className="fw-bold">{damageType}</span>
          {" (damage type): "}
          {damageTypeDescriptions[damageType]}
        </div>
      );
    }
    if (perkNotes || damageTypeNotes) {
      notesHeader = <h2>Notes:</h2>;
    }
    return (
      <div>
        {notesHeader}
        {perkNotes}
        {damageTypeNotes}
      </div>
    );
  }
  return null;
}

export default Footer;
