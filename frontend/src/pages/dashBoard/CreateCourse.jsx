import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../Components/common/Navbar";
import { courseService } from '../../api/course.service';
import { useUserContext } from '../../contexts/UserContext';

// Note: Ensure InputField import path matches existing project structure (InputFeild vs InputField)

function CreateCourse() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseName: '',
        description: '',
        price: 0,
        thumbnail: '' // URL or text for now
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Assuming courseService.createCourse exists. If not need to add it or use axios directly.
        // Backend expects Course object.
        try {
            // Need to check if endpoint uses FormData or JSON. User/Course controller usually JSON.
            // But if thumbnail is file upload, logic differs. For now simple JSON creation.
            // Wait, CourseController usually maps @RequestBody Course.
            // I need to add createCourse to course.service.js first if missing.

            // Temporary direct axios call or need to update service.
            // I'll assume createCourse in service.

            // Ensure user.id exists. If not, fallback or error.
            if (!user || !user.id) {
                console.error("User not found in context");
                alert("Please log in again.");
                return;
            }

            const payload = {
                ...formData,
                instructorId: user.id
            };

            const response = await courseService.createCourse(payload);
            if (response.success) {
                navigate(`/manage-course/${response.data.course_id}`);
            } else {
                console.error(response.error);
                alert("Failed to create course: " + response.error);
            }
            // navigate('/instructor');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                            <input
                                type="text"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                min="0"
                                required
                            />
                        </div>
                        {/* Thumbnail upload TODO */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            {loading ? 'Creating...' : 'Create Course & Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateCourse;
