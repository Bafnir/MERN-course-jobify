import { useAppContext } from "../context/appContext"

const Alert = ({message}) => {

    const {alertType, alertText} = useAppContext();

  return (
    <div className={`alert alert-${alertType}`}>
        {alertText}
    </div>
  )
}

export default Alert

