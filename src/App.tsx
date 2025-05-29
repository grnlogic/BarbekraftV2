import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

// Services
import { checkOpenAIStatus, checkGeminiStatus } from "./utils/checkApiStatus";

// Pages
import Home from "./pages/Home";
import WasteStatistics from "./pages/WasteStatistics";

// Lazy loaded pages
const Items = React.lazy(() => import("./pages/Items"));
const ItemDetail = React.lazy(() => import("./pages/ItemDetail"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  // Initialize services on app load
  useEffect(() => {
    const initServices = async () => {
      try {
    

        // Check API statuses
       
        const openAIStatus = await checkOpenAIStatus();
        const geminiStatus = await checkGeminiStatus();

      
      } catch (error) {
        console.error("Error initializing services:", error);
      }
    };

    initServices();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <React.Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/items" element={<Items />} />
              <Route path="/items/:id" element={<ItemDetail />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/waste-statistics" element={<WasteStatistics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
