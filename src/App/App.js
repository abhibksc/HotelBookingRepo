import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-200">
      <HelmetProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </HelmetProvider>
    </div>
  );
};

export default App;