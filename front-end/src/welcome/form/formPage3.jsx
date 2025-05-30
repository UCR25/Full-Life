import { FormWrapper } from "./formWrapper.jsx"
import { useEffect, useState } from "react";
import "./formPage3.css";

const HOBBY_OPTIONS = [
  "Running", "Sports", "Nature", "Arts & Crafts", "Music",
   "Games", "Cooking", "Food", "Travel", "Film"
];

export default function FormPage3({ hobbies = [], updateFields }) {
  const [selected, setSelected] = useState(hobbies);

  useEffect(() => {
    updateFields({ hobbies: selected });
  }, [selected, updateFields]);

  function toggleHobby(hobby) {
    setSelected(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  }
  return (
    <FormWrapper title="Hobby Selection">
      <div className="input-group">
        <label htmlFor="displayName">Select at least five hobbies.</label>
        <div className="chip-container">
        {HOBBY_OPTIONS.map((hobby) => (
          <button
            key={hobby}
            type="button"
            className={`chip ${selected.includes(hobby) ? "selected" : ""}`}
            onClick={() => toggleHobby(hobby)}
          >
            {hobby}
          </button>
        ))}
        </div>
      </div>
    </FormWrapper>
  )
}
export function validateFormPage(data) {
    return Array.isArray(data.hobbies) && data.hobbies.length >= 5;
}