import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import { UserCog, User, Truck, X } from "lucide-react";

function Login() {
  const { staff, setStaff, owner, setOwner, vendor, setVendor, user, setUser, token, setToken, shopCode, setShopCode, showLogin, setShowLogin, backendUrl, role, setRole } = useContext(AppContext);
  const [person, setPerson] = useState("owner");
  const [state, setState] = useState("Signin");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/${person}/${state.toLowerCase()}`, formData);
      const data = response.data;
      if (!data.success) { alert(data.message || "Login failed"); return; }
      localStorage.setItem("token", data.token); localStorage.setItem("role", person);
      setToken(data.token); setRole(person);
      if (person === "owner" || person === "staff") {
        const sc = person === "owner" ? data.owner.shopCode : data.staff.shopCode;
        localStorage.setItem("shopCode", sc); setShopCode(sc);
      }
      const loggedUser = data.owner || data.staff || data.vendor;
      localStorage.setItem("user", JSON.stringify(loggedUser)); setUser(loggedUser);
      setOwner(person === "owner"); setStaff(person === "staff"); setVendor(person === "vendor");
      setShowLogin(false);
      if (person === "vendor") {
      navigate("/vendormedicines");
      }
    } catch (error) { alert(error.response?.data?.message || "Server error"); }
  };

  return (
    <>
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-3 sm:p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 w-full max-w-md mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative animate-scaleIn">

            <button onClick={() => setShowLogin(false)} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all">
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0C2C47] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <div className="text-white text-xl sm:text-2xl font-bold">{state === "Signup" ? "👋" : "🔑"}</div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                {state === "Signup" ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                {state === "Signup" ? "Join MedoSof and transform your pharmacy management" : "Sign in to access your pharmacy dashboard"}
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6 sm:mb-8">
              <p className="text-sm sm:text-base font-medium text-gray-700 mb-3 text-center">I am a</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ value: "owner", label: "Owner", Icon: UserCog }, { value: "staff", label: "Staff", Icon: User }, { value: "vendor", label: "Vendor", Icon: Truck }].map(({ value, label, Icon }) => (
                  <button key={value} type="button" onClick={() => setPerson(value)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${person === value ? "border-[#0C2C47] bg-[#0C2C47]/10 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                    <Icon className={`w-5 h-5 sm:w-7 sm:h-7 mb-1.5 sm:mb-2 ${person === value ? "text-[#0C2C47]" : "text-gray-600"}`} />
                    <span className={`text-xs sm:text-sm font-medium ${person === value ? "text-[#0C2C47]" : "text-gray-700"}`}>{label}</span>
                    {person === value && <div className="w-2 h-2 bg-[#0C2C47] rounded-full mt-1.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {state === "Signup" && (
                <>
                  <Input label="Full Name" name="name" type="text" handleChange={handleChange} icon="👤" placeholder="John Doe" />
                  <Input label="Email Address" name="mail" type="email" handleChange={handleChange} icon="📧" placeholder="john@example.com" />
                  <Input label="Password" name="password" type="password" handleChange={handleChange} icon="🔒" placeholder="••••••••" />
                  {person === "owner" && (
                    <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><span className="text-blue-500">🏪</span>Pharmacy Details</h4>
                      <Input label="Shop Code" name="shopCode" type="text" handleChange={handleChange} placeholder="PH-001" />
                      <Input label="Shop Name" name="shopName" type="text" handleChange={handleChange} placeholder="MediCare Pharmacy" />
                      <Input label="Shop Address" name="shopAddress" type="text" handleChange={handleChange} placeholder="123 Medical Street" />
                      <Input label="Number of Staff" name="numberOfStaff" type="number" handleChange={handleChange} placeholder="5" />
                    </div>
                  )}
                  {person === "vendor" && (
                    <div className="pt-3 border-t border-gray-100">
                      <Input label="Contact Number" name="contactNumber" type="tel" handleChange={handleChange} icon="📞" placeholder="+1 234 567 8900" />
                    </div>
                  )}
                  {person === "staff" && (
                    <div className="pt-3 border-t border-gray-100">
                      <Input label="Shop Code" name="shopCode" type="text" handleChange={handleChange} icon="🏪" placeholder="Enter shop code" />
                    </div>
                  )}
                </>
              )}
              {state === "Signin" && (
                <>
                  <Input label="Email Address" name="mail" type="email" handleChange={handleChange} icon="📧" placeholder="john@example.com" />
                  <Input label="Password" name="password" type="password" handleChange={handleChange} icon="🔒" placeholder="••••••••" />
                  {person === "staff" && <Input label="Shop Code" name="shopCode" type="text" handleChange={handleChange} icon="🏪" placeholder="Enter shop code" />}
                  <div className="text-right"><button type="button" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">Forgot password?</button></div>
                </>
              )}
              <button type="submit" className="w-full py-2.5 sm:py-3 bg-[#0C2C47] text-white font-semibold rounded-xl hover:bg-[#0A243A] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-3 sm:mt-4 text-sm sm:text-base">
                <span className="flex items-center justify-center gap-2">
                  {state === "Signup" ? <><span>Create Account</span><span>→</span></> : <><span>Sign In</span><span>🔓</span></>}
                </span>
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-xs sm:text-sm">
                {state === "Signup" ? "Already have an account?" : "Don't have an account?"}
                <button type="button" onClick={() => setState(state === "Signup" ? "Signin" : "Signup")}
                  className="ml-2 font-semibold text-[#0C2C47] hover:underline transition-colors">
                  {state === "Signup" ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>

            {state === "Signup" && (
              <p className="mt-4 sm:mt-6 text-xs text-center text-gray-400">
                By creating an account, you agree to our
                <button className="text-blue-500 hover:underline ml-1">Terms</button> and
                <button className="text-blue-500 hover:underline ml-1">Privacy Policy</button>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const Input = ({ label, name, type, handleChange, icon, placeholder }) => (
  <div className="group">
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 ml-1">
      {icon && <span className="mr-2">{icon}</span>}{label}
    </label>
    <div className="relative">
      <input type={type} name={name} required onChange={handleChange} placeholder={placeholder}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder-gray-400 hover:border-gray-400 text-sm sm:text-base" />
      <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
    </div>
  </div>
);

export default Login;