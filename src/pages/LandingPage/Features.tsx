function Features() {
  const features = [
    {
      title: 'Task Tracking',
      desc: 'Keep everything organized with smart task lists.',
    },
    {
      title: 'Collaboration',
      desc: 'Work with your team in real time, chat & comment.',
    },
    {
      title: 'Deadlines & Reminders',
      desc: 'Stay on track with due dates and auto reminders.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-10 text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transform hover:-translate-y-1 transition w-full max-w-sm text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-blue-600 text-xl font-bold">
                {feature.title.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
