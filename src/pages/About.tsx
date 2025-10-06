import { Users, Heart, Shield, MessageSquare } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          About{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse">
            SafeVoice
          </span>
        </h1>
        <p className="text-xl text-gray-600">
          Empowering women through shared stories and support
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-20">
        <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl shadow-2xl p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-pink-400/40 overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-30"></div>
          <h2 className="relative text-3xl font-bold mb-6">Our Mission</h2>
          <p className="relative text-lg leading-relaxed">
            SafeVoice is dedicated to creating a secure and supportive space where women can share their stories,
            find strength in community, and access resources for healing and empowerment. We believe that every
            voice matters and that sharing our experiences can lead to collective healing and positive change.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { icon: Shield, color: "text-pink-500", title: "Safety", desc: "Providing a secure platform for women to share their experiences without fear" },
            { icon: Users, color: "text-blue-500", title: "Community", desc: "Building a supportive network of understanding and encouragement" },
            { icon: Heart, color: "text-red-500", title: "Empowerment", desc: "Strengthening women through shared experiences and resources" },
            { icon: MessageSquare, color: "text-green-500", title: "Voice", desc: "Amplifying stories that need to be heard and acknowledged" },
          ].map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl shadow-lg p-8 text-center group border border-transparent hover:border-pink-400 hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 opacity-0 group-hover:opacity-20 rounded-2xl transition duration-500"></div>
              <item.icon className={`h-14 w-14 ${item.color} mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`} />
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { number: "10", label: "Stories Shared" },
            { number: "50", label: "Community Members" },
            { number: "10", label: "Support Messages" },
          ].map((item, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl shadow-md p-10 text-center overflow-hidden transition duration-500 hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 opacity-0 hover:opacity-40 transition duration-500"></div>
              <div className="relative text-4xl font-extrabold text-pink-500 mb-4">{item.number}</div>
              <p className="relative text-gray-600 text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-20">
        <div className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl hover:scale-[1.01] transition duration-500">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            We're here to listen and support. Reach out to us at any time:
          </p>
          <div className="space-y-3">
            <p className="text-gray-700">
              Email:{" "}
              <a
                href="mailto:safevoiceforwomen@gmail.com"
                className="text-pink-500 font-medium hover:text-pink-600 transition-colors"
              >
                safevoiceforwomen@gmail.com
              </a>
            </p>
            <p className="text-gray-600">
              For immediate support, please visit our Resources page for emergency contact numbers and support services.
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl shadow-lg p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-pink-400/40">
          <h2 className="text-3xl font-bold mb-6">Founders</h2>
          <div className="space-y-5">
            <p className="text-lg">
              <strong>Aditi Raj</strong> -{" "}
              <a
                href="mailto:aditiraj0205@gmail.com"
                className="text-yellow-300 hover:underline"
              >
                aditiraj0205@gmail.com
              </a>
            </p>
            <p className="text-lg">
              <strong>Piyush Yadav</strong> -{" "}
              <a
                href="mailto:piyushydv011@gmail.com"
                className="text-yellow-300 hover:underline"
              >
                piyushydv011@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
