import { FormWrapper } from "./formWrapper"

export function FormPage1({ firstName, lastName, age, updateFields }) {
  return (
    <FormWrapper title="Display Name">
      <label>Enter your display name.</label>
      <input
        autoFocus
        required
        type="Display name"
        value={firstName}
        onChange={e => updateFields({ firstName: e.target.value })}
      />
    </FormWrapper>
  )
}