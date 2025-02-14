import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import logo from './assets/logo.png'
import './App.css'

function App() {
  // State for managing form steps
  const [currentStep, setCurrentStep] = useState(1)
  
  // State for ticket selection
  const [ticketData, setTicketData] = useState({
    ticketType: '',
    numberOfTickets: '1',
  })

  // State for user information
  const [userInfo, setUserInfo] = useState({
    profilePhotoUrl: '',
    name: '',
    email: '',
    specialRequest: ''
  })

  // Upload state
  const [isUploading, setIsUploading] = useState(false)
  
  // State for form validation
  const [errors, setErrors] = useState({})

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ticket_avatar')
      formData.append('cloud_name', 'dojxic0lw') 
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dojxic0lw/image/upload`, 
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()
      
      if (data.secure_url) {
        setUserInfo(prev => ({
          ...prev,
          profilePhotoUrl: data.secure_url
        }))
        setErrors(prev => ({
          ...prev,
          profilePhoto: ''
        }))
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        profilePhoto: 'Failed to upload image. Please try again.'
      }))
    } finally {
      setIsUploading(false)
    }
  }

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Please upload an image file'
        }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePhoto: 'Image size should be less than 5MB'
        }))
        return
      }

      await uploadToCloudinary(file)
    }
  }

  // Handle ticket type selection
  const handleTicketTypeChange = (e) => {
    setTicketData({
      ...ticketData,
      ticketType: e.target.id
    })
  }

  // Handle number of tickets change
  const handleTicketNumberChange = (e) => {
    setTicketData({
      ...ticketData,
      numberOfTickets: e.target.value
    })
  }

  // Handle user info changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target
    setUserInfo({
      ...userInfo,
      [name]: value
    })
  }

  // Validate current step
  const validateStep = () => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!ticketData.ticketType) {
        newErrors.ticketType = 'Please select a ticket type'
      }
    }

    if (currentStep === 2) {
      if (!userInfo.name) {
        newErrors.name = 'Name is required'
      }
      if (!userInfo.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (!userInfo.profilePhotoUrl) {
        newErrors.profilePhoto = 'Profile photo is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  // Handle cancel
  const handleCancel = () => {
    setCurrentStep(1)
    setTicketData({
      ticketType: '',
      numberOfTickets: '1'
    })
    setUserInfo({
      profilePhotoUrl: '',
      name: '',
      email: '',
      specialRequest: ''
    })
  }

  return (
    <div className='container'>
      <header className='header'>
        <img src={logo} className='logo' alt='ticz'/>
        <ul className='link_list'>
          <li><a href='#'>Events</a></li>
          <li><a href='#'>My Tickets</a></li>
          <li><a href='#'>About Project</a></li>
        </ul>
        <button className='ticket_btn'>
          MY TICKETS  →
        </button>
      </header> 
      <section className="page_container">       
        <div className="progress">
          <div className="progress_header">
            <h2>Ticket Selection</h2>
            <p>Step {currentStep}/3</p>
          </div>
          <div className="progress_bar">
            <div 
              className="progress_bar_fill" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step 1: Ticket Selection */}
        <section className='ticket_type' style={{display: currentStep === 1 ? "block" : "none"}}>
          <div className="announcement">
            <h2>Thechember Fest "25 </h2>
            <p>Join us for an unforgettable experience at Techember Fest "25! Secure your spot now.</p>
            <p>📍 ASO Rock || March 15, 2025 | 7:00 PM</p>
          </div>
          <div className="hr"></div>
          <div className="ticket_type_container">
            <div className="ticket_type_item_header">
              <h3>Select Ticket Type:</h3>
              {errors.ticketType && <p className="error">{errors.ticketType}</p>}
            </div>
            <div className="ticket_type_item">
              <label htmlFor="ticket_type_1">
                <input 
                  type="radio" 
                  name="ticket_type" 
                  id="ticket_type_1"
                  checked={ticketData.ticketType === 'ticket_type_1'}
                  onChange={handleTicketTypeChange}
                />
                <p className="ticket_type_item_name">
                  <span>Free</span> 
                  <span>REGULAR ACCESS</span>   
                  <span>20/50</span> 
                </p>
              </label>
              <label htmlFor="ticket_type_2">
                <input 
                  type="radio" 
                  name="ticket_type" 
                  id="ticket_type_2"
                  checked={ticketData.ticketType === 'ticket_type_2'}
                  onChange={handleTicketTypeChange}
                />
                <p className="ticket_type_item_name">
                  <span>$50</span> 
                  <span>VIP ACCESS</span>   
                  <span>20/50</span> 
                </p>
              </label>
              <label htmlFor="ticket_type_3">
                <input 
                  type="radio" 
                  name="ticket_type" 
                  id="ticket_type_1"
                  checked={ticketData.ticketType === 'ticket_type_3'}
                  onChange={handleTicketTypeChange}
                />
                <p className="ticket_type_item_name">
                  <span>$150</span> 
                  <span>VIP ACCESS</span>   
                  <span>20/50</span> 
                </p>
              </label>
              {/* Similar changes for other ticket types */}
            </div>
          </div>
          <div className="number_ticket">
            <label className="number_ticket_header">Number of Tickets</label>
            <select 
              name="ticket_number" 
              id="ticket_number"
              value={ticketData.numberOfTickets}
              onChange={handleTicketNumberChange}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="action_buttons">
            <button className='cancel-prev' onClick={handleCancel}>Cancel</button>
            <button className='next' onClick={handleNext}>Next</button>
          </div>
        </section>

        {/* Step 2: User Information - updated with Cloudinary upload */}
        <section className="ticket_information" style={{display: currentStep === 2 ? "block" : "none"}}>
          <div className="upload_container">
            <p>Upload Profile Photo *</p>
            {errors.profilePhoto && <p className="error">{errors.profilePhoto}</p>}
            <div className="upload_img_container">
              <label htmlFor="upload_img" className='upload_img'>
                {isUploading ? (
                  'Uploading...'
                ) : userInfo.profilePhotoUrl ? (
                  <div className="preview-container">
                    <img 
                      src={userInfo.profilePhotoUrl} 
                      alt="Profile preview" 
                      className="preview-image"
                    />
                    <span>Click to change image</span>
                  </div>
                ) : (
                  'Drag & Drop or Click to Upload'
                )}
                <input 
                  type="file" 
                  id="upload_img"
                  onChange={handleFileUpload}
                  accept="image/*"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          {/* Rest of the form remains the same */}
          <div className="hr"></div>
          <div className="ticket_info">
            <div className="inputs">
              <label htmlFor="name">Enter Your Name: *</label>
              {errors.name && <p className="error">{errors.name}</p>}
              <input 
                type="text" 
                id="name" 
                name="name"
                value={userInfo.name}
                onChange={handleUserInfoChange}
                required 
              />
            </div>
            <div className="inputs">
              <label htmlFor="email">Enter Your Email: *</label>
              {errors.email && <p className="error">{errors.email}</p>}
              <input 
                type="email" 
                id="email" 
                name="email"
                value={userInfo.email}
                onChange={handleUserInfoChange}
                placeholder='hello@avioflagos.io' 
                required
              />
            </div>
            <div className="inputs">
              <label htmlFor="specialRequest">Special Request ?</label>
              <textarea 
                name="specialRequest"
                value={userInfo.specialRequest}
                onChange={handleUserInfoChange}
                placeholder='Textarea'
              ></textarea>
            </div>
          </div>
          <div className="action_buttons">
            <button 
              className='cancel-prev' 
              onClick={handlePrevious}
              disabled={isUploading}
            >
              Previous
            </button>
            <button 
              className='next' 
              onClick={handleNext}
              disabled={isUploading}
            >
              Next
            </button>
          </div>
        </section>

        {/* Step 3: Confirmation - updated to show uploaded image */}
        <section className="final-step" style={{display: currentStep === 3  ? "block" : "none"}}>
          <div className="booking-status">
            <h2>Your Ticket is Booked</h2>
            <p>Check your email for a copy or you can download</p>
          </div>

      <div className="ticket-card " >
        <div className="ticket-content">
          <h1>Techember Fest '25</h1>
          <div className="event-details">
            <p>📍 04 Rumens road, Ikoyi, Lagos</p>
            <p>📅 March 15, 2025 | 7:00 PM</p>
          </div>

          <div className="profile-section">
            {userInfo.profilePhotoUrl && (
              <img 
                src={userInfo.profilePhotoUrl} 
                alt="Profile" 
                className="profile-image"
              />
            )}
          </div>

          <div className="ticket-info-grid">
            <div className="info-row">
              <div className="info-cell cell-1">
                <label>Name:</label>
                <p>{userInfo.name}</p>
              </div>
              <div className="info-cell cell-2">
                <label>Email:</label>
                <p>{userInfo.email}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-cell cell-3">
                <label>Ticket Type:</label>
                <p>{ticketData.ticketType === 'ticket_type_1' ? 'Regular' : 'VIP'}</p>
              </div>
              <div className="info-cell cell-4">
                <label>Ticket for:</label>
                <p>{ticketData.numberOfTickets}</p>
              </div>
            </div>
            {userInfo.specialRequest && (
              <div className="special-request">
                <p>{userInfo.specialRequest}</p>
              </div>
            )}
          </div>
          <div className="barcode_divider">
            <span className="o">0</span> <span className="o">0</span>
            <span className="o">0</span> <span className="o">0</span>
            <span className="o">0</span> <span className="o">0</span>
            <span className="o">0</span> <span className="o">0</span>
            <span className="o">0</span><span className="o">0</span>
            <span className="o">0</span> <span className="o">0</span>
            <span className="o">0</span> <span className="o">0</span>
            <span className="o">0</span> <span className="o">0</span>
          </div>

          <div className="barcode">

            {/* Placeholder for barcode - you can use a barcode library here */}
            <div className="barcode-placeholder"></div>
          </div>

        </div>

      </div>
  
      <div className="action_buttons">
        <button className="book-another cancel-prev" onClick={() => window.location.reload()}>
          Book Another Ticket
        </button>
        <button className="download-ticket next">
          Download Ticket
        </button>
      </div>
    
        </section>
        
 </section>      
    </div>
  )
}

export default App
