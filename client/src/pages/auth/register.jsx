import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} replace />;
  }

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Account created successfully!",
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message || "Registration failed",
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
          Join Our Community
        </h1>
        <p className="text-lg text-white/80 max-w-sm mx-auto">
          Create your account today and experience premium shopping with personalized features.
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-white">Easy Sign Up</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm text-white">Secure & Private</span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-white">Instant Access</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Create account
          </h2>
          <p className="text-gray-600">
            Join us and start shopping today
          </p>
        </div>

        <CommonForm
          formControls={registerFormControls}
          buttonText="Sign Up"
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>

      {/* Login Link */}
      <p className="mt-8 text-center text-sm text-white/80">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-white hover:text-white/90 underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default AuthRegister;
