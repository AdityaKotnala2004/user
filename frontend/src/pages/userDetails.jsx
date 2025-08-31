import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from 'axios';

const ProfileForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    dob: "",
    bloodType: "",
    allergies: "",
    medications: "",
    conditions: "",
    emergencyName: "",
    emergencyPhone: "",
    insuranceProvider: "",
    policyNumber: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBloodType = (type) => {
    setFormData({ ...formData, bloodType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if any field is empty
    for (let key in formData) {
      if (!formData[key]) {
        setError("⚠️ Please fill all the required fields.");
        return;
      }
    }
    setError("");

    // Sanitize phone, emergencyPhone, and zip fields
    const sanitizedData = {
      ...formData,
      phone: formData.phone.replace(/\D/g, '').trim(),
      emergencyPhone: formData.emergencyPhone.replace(/\D/g, '').trim(),
      zip: formData.zip.replace(/\D/g, '').trim(),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user-details/save`,
        sanitizedData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log('Details saved:', data);
        navigate("/home"); // Redirect on success
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // Show express-validator errors if present
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          setError(err.response.data.errors.map(e => e.msg).join(' | '));
        } else {
          setError(err.response.data.message || 'Something went wrong. Please try again.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold ml-4">Complete Your Profile</h1>
        </div>

        {/* Info text */}
        <p className="text-gray-600 mb-6">
          This information helps us provide better emergency care
        </p>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter 10-digit phone"
              required
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Blood Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Blood Type *</label>
            <div className="grid grid-cols-4 gap-2">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleBloodType(type)}
                  className={`p-2 border rounded ${formData.bloodType === type ? 'bg-blue-500 text-white' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium mb-1">Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., Peanuts, Penicillin"
            />
          </div>

          {/* Medications */}
          <div>
            <label className="block text-sm font-medium mb-1">Current Medications</label>
            <input
              type="text"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., Aspirin, Insulin"
            />
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm font-medium mb-1">Medical Conditions</label>
            <input
              type="text"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., Diabetes, Asthma"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Emergency Contact Name *</label>
            <input
              type="text"
              name="emergencyName"
              value={formData.emergencyName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Emergency Contact Phone *</label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter 10-digit phone"
              required
            />
          </div>

          {/* Insurance Provider */}
          <div>
            <label className="block text-sm font-medium mb-1">Insurance Provider</label>
            <input
              type="text"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Policy Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code *</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded font-medium mt-4"
          >
            {loading ? 'Saving...' : 'Save Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
