import React from "react";

function ReadingList() {
  return (
    <ul style={{ listStyle: "none" }}>
      <li>
        <a href="/mediawiki">Dungeons of Eternity wiki</a>
      </li>
      <li>
        <a href="https://bit.ly/doe-gear-drop-calculator">
          Gear Drop Calculator
        </a>
      </li>
      <li>
        <a href="http://bit.ly/dungeons-of-eternity-statistics">
          Drop Rate Spreadsheets
        </a>
      </li>
      <li>
        Join Dungeons of Eternity on{" "}
        <a href="https://discord.gg/Wwc22C2KCS">Discord</a>
      </li>
      <li>
        Use the{" "}
        <a href="https://www.meta.com/referrals/link/Protagosus">
          Meta Referral Program
        </a>{" "}
        (it helps!)
      </li>
    </ul>
  );
}

export default ReadingList;
