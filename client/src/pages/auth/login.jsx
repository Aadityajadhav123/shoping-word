import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} replace />;
  }

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Welcome back!",
        });
      } else {
        toast({
          title: data?.payload?.message || "Login failed",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-3xl font-bold text-white">ShopFast</span>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Your Premium<br />
          Shopping Experience
        </h1>
        <p className="text-lg text-white/80 max-w-sm mx-auto">
          Access your account to discover exclusive deals, track orders, and manage your preferences.
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-white">Secure Access</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-white">24/7 Available</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm text-white">Lightning Fast</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Sign in to continue to your account
          </p>
        </div>

        <CommonForm
          formControls={loginFormControls}
          buttonText="Sign In"
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>

      {/* Register Link */}
      <p className="mt-8 text-center text-sm text-white/80">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-white hover:text-white/90 underline underline-offset-4 transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
