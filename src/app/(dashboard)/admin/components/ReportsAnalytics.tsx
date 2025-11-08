"use client";

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useCustomers } from './Hooks/useCustomers';
import { useJobs } from './Hooks/useJobs';
import { useServiceCategories } from './Hooks/useServiceCategories';
import { useSkills } from './Hooks/useSkills';
import { useTechnicians } from './Hooks/useTechnicians';
import { useUsers } from './Hooks/useUsers';

const ReportsAnalytics = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const { customers, loading: customersLoading, error: customersError } = useCustomers();
  const { emergencyJobs, takenJobs, availableJobs, loading: jobsLoading, error: jobsError } = useJobs();
  const { categories, services, loading: servicesLoading, error: servicesError } = useServiceCategories();
  const { skills, loading: skillsLoading, error: skillsError } = useSkills();
  const { technicians, loading: techniciansLoading, error: techniciansError } = useTechnicians();
  const { users, loading: usersLoading, error: usersError } = useUsers();

  const handleDownloadPdf = async () => {
    if (reportRef.current) {
      const input = reportRef.current;
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('admin-report.pdf');
    }
  };

  const renderLoading = () => <p>Loading...</p>;
  const renderError = (error: string | null) => error ? <p className="text-red-500">Error: {error}</p> : null;

  return (
    <div>
      <button
        onClick={handleDownloadPdf}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Download Report as PDF
      </button>

      <div ref={reportRef} className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Admin Report Overview</h2>

        {/* Customers Section */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Customers</h3>
          {customersLoading ? renderLoading() : renderError(customersError)}
          {!customersLoading && !customersError && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Jobs Section */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Jobs</h3>
          {(jobsLoading.emergency || jobsLoading.taken || jobsLoading.available) ? renderLoading() : null}
          {jobsError.emergency && renderError(`Emergency Jobs Error: ${jobsError.emergency}`)}
          {jobsError.taken && renderError(`Taken Jobs Error: ${jobsError.taken}`)}
          {jobsError.available && renderError(`Available Jobs Error: ${jobsError.available}`)}
          {!(jobsLoading.emergency || jobsLoading.taken || jobsLoading.available) && !jobsError.emergency && !jobsError.taken && !jobsError.available && (
            <>
              <h4 className="text-md font-medium mt-4 mb-2">Emergency Jobs</h4>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emergencyJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{job.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.serviceName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="text-md font-medium mt-4 mb-2">Taken Jobs</h4>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {takenJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{job.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.serviceName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.technicianName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="text-md font-medium mt-4 mb-2">Available Jobs</h4>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availableJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{job.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.serviceName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Service Categories Section */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Service Categories</h3>
          {servicesLoading ? renderLoading() : renderError(servicesError)}
          {!servicesLoading && !servicesError && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{category.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Services Section */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Services</h3>
          {servicesLoading ? renderLoading() : renderError(servicesError)}
          {!servicesLoading && !servicesError && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{service.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{service.category_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{service.base_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Skills</h3>
          {skillsLoading ? renderLoading() : renderError(skillsError)}
          {!skillsLoading && !skillsError && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skills.map((skill) => (
                    <tr key={skill.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{skill.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{skill.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{skill.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Technicians Section */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Technicians</h3>
          {techniciansLoading ? renderLoading() : renderError(techniciansError)}
          {!techniciansLoading && !techniciansError && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {technicians.map((technician) => (
                    <tr key={technician.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{technician.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{technician.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{technician.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{technician.specialties.join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{technician.experience} years</td>
                      <td className="px-6 py-4 whitespace-nowrap">{technician.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Users Section */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-2">Users</h3>
          {usersLoading ? renderLoading() : renderError(usersError)}
          {!usersLoading && !usersError && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
