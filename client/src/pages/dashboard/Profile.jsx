import { useState } from 'react';
import { FormRow, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext()

  const [formData,setFormData]=useState({
    name:user?.name,
    email:user?.email,
    lastName:user?.lastName,
    location:user?.location
  })
  

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.lastName || !formData.location) {
      // test and remove temporary
      displayAlert()
      return
    }
    updateUser(formData)
  }
  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile </h3>
        {showAlert && <Alert />}

        {/* name */}
        <div className='form-center'>
          <FormRow
            type='text'
            name='name'
            value={formData.name}
            handleChange={(e) => setFormData({...formData,name:e.target.value})}
          />
          <FormRow
            labelText='last name'
            type='text'
            name='lastName'
            value={formData.lastName}
            handleChange={(e) => setFormData({...formData,lastName:e.target.value})}
          />
          <FormRow
            type='email'
            name='email'
            value={formData.email}
            handleChange={(e) => setFormData({...formData,email:e.target.value})}
          />

          <FormRow
            type='text'
            name='location'
            value={formData.location}
            handleChange={(e) => setFormData({...formData,location:e.target.value})}
          />
          <button className='btn btn-block' type='submit' disabled={isLoading}>
            {isLoading ? 'Please Wait...' : 'save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile