import { requireRole } from "@/app/_shared/lib/auth-guard";

export default async function TechnicianDashboard() {
  // Server-side authentication - only technicians can access this page
  const { user } = await requireRole("technician");

  return (
    <main className="min-h-[calc(100vh-4rem)] pt-24 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Technician Dashboard
          </h1>
          <p className="text-slate-600">Welcome back, {user.name || user.email}!</p>
          <p className="text-sm text-slate-500">Role: {user.role} • Email: {user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service Assignments */}
          <div className="p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Service Assignments</h2>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <h3 className="font-medium">HVAC Installation</h3>
                <p className="text-sm text-slate-600">123 Main St - Today 2:00 PM</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <h3 className="font-medium">System Maintenance</h3>
                <p className="text-sm text-slate-600">456 Oak Ave - Tomorrow 10:00 AM</p>
              </div>
            </div>
          </div>

          {/* Work Orders */}
          <div className="p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Work Orders</h2>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border">
                <h3 className="font-medium">Repair Request</h3>
                <p className="text-sm text-slate-600">Urgent - AC not cooling</p>
              </div>
              <div className="p-3 bg-white rounded border">
                <h3 className="font-medium">Routine Check</h3>
                <p className="text-sm text-slate-600">Monthly maintenance visit</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="p-6 bg-slate-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Jobs Completed</span>
                  <span>24/30</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Rating</span>
                  <span>4.8/5.0</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Schedule
            </button>
            <button className="p-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Start Job
            </button>
            <button className="p-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
              Report Issue
            </button>
            <button className="p-4 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
