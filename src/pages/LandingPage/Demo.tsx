import demoImg from '../../assets/authPageImage.png';

const Demo = () => {
    return (
        <section className="bg-white py-20 px-6 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Powerful tools to manage your workflow
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Collaborate seamlessly, assign tasks, track progress,
                        and stay organized with our intuitive dashboard.
                        Designed to adapt to teams of any size.
                    </p>

                    <ul className="space-y-4">
                        {[
                            {
                                title: 'Real-time collaboration',
                                icon: '💬',
                                description:
                                    'Instant updates and messaging for smooth teamwork.',
                            },
                            {
                                title: 'Intuitive dashboards',
                                icon: '📊',
                                description:
                                    'Visualize your progress and prioritize your tasks.',
                            },
                            {
                                title: 'Easy task management',
                                icon: '✅',
                                description:
                                    'Create, assign, and manage tasks with one click.',
                            },
                        ].map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="text-2xl">{item.icon}</div>
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {item.title}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative">
                    <img
                        src={demoImg}
                        alt="Demo Screenshot"
                        className="w-full rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500 ease-in-out"
                    />
                    <span className="absolute bottom-4 right-4 bg-white px-3 py-1 text-xs rounded-full shadow text-blue-600 font-medium">
                        Live Preview
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Demo;
