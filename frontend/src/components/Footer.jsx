// src/components/Footer.jsx
import React from "react";

/**
 * Footer component sits at the bottom of every page,
 * displaying copyright and a support link.
 */
const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-4 mt-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
      <span>&copy; {new Date().getFullYear()} BibloSphere Library. All Rights Reserved.</span>
      <nav className="space-x-4 mt-2 md:mt-0">
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="mailto:support@BibloSpherelibrary.com" className="hover:underline">Contact Support</a>
      </nav>
    </div>
  </footer>
);

export default Footer;
