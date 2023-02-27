import React from 'react'
import { useState } from 'react'
import { useAppContext } from '../../context/appContext'
import { FormRow, Alert} from '../../components'
import Wrapper from '../../assets/wrappers/DashboardFormPage'


const Profile = () => {

  const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext()

  const [name,setName] = useState(user?.name)
  const [email,setEmail] = useState(user?.email)
  const [lastName,setLastName] = useState(user?.lastName)
  const [location,setLocation] = useState(user?.location)

  /*
  const handleChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value})
  };*/

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!name || !email || !lastName || !location){
      displayAlert()
      return
    }
    updateUser({name,email,lastName,location})
  };

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow type="text" name="name" value={name} handleChange={(e) => setName(e.target.value)}/>
          <FormRow type="text" name="lastName" value={lastName} labelText="Last Name" handleChange={(e) => setLastName(e.target.value)}/>
          <FormRow type="text" name="email" value={email} handleChange={(e) => setEmail(e.target.value)}/>
          <FormRow type="text" name="location" value={location} handleChange={(e) => setLocation(e.target.value)}/>
          <button className='btn btn-block' type="submit" disabled={isLoading}>
            {isLoading? 'Please wait' : 'Submit'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile
