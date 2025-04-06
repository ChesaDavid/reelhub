import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                <div>
                    <h2 className="text-lg font-semibold mb-2">About Us</h2>
                    <p>We provide high-quality services to help you achieve your goals. Reach out to us for more information.</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
                        <li><Link to="/movies" className="hover:text-gray-400">Movies</Link></li>
                        <li><Link to="/about" className="hover:text-gray-400">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-gray-400">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
                    <p>Email: david.chesa.it@gmail.com</p>
                    <p>Phone: +40732409201</p>
                    <p>Address: UBC-0 Haufe Group , floor 15</p>
                </div>
            </div>

            <div className="text-center mt-6 border-t border-gray-700 pt-4">
                <p>&copy; 2025 My Website. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
