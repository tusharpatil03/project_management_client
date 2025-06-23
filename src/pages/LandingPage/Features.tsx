function Features() {
    return (
        <>
            <div>
                <h2 className="text-4xl font-bold mb-12">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
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
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Features;
