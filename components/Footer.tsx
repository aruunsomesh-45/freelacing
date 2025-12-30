import Link from "next/link";
import { Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Statement */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider font-heading">ANDREA</h3>
                        <p className="text-neutral-400 leading-relaxed mb-6">
                            Helping ambitious brands build scalable digital products that drive real business growth.
                        </p>
                        <Link href="/contact#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-sm rounded hover:bg-neutral-200 transition-colors">
                            Contact Us
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navigation</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-neutral-400 hover:text-white transition-colors">Home</Link></li>
                            <li><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Services</a></li>
                            <li><Link href="/projects" className="text-neutral-400 hover:text-white transition-colors">Our Work</Link></li>
                            <li><a href="#about" className="text-neutral-400 hover:text-white transition-colors">About</a></li>
                            <li><a href="#contact" className="text-neutral-400 hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h4>
                        <ul className="space-y-3">
                            <li><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Web Development</a></li>
                            <li><a href="#services" className="text-neutral-400 hover:text-white transition-colors">UI / UX Design</a></li>
                            <li><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Mobile Optimization</a></li>
                            <li><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Website Redesign</a></li>
                            <li><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Landing Pages</a></li>
                            <li><a href="#services" className="text-neutral-400 hover:text-white transition-colors">Performance SEO</a></li>
                        </ul>
                    </div>

                    {/* Contact & Socials */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Get in Touch</h4>
                        <ul className="space-y-3 mb-6">
                            <li className="text-neutral-400">zokuai7@gmail.com</li>
                            <li className="text-neutral-400">+34 602 25 62 48</li>
                        </ul>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/arun-s-163578390" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-neutral-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                <Linkedin size={18} />
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all cursor-pointer">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.instagram.com/andrea_the_creators?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-neutral-400 hover:bg-purple-600 hover:text-white transition-all cursor-pointer">
                                <Instagram size={18} />
                            </a>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=zokuai7@gmail.com&su=Project%20Inquiry%20-%20%5BYour%20Name%5D&body=Hi%20Andrea%2C%0A%0AI'm%20interested%20in%20starting%20a%20project%20and%20would%20like%20to%20discuss%20more%20details...%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-neutral-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7l-9 7L3 7v14H1.5c-.85 0-1.5-.65-1.5-1.5v-15c0-.4.15-.75.45-1.05.3-.3.65-.45 1.05-.45H3l9 7 9-7h1.5c.4 0 .75.15 1.05.45.3.3.45.65.45 1.05z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-neutral-500 text-sm">
                    <p>© {new Date().getFullYear()} Andrea. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Built with Next.js, Tailwind CSS & Love.</p>
                </div>
            </div>
        </footer>
    );
}
