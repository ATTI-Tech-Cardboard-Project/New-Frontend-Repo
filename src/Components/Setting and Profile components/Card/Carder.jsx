import React, { useState } from "react";

const AudioSettings = () => {
  // State for toggles
  const [soundEffects, setSoundEffects] = useState(false);
  const [music, setMusic] = useState(false);

  // Toggle handlers
  const toggleSoundEffects = () => setSoundEffects(!soundEffects);
  const toggleMusic = () => setMusic(!music);

  return (
    <div className="w-60 p-4 bg-teal-500 rounded-lg shadow-md">
      {/* Sound Effects Toggle */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-white">Sound effects</span>
        <div
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
            soundEffects ? "bg-cyan-400" : "bg-gray-400"
          }`}
          onClick={toggleSoundEffects}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
              soundEffects ? "translate-x-6" : ""
            }`}
          ></div>
        </div>
      </div>

      {/* Music Toggle */}
      <div className="flex justify-between items-center">
        <span className="text-white">Music</span>
        <div
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
            music ? "bg-cyan-400" : "bg-gray-400"
          }`}
          onClick={toggleMusic}
        >
          <div
            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
              music ? "translate-x-6" : ""
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettings;
