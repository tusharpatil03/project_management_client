
const LandingPage = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Simplify Your Project Management
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Manage tasks, collaborate with your team, and get things done faster.
          Everything you need — all in one place.
        </p>
        <div>
          <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 text-center px-4">
        <h2 className="text-4xl font-bold mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Task Tracking",
              desc: "Keep everything organized with smart task lists.",
            },
            {
              title: "Collaboration",
              desc: "Work with your team in real time, chat & comment.",
            },
            {
              title: "Deadlines & Reminders",
              desc: "Stay on track with due dates and auto reminders.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-blue-700 text-white py-16 text-center">
        <h3 className="text-3xl font-semibold mb-4">
          Ready to boost your productivity?
        </h3>
        <button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition">
          Create Your First Project
        </button>
      </footer>
    </div>
  );
};

export default LandingPage;
