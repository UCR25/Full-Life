import './formWrapper.css'
export function FormWrapper({ title, children }) {
    return (
        <div className="form-wrapper">
            <h2>{title}</h2>
            <div className="children">
                {children}
            </div>
        </div>
    )
  }
  