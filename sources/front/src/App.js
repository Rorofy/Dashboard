import "./App.css";
import LoginPage from "./Login/LoginPage";
import HomePage from "./Home/HomePage";
import { Router } from "@reach/router";

function App() {
  return (
    <div>
      <Router>
        <LoginPage path={"/"} />
        <HomePage path={"/home"} />
      </Router>
    </div>
  );
}

export default App;
