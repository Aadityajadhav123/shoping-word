import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header - Logo only */}
      <div className="w-full p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">ShopFast</span>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
