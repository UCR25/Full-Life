import './formWrapper.css'
import '../../global.css'
export function FormWrapper({ title, children }) {
    return (
        <div className="form-wrapper">
            <h2 className="title">{title}</h2>
            <div className="children">
                {children}
            </div>
        </div>
    )
  }
  