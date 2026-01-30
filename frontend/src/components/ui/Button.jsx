import React from "react"
export function Button({ children }) {
  return (
    <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
      {children}
    </button>
  );
}
