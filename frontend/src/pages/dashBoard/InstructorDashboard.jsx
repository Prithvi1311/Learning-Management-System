import React, { useEffect, useState } from 'react';
import Navbar from "../../Components/common/Navbar";
import { useUserContext } from "../../contexts/UserContext";
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Users, BarChart } from 'lucide-react';

function InstructorDashboard() {
    const { user } = useUserContext();
    const [stats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalReviews: 0,
        rating: 0
    });

    useEffect(() => {
        // Fetch instructor stats here
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user?.name}</p>
                    </div>
                    <Link
                        to="/create-course"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Create New Course
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<BookOpen />} title="Total Courses" value={stats.totalCourses} color="blue" />
                    <StatCard icon={<Users />} title="Total Students" value={stats.totalStudents} color="green" />
                    <StatCard icon={<BarChart />} title="Total Reviews" value={stats.totalReviews} color="purple" />
                    <StatCard icon={<Users />} title="Rating" value={stats.rating} color="yellow" />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                    {/* Course list will go here */}
                    <div className="text-center text-gray-500 py-8">
                        Loading courses...
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color }) {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        purple: "bg-purple-100 text-purple-600",
        yellow: "bg-yellow-100 text-yellow-600"
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

export default InstructorDashboard;
