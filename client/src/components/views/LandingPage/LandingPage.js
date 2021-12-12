import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((res) => console.log(res.data));
  }, []);
  return <div>LandingPage Test</div>;
}

export default LandingPage;
