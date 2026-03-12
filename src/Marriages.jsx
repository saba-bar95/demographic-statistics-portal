import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MarriagesHeader from "./components/MarriagesHeader";

function Marriages() {
  const { language } = useParams();

  useEffect(() => {
    document.title =
      language === "ka"
        ? "რეგისტრირებულ ქორწინებათა რაოდენობა"
        : "Number of Registered Marriages";
  }, [language]);

  return (
    <>
      <MarriagesHeader />
      <div className="mx-auto max-w-250 2xl:max-w-470">
        <main className="px-4 md:px-8 xl:px-12">
          {/* Content will go here */}
        </main>
      </div>
    </>
  );
}

export default Marriages;
