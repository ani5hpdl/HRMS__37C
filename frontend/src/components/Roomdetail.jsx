import React from "react"
export default function RoomDetail() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Deluxe Room</h3>
        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
          Available
        </span>
      </div>

      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />

      <p className="text-sm text-gray-600 mb-4">
        Spacious room with king bed, modern design, ensuite bathroom, and city
        view.
      </p>

      <h4 className="font-medium mb-2">Amenities</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Free Wi-Fi</li>
        <li>• Air conditioning</li>
        <li>• Mini-fridge</li>
        <li>• Coffee maker</li>
      </ul>

      <button className="mt-4 w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600">
        Edit
      </button>
    </div>
  );
}
