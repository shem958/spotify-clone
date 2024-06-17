import React from "react";
// Import the global css styles
import "./globals.css";

// Define the RootLayout component that takes children as a prop
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Set the language attribute for the HTMl document
    <html lang="en">
      <body>
        {/* Define the header section with a gray background and white text */}
        <header className="bg-gray-800 p-4 text-white">
          {/* Main heading of the application */}
          <h1 className="text-xl">Spotify Clone</h1>
        </header>
        {/* Define the main content area with padding */}
        <main className="p-4">
          {/* Render the children components passed to the RootLayout */}
          {children}
        </main>
      </body>
    </html>
  );
}

// This layout component is a foundational part of this application, ensuring consistent styling and structure across all pages.
