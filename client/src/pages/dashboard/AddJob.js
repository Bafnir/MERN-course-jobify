import { FormRow, Alert, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'


const AddJob = () => {
  const {
    isEditing,
    isLoading,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    EditJob,
  } = useAppContext()

  const handleJobInput = (e) =>{
    const name = e.target.name
    const value =  e.target.value
    handleChange({name,value});
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    if(!position || !company || !jobLocation){
      displayAlert()
      return
    }
    if(isEditing){
      EditJob();
      return
    }
    createJob();
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* position */}
          <FormRow type="text" name="position" value={position} handleChange={handleJobInput}/>
          {/* company */}
          <FormRow type="text" name="company" value={company} handleChange={handleJobInput}/>
          {/* location */}
          <FormRow type="text" name="jobLocation" labelText="job location" value={jobLocation} handleChange={handleJobInput}/>
          {/*job type */}
          <FormRowSelect labelText="job type" name="jobType" value={jobType} handleChange={handleJobInput} list={jobTypeOptions}/>
          {/*job status */}
          <FormRowSelect labelText="status" name="status" value={status} handleChange={handleJobInput} list={statusOptions}/>
          <div className='btn-container'>
            <button type="submit" className='btn btn-block submit-btn' onClick={handleSubmit} disabled={isLoading}>submit</button> 
            <button className='btn btn-block clear-btn' onClick={(e) => { 
            e.preventDefault();
            clearValues()}}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper> 
  )
}

export default AddJob
