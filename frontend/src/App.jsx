import { useState, useCallback } from "react";
import "./App.css";
import { Excalidraw, exportToBlob, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import Evaluatedraw from "./components/Evaluatedraw";
import aiicon from "./assets/ai.svg";
import intellisketchlogo from "./assets/intellisketch.png";
import { FaGithub } from "react-icons/fa";
function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Set initial state to true for dark mode
  const [imagePreview, setImagePreview] = useState(null);

  const onExcalidrawAPIChange = useCallback((api) => {
    setExcalidrawAPI(api);
  }, []);

  const handleChange = useCallback((elements, appState) => {
    setIsDarkTheme(appState.theme === 'dark');
  }, []);

  const handleEvaluate = async () => {
    if (!excalidrawAPI) return;

    setIsLoading(true);
    try {
      // Get the current canvas size
      const { width, height } = excalidrawAPI.getAppState();
      
      // Calculate a scale factor to reduce image size on mobile
      const maxDimension = Math.max(width, height);
      const scaleFactor = maxDimension > 1000 ? 1000 / maxDimension : 1;

      const blob = await exportToBlob({
        elements: excalidrawAPI.getSceneElements(),
        appState: {
          ...excalidrawAPI.getAppState(),
          exportWithDarkMode: false, // Ensure consistent export
        },
        files: excalidrawAPI.getFiles(),
        mimeType: "image/png",
        quality: 0.8, // Slightly reduce quality to decrease file size
        exportWithBackground: true,
        exportPadding: 10,
        scale: scaleFactor,
      });

      console.log("Blob created:", blob);
      console.log("Blob size:", blob.size);

      const imageUrl = URL.createObjectURL(blob);
      setImagePreview(imageUrl);

      const formData = new FormData();
      formData.append("image", blob, "canvas.png");

      const response = await fetch("https://delightful-angel-ayazmirza54-5bae0961.koyeb.app:8900/calculate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
      setResults([{ expr: "Error", result: "An error occurred while processing the image. Please try again." }]);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#121212] relative">
      <div className="absolute h-[85%] inset-0 z-0">
        <Excalidraw 
         excalidrawAPI={onExcalidrawAPIChange}
         onChange={handleChange} 
         UIOptions={{ 
           canvasActions: { loadLibrary: false },
           position: "bottom-right",
         }}
         theme={isDarkTheme ? "dark" : "light"} // Set the theme prop
         initialData={{
           appState: { theme: "dark" } // Set initial app state to dark theme
         }}
        >
          <WelcomeScreen>
          <WelcomeScreen.Center>
           <img src={intellisketchlogo}></img>
           
            <WelcomeScreen.Center.Menu>
              
              <WelcomeScreen.Center.MenuItemLink icon={<FaGithub />} href="https://github.com/ayazmirza54/intellisketch">
                Intellisketch GitHub
              </WelcomeScreen.Center.MenuItemLink>
              <WelcomeScreen.Center.MenuItemHelp />
            </WelcomeScreen.Center.Menu>
          </WelcomeScreen.Center>
        </WelcomeScreen>
          <MainMenu>
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
       
      </Excalidraw>
      </div>

      {/* Evaluate with AI button */}
      <button
        onClick={handleEvaluate}
        className={`absolute bottom-20 right-6 sm:bottom-6 font-bold py-2 px-6 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out z-10 ${
          isDarkTheme
            ? 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300'
            : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 mr-2 ${
            isDarkTheme ? 'border-white' : 'border-gray-800'
          }`}></div>
        ) : (
          <img src={aiicon} alt="AI" className={`w-5 h-5 mr-2 ${isDarkTheme ? 'invert' : ''}`} />
        )}
        {isLoading ? "Evaluating..." : "Evaluate with AI"}
      </button>

      {showModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center z-20">
          <div className="w-full max-w-md">
            <Evaluatedraw
              results={results}
              isLoading={isLoading}
              onClose={() => {
                setShowModal(false);
                setImagePreview(null); // Reset the imagePreview when closing the modal
              }}
              isDarkTheme={isDarkTheme}
              imagePreview={imagePreview}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
