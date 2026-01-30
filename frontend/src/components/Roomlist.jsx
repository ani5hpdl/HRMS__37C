import React from "react"
const rooms = [
  {
    name: "Standard",
    price: 100,
    status: "Occupied",
  },
  {
    name: "Deluxe",
    price: 150,
    status: "Available",
  },
  {
    name: "Suite",
    price: 250,
    status: "Available",
  },
  {
    name: "Family",
    price: 200,
    status: "Occupied",
  },
  {
    name: "Single",
    price: 70,
    status: "Available",
  },
];

export default function RoomList() {
  return (
    <div className="space-y-4">
      {rooms.map((room) => (
        <div
          key={room.name}
          className="flex bg-white p-4 rounded-xl shadow hover:ring-1 hover:ring-lime-400 cursor-pointer"
        >
          <div className="w-32 h-24 bg-gray-200 rounded-lg mr-4" />

          <div className="flex-1">
            <h3 className="font-semibold">{room.name}</h3>
            <p className="text-sm text-gray-500">
              Comfortable room with modern amenities.
            </p>

            <div className="flex items-center justify-between mt-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  room.status === "Available"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {room.status}
              </span>

              <span className="font-semibold">${room.price}/night</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
