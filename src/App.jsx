import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DatabaseProvider } from "./contexts/DatabaseContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Conversation from "./pages/Conversation";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projetos" element={<Projects />} />
            <Route path="/conversacao" element={<Conversation />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster position="top-right" />
    </DatabaseProvider>
  );
}

export default App;
