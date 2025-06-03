"use client";

import * as React from "react";
import { MAX_LEVEL } from "./utils";

export default function XPTable() {
  return (
    <table border={1} margin={1} width="100%">
      <caption>Table of Experience Points Required per Level</caption>
      <tbody>
        <tr>
          <th>+</th>
          {Array.from(
            { length: Math.floor(MAX_LEVEL / 10) + 1 },
            (_, i) => i,
          ).map((level) => (
            <th key={`level_header_column_${level * 10}`}>{level * 10}</th>
          ))}
        </tr>
        {Array.from({ length: 10 }, (_, i) => i).map((level_index) => {
          return (
            <tr key={`level_row_${level_index}`}>
              <th key={`level_index_header_${level_index}`}>{level_index}</th>

              {Array.from(
                { length: Math.floor(MAX_LEVEL / 10) + 1 },
                (_, i) => i,
              ).map((level_base) => {
                const level = level_base * 10 + level_index;
                if (level === 0 || level > 60) {
                  return <td key={`level_cell_${level}`}>-x-</td>;
                }
                const xp = 250 * (level + 2) * (level - 1);
                return <td key={`level_cell_${level}`}>{xp}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
