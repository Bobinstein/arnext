import React from "react";
import { Link } from "@/arnext";

/**
 * RecordsGrid component for displaying a grid of record keys.
 * @param {Object} props - Component props.
 * @param {Array<string>} props.keys - Array of record keys to display.
 */
const RecordsGrid = ({ keys }) => {
  return (
    <div className="records-grid">
      {keys.map((key, index) => (
        <Link href={`/names/${key}`} key={index}>
        <button
          key={index}
          className="record-key"
          onClick={() => {console.log(`clicked on ${key}`)}}
        >
          {key}
        </button>
        </Link>
      ))}
    </div>
  );
};

export default RecordsGrid;