import { FormWrapper } from "./formWrapper.jsx"

export default function FormPage2({ displayName, updateFields }) {
  return (
    <FormWrapper title="Display Name">
      <div className="input-group">
        <label htmlFor="displayName">Enter your display name.</label>
        <input
          id="displayName"
          autoFocus
          required
          type="text"
          placeholder="Type..."
          value={displayName}
          onChange={e => updateFields({ displayName: e.target.value })}
        />
      </div>
    </FormWrapper>
  )
}
export function validateFormPage(data) {
  return data.displayName.trim().length > 0;
}