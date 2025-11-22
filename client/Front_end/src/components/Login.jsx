import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    staff, setStaff,
    owner, setOwner,
    user, setUser,
    token, setToken,
    shopCode, setShopCode,
    showLogin, setShowLogin
  } = useContext(AppContext);

  const [person, setPerson] = useState("owner");
  const [state, setState] = useState("Signin");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // Update input state
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseURL = "http://localhost:4000/api";
      const endpoint = `${baseURL}/${person}/${state.toLowerCase()}`;

      const response = await axios.post(endpoint, formData);
      const data = response.data;


      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("shopCode", person === "owner" ? data.owner.shopCode : data.staff.shopCode);
        localStorage.setItem("role", person); // ✅ save role
        localStorage.setItem("user", JSON.stringify(data.owner || data.staff));
      
        setToken(data.token);
        setShopCode(person === "owner" ? data.owner.shopCode : data.staff.shopCode);
        setOwner(person === "owner");
        setStaff(person === "staff");
        setUser(person === "owner" ? data.owner : data.staff);
        setShowLogin(false);
      }else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Server error");
    }
  };

  return (
    <>
      {state && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999]">
        <div className="bg-white shadow-lg rounded-2xl p-5 sm:p-6 w-[90%] max-w-[350px] mx-auto max-h-[85vh] overflow-y-auto scale-95">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
              {state === "Signup" ? "Signup" : "Signin"}
            </h2>

            {/* Role Selector */}
            <div className="mt-6 flex justify-center items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={person === "owner"}
                  onChange={(e) => setPerson(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Owner</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  checked={person === "staff"}
                  onChange={(e) => setPerson(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Staff</span>
              </label>
            </div>

            {/* Form */}
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              {/* SIGNUP */}
              {state === "Signup" && (
                <>
                  <Input label="Name" name="name" type="text" handleChange={handleChange} />
                  <Input label="Mail" name="mail" type="email" handleChange={handleChange} />
                  <Input label="Password" name="password" type="password" handleChange={handleChange} />
                  <Input label="Shop Code" name="shopCode" type="text" handleChange={handleChange} />

                  {person === "owner" && (
                    <>
                      <Input label="Shop Name" name="shopName" type="text" handleChange={handleChange} />
                      <Input label="Shop Address" name="shopAddress" type="text" handleChange={handleChange} />
                      <Input label="Number of Staff" name="numberOfStaff" type="number" handleChange={handleChange} />
                    </>
                  )}
                </>
              )}

              {/* SIGNIN */}
              {state === "Signin" && (
                <>
                  <Input label="Mail" name="mail" type="email" handleChange={handleChange} />
                  <Input label="Password" name="password" type="password" handleChange={handleChange} />
                </>
              )}

              <button
                type="submit"
                className="w-full text-black py-2 bg-blue-700 rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
              >
                {state === "Signup" ? "Signup" : "Signin"}
              </button>
            </form>

            {/* Toggle between signin/signup */}
            <div className="mt-4 text-center text-sm text-gray-600">
              {state === "Signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setState("Signin")}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    
                    Signin
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setState("Signup")}
                    className="text-blue-600 font-semibold hover:underline"
                  > 
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reusable Input
    const Input = ({ label, name, type, handleChange }) => (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          type={type}
          name={name}
          required
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    );

export default Login;
