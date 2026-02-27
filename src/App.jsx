import { useState } from "react";
import Header from "./components/Header";
import InfoModal from "./components/InfoModal";

function App() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 md:p-8 mx-auto max-w-425">
        <Header onInfoClick={() => setIsInfoOpen((prev) => !prev)} />
        <main>
          <p className="text-base sm:text-lg">
            Welcome — this app supports light and dark modes.
          </p>
        </main>
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}

export default App;
