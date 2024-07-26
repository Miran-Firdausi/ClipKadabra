import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import "./styles/global.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
