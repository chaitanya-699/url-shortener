import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // ✅ Store token in cookie
      document.cookie = `jwt=${token}; Max-Age=${24 * 60 * 60}; Path=/; Secure; SameSite=None`;

      // Optionally store in localStorage
      // localStorage.setItem("jwt", token);

      // ✅ Redirect to home/dashboard
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
}
