import { Vortex } from "@/components/ui/vortex";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Feather } from "lucide-react";
import { Link } from "react-router-dom";
// Book Your Bus Ride, Your Way with BusLinker.
const words = [
  // Write the words
  {
    text: "Book",
  },
  {
    text: "Your",
  },
  {
    text: "Bus",
  },
  {
    text: "Ride",
  },
  {
    text: "Your",
  },
  {
    text: "Way",
    className: "text-green-500 dark:text-green-500",
  },
  {
    text: "with",
  },
  {
    text: "BusLinker",
    className: "text-green-500 dark:text-green-500",
  },
];
export default function Landing() {
  return (
    <>
      <div className="w-screen mx-auto rounded-md  h-screen overflow-hidden">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={50}
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full md:gap-6"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center flex justify-center items-center gap-2">
            <Feather size={50} color="green" />
            BusLinker
          </h2>
          <TypewriterEffect
            words={words}
            className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center"
          />
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Link to="/login">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2  text-white ">Sign Up</button>
            </Link>
          </div>
        </Vortex>
      </div>
    </>
  );
}
