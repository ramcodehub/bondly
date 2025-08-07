import React from 'react';
import './LeadData.css';
import profileImg from '../../../../assets/Profile.jpg';

const LeadData = ({name}) => {
    const leads = [
  {
    id: 1,
    name: 'Christopher Maclead (Sample)',
    company: 'Rangoni Of Florence',
    email: 'christopher-email.invalid',
    phone: '9876543210',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'Website',
    isToday: false,
  },
  {
    id: 2,
    name: 'Carissa Kidman (Sample)',
    company: 'Oh My Goodknits Inc',
    email: 'carissa-kidman.invalid',
    phone: '9123456780',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'Referral',
    isToday: true,
  },
  {
    id: 3,
    name: 'James Merced (Sample)',
    company: 'Kwik Kopy Printing',
    email: 'james-merced.invalid',
    phone: '9988776655',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'Google Ads',
    isToday: false,
  },
  {
    id: 4,
    name: 'Felix Hirpara (Sample)',
    company: 'Chapman',
    email: 'felix-hirpara.invalid',
    phone: '9112233445',
    leadOwner: 'Hari Shankar Bhaskar',
    leadSource: 'LinkedIn',
    isToday: true,
  },
];

  return (
    <div className='main-content'>
      <div className="lead-header">
      <div className="lead-info">
        <button className="back-button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <img src={profileImg} alt="Profile" className="profile-img" />
        <div className="lead-text">
          <h2>Mr. Christopher Maclead <span>(Sample)</span></h2>
          <p>Rangoni Of Florence</p>
          <span className="add-tag"><i className="bi bi-tag-fill"></i> Add Tags</span>
        </div>
      </div>
      <div className="lead-actions">
        <button className="icon-button">
          <i className="bi bi-pen"></i>
        </button>
        <button className="blue-button">Send Email</button>
        <button className="light-button">Convert</button>
        <button className="light-button">Edit</button>
        <button className="light-button"><i className="bi bi-three-dots"></i></button>
        <button className="arrow-button"><i className="bi bi-chevron-left"></i></button>
        <button className="arrow-button"><i className="bi bi-chevron-right"></i></button>
      </div>
    </div>
    </div>
  )
}

export default LeadData
