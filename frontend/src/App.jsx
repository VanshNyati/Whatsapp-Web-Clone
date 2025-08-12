// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import "./index.css";

function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar on md+ screens */}
      <div className="hidden md:block md:w-1/3 lg:w-1/4 border-r">
        <ChatList />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <Routes>
          {/* Mobile: chat list full screen */}
          <Route
            path="/"
            element={
              <div className="block md:hidden h-full">
                <ChatList />
              </div>
            }
          />
          {/* Chat window */}
          <Route path="/chat/:wa_id" element={<ChatWindow />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ChatProvider>
      <Router>
        <Layout />
      </Router>
    </ChatProvider>
  );
}

export default App;
