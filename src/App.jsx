import { Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-gray-800 via-black to-gray-800 text-white flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center">
        {/* Add an image above the heading */}
    
        
        <Link to="/">
          <h1 className="text-4xl font-extrabold my-8 drop-shadow-lg">
            AudText-AI
          </h1>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex xs:flex-wrap space-x-4 xs:flex-col xs:space-x-0 xs:space-y-4">
  <button
    onClick={() => navigate("/aiuploader")}
    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400 transition"
  >
    Upload and Text
  </button>

  <button
    onClick={() => navigate("/chatbot")}
    className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-400 transition"
  >
    Chatbot
  </button>

  <button
    onClick={() => navigate("/ailesioner")}
    className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring focus:ring-purple-400 transition"
  >
    Speech to Text
  </button>
</div>

      </div>

      {/* Outlet Container */}
      <Outlet />
    </div>
  );
}

export default App;
