import React from 'react';
import { Button } from '../components/ui/button';


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 mt-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

                    {/* Logo Section */}
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold">NewsPortal</h3>
                        <p className="text-sm">
                            Stay updated with the latest news. Bringing you the best of world events, technology, entertainment, and more.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm hover:text-gray-400">Home</a></li>
                            <li><a href="#" className="text-sm hover:text-gray-400">About Us</a></li>
                            <li><a href="#" className="text-sm hover:text-gray-400">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm hover:text-gray-400">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="p-2 rounded-l-md border border-gray-700 text-black w-full"
                            />
                            <Button className="bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                                Subscribe
                            </Button>
                        </form>
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Follow Us</h3>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-blue-600">
                                Facebook
                            </a>
                            <a href="#" className="text-gray-400 hover:text-purple-600">
                                Twitter
                            </a>
                            <a href="#" className="text-gray-400 hover:text-pink-500">
                                Instagram
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500">
                                Linkedin
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-700 pt-6 mt-6 text-center">
                    <p className="text-sm">&copy; 2024 NewsPortal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
