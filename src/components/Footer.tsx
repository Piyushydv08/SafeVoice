// src/components/Footer.tsx
import { FaXTwitter, FaLinkedin, FaDiscord, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left - Brand */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-semibold text-white">SafeVoice</h2>
          <p className="text-sm">Your safe space to share and connect 💜</p>
        </div>

        {/* Center - Social Links */}
        <div className="flex space-x-6 text-xl">
          <a
            href="https://x.com/piyushydv011?t=8VKvJiRHuwFIWstbcXji3Q&s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.linkedin.com/in/piyush-yadav-b513a0288"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://discord.gg/bdRJz6q2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaDiscord />
          </a>
          <a
            href="https://github.com/Piyushydv08"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub />
          </a>
        </div>

        {/* Right - Contact */}
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <a
            href="mailto:youremail@example.com"
            className="hover:text-white transition"
          >
            Contact Us
          </a>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SafeVoice. All rights reserved.
      </div>
    </footer>
  );
}


