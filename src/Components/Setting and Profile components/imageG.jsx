import React from "react";
import { useState } from "react";
import { assets } from "../../../Images/asset";

const imageData = [
  {
    id: 1,
    label: "Bird",
    src: assets.vec,
    uploadDate: new Date("2024-11-01"),
  },
  {
    id: 2,
    label: "Pumpkin",
    src: "../../../Images/w.png",
    uploadDate: new Date("2024-11-02"),
  },
  {
    id: 3,
    label: "Fish",
    src: "../../../Images/union.png",
    uploadDate: new Date("2024-10-15"),
  },
  {
    id: 4,
    label: "Tree",
    src: "../../../Images/vector.png",
    uploadDate: new Date("2024-09-25"),
  },
  {
    id: 5,
    label: "House",
    src: "../../../Images/Frame.png",
    uploadDate: new Date("2023-12-15"),
  },
  // Add more items as needed
];

const imageG = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Separate images into "This Month" and "Older"
  const thisMonthImages = imageData.filter(
    (item) =>
      item.uploadDate.getMonth() === currentMonth &&
      item.uploadDate.getFullYear() === currentYear
  );

  const olderImages = imageData.filter(
    (item) =>
      item.uploadDate.getMonth() !== currentMonth ||
      item.uploadDate.getFullYear() !== currentYear
  );

  return (
    <main className="body grid place-content-center w-screen h-screen bg-gray-50">
      {/* Help Icon at the Bottom */}
      <div className="mt-8 w-100 flex justify-center">
        <img src={assets.image42} alt="Help Icon" className="w-8 h-8" />
      </div>
      {/* Settings Container */}
      <div className="relative flex px-12 mt-8  flex-col items-center w-[80vw] max-w-[90vh] bg-white border-4 border-[#008183] rounded-lg shadow-lg p-4">
        {/* Back Arrow */}
        <div className="absolute top-5 left-5">
          <img src={assets.vec} alt="Back Arrow" />
        </div>

        <div className="flex flex-col items-center ">
          {/* Cloud-like Header with "SETTINGS" */}
          <div className="relative flex items-center justify-center w-full mb-6">
            <img src={assets.union} alt="Cloud" className="w-48 h-24" />
            <img
              src="../../../Images/history.png"
              alt="Settings Text"
              className="absolute"
            />
          </div>

          {/* inputing the <details></details> */}

          <div className="history-gallery w-full">
            <div className="section mb-8">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                This Month
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {thisMonthImages.length > 0 ? (
                  thisMonthImages.map((item) => (
                    <div
                      key={item.id}
                      className="image-item text-center cursor-pointer"
                      onClick={() => setSelectedImage(item)}
                    >
                      <img
                        src={item.src}
                        alt={item.label}
                        className="rounded-lg shadow-md mb-2 w-[77px] h-[104px]  object-contain"
                      />
                      <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-gray-500">
                    No uploads this month
                  </p>
                )}
              </div>
            </div>

            <div className="section">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Older
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {olderImages.map((item) => (
                  <div
                    key={item.id}
                    className="image-item text-center cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      className="  rounded-lg shadow-md  mb-2 w-[77px] h-[104px]  object-contain"
                    />
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedImage && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-4 w-[20%] sm:max-w-md mx-4 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedImage(null)}
                  >
                    ✕
                  </button>
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.label}
                    className="w-full h-auto rounded mb-4 object-cover"
                  />
                  <p className="text-center font-semibold text-gray-700">
                    {selectedImage.label}
                  </p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Save
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* end */}
        </div>
      </div>
    </main>
  );
};

export default imageG;
