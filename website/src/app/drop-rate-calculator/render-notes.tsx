import { perkDescriptions } from "@/models/Perks";
import { elementDescriptions } from "@/models/Elements";

export default function RenderNotes({ selectables }) {
  const perks = selectables.selectedPerks();
  let notesHeader = null;
  let perkNotes = null;
  let elementNotes = null;
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
    const element = selectables.selectedElements()[0]?.name;
    if (element) {
      elementNotes = (
        <li>
          <span className="fw-bold">{element}</span>
          {" (element): "}
          {elementDescriptions[element].description}
        </li>
      );
    }
    if (perkNotes || elementNotes) {
      notesHeader = <h2>Notes:</h2>;
    }
    return (
      <div>
        {notesHeader}
        <ul>
          {perkNotes}
          {elementNotes}
        </ul>
      </div>
    );
  }
  return null;
}
