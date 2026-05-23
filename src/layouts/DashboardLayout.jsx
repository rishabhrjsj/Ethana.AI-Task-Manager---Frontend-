import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-64'} min-h-screen`}
      >
        <div className="min-h-screen pb-10">
          <Outlet context={{ collapsed }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
