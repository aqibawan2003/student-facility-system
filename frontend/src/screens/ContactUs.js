import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactUs = () => {
  // Form state to hold the input values
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send formData to admin (API call)
    // Example: 
    // fetch('/api/send-message', { method: 'POST', body: JSON.stringify(formData) })

    console.log(formData);
    alert('Message Sent Successfully!');
  };

  return (
    <div className='bg-[#1E201E]'>
      <Navbar module={"home"}/>
    

      {/* Background Image Section */}
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGlsbHVzdHJhdGlvbiUyMGJhY2tncm91bmQlMjAlMjBwaWMlMjBmb3IlMjBhYm91dCUyMHVzJTIwcGFnZSUyMHdpdGglMjBhJTIwaG9zdGVsJTIwYW5kJTIwa2l0Y2hlbiUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D')`,height:'500px' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Contact Us</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center min-h-screen bg-[#1E201E]">
        <div className="bg-[#25292e] shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6  text-white text-center">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Message</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Your message"
              />
            </div>
            <div className="text-center">
              <button 
                type="submit" 
                className="w-full bg-[#1E201E] text-white py-2 px-4 rounded-md  transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUs;
