import React from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { FaceScanner } from '../components/dashboard/FaceScanner';

const DashboardScan = () => {
  return (
    <DashboardLayout>
      {/* Header Area */}
      <header className="mb-8">
        <h1 className="text-4xl font-medium tracking-tight text-[#121212] flex items-center gap-3">
          Face Scanner
        </h1>
        <p className="text-gray-500 mt-2">Initialize the MediaPipe engine to detect your mood in real-time.</p>
      </header>

      {/* Main Content */}
      <FaceScanner />
    </DashboardLayout>
  );
};

export default DashboardScan;
