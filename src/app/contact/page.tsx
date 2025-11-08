"use client";

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare, Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        // Handle server errors (e.g., 500)
        toast.error('Failed to send message. Please try again later.');
      }
    } catch (error) {
      // Handle network errors
      console.error('Contact form submission error:', error);
      toast.error('An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" theme="colored" />
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h1>
          <p className="text-gray-600">Have a question or need our services? We're here to help!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Phone className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Phone</p>
                    <a href="tel:+639397176257" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      (0939) 717-6257
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <Mail className="text-green-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Email</p>
                    <a href="mailto:mabalealbert@yahoo.com" className="text-sm text-gray-600 hover:text-blue-600 transition-colors break-all">
                      mabalealbert@yahoo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl">
                    <MapPin className="text-purple-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Address</p>
                    <p className="text-sm text-gray-600">262 St. Peter St. cor Sta. Monica St., Brgy Holy Spirit, Quezon City</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <Clock className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Business Hours</p>
                    <p className="text-sm text-gray-600">Monday - Friday: 8AM - 6PM</p>
                    <p className="text-sm text-gray-600">Saturday: 9AM - 5PM</p>
                    <p className="text-sm text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Emergency Service</h3>
              <p className="text-sm text-blue-50 mb-4">24/7 emergency support available for urgent repairs</p>
              <a href="tel:+639397176257" className="w-full block text-center px-4 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                Call Emergency Line
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(0917) 123-4567"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-gray-400" size={20} />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Tell us about your project or inquiry..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:bg-yellow-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;