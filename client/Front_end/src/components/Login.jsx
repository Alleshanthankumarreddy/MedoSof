import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    staff, setStaff,
    owner, setOwner,
    vendor, setVendor,
    user, setUser,
    token, setToken,
    shopCode, setShopCode,
    showLogin, setShowLogin
  } = useContext(AppContext);

  const [person, setPerson] = useState("owner"); 
  const [state, setState] = useState("Signin");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const {backendUrl} = useContext(AppContext);


  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseURL = `${backendUrl}`;
      const endpoint = `${baseURL}api/${person}/${state.toLowerCase()}`;
      const response = await axios.post(endpoint, formData);
      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", person);

        
        if (person === "owner" || person === "staff") {
          const sc = person === "owner" ? data.owner.shopCode : data.staff.shopCode;
          localStorage.setItem("shopCode", sc);
          setShopCode(sc);
        }

        
        localStorage.setItem("user", JSON.stringify(data.owner || data.staff || data.vendor));

        setToken(data.token);

        setOwner(person === "owner");
        setStaff(person === "staff");
        setVendor(person === "vendor");

        setUser(data.owner || data.staff );

        setShowLogin(false);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
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

            
            <div className="mt-6 flex justify-center items-center gap-6">
              
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={person === "owner"}
                  onChange={(e) => setPerson(e.target.value)}
                />
                <span className="font-medium">Owner</span>
              </label>

              {/* Staff */}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  checked={person === "staff"}
                  onChange={(e) => setPerson(e.target.value)}
                />
                <span className="font-medium">Staff</span>
              </label>

              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={person === "vendor"}
                  onChange={(e) => setPerson(e.target.value)}
                />
                <span className="font-medium">Vendor</span>
              </label>

            </div>

            
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              
              
              {state === "Signup" && (
                <>
                  <Input label="Name" name="name" type="text" handleChange={handleChange} />
                  <Input label="Mail" name="mail" type="email" handleChange={handleChange} />
                  <Input label="Password" name="password" type="password" handleChange={handleChange} />

                  
                  {person === "owner" && (
                    <>
                      <Input label="Shop Code" name="shopCode" type="text" handleChange={handleChange} />
                      <Input label="Shop Name" name="shopName" type="text" handleChange={handleChange} />
                      <Input label="Shop Address" name="shopAddress" type="text" handleChange={handleChange} />
                      <Input label="Number of Staff" name="numberOfStaff" type="number" handleChange={handleChange} />
                    </>
                  )}

                  {person === "vendor" && (
                    <Input label="Contact Number" name="contactNumber" type="number" handleChange={handleChange} />
                  )}
                  {person === "staff" && (
                    <Input label="Shop Code" name="shopCode" type="text" handleChange={handleChange} />
                  )}

                  
                </>
              )}

              
              {state === "Signin" && (
                <>
                  <Input label="Mail" name="mail" type="email" handleChange={handleChange} />
                  <Input label="Password" name="password" type="password" handleChange={handleChange} />

                  {person === "staff" && (
                    <Input label="Shop Code" name="shopCode" type="text" handleChange={handleChange} />
                  )}

                 
                </>
              )}

              <button
                type="submit"
                className="w-full text-black py-2 bg-blue-700 rounded-lg font-semibold hover:bg-blue-800 transition duration-300"
              >
                {state === "Signup" ? "Signup" : "Signin"}
              </button>
            </form>

            
            <div className="mt-4 text-center text-sm text-gray-600">
              {state === "Signup" ? (
                <>
                  Already have an account?
                  <button
                    onClick={() => setState("Signin")}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Signin
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?
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
