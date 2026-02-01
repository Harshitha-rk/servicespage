import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../components/supabaseClient";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          address: "",
          pincode: "",
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/services");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Signup</h2>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
}

export default Signup;
