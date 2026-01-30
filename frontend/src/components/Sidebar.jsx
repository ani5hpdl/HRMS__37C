import React from "react"

export default function Sidebar() {
  const menu = [
    "Dashboard",
    "Reservation",
    "Rooms",
    "Messages",
    "Housekeeping",
    "Inventory",
    "Calendar",
    "Financials",
    "Reviews",
    "Concierge",
  ];

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">Lodgify</h2>

      <ul className="space-y-2">
        {menu.map((item) => (
          <li
            key={item}
            className={`px-3 py-2 rounded cursor-pointer ${
              item === "Rooms"
                ? "bg-lime-100 text-lime-700 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
