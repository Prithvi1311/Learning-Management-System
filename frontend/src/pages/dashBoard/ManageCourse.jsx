import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../../Components/common/Navbar";
import { courseService } from '../../api/course.service';
import { lessonService } from '../../api/lesson.service';
import { Plus, Trash2, Video, FileText, Type } from 'lucide-react';
import { Modal, Button, Form, Input, Select, Upload, message, List } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

function ManageCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lessonLoading, setLessonLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            const courseRes = await courseService.getCourseById(id);
            if (courseRes.success) {
                setCourse(courseRes.data);
                // If lessons are not included in course directly, fetch them
                const lessonsRes = await lessonService.getLessonsByCourse(id);
                if (lessonsRes.success) {
                    setLessons(lessonsRes.data);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = async (values) => {
        setLessonLoading(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('type', values.type);
        if (values.content) formData.append('content', values.content);
        if (values.file && values.file.file) {
            formData.append('file', values.file.file.originFileObj);
        }

        const res = await lessonService.createLesson(id, formData);
        if (res.success) {
            message.success('Lesson created successfully');
            setIsModalOpen(false);
            form.resetFields();
            fetchCourseData(); // Refresh list
        } else {
            message.error('Failed to create lesson');
        }
        setLessonLoading(false);
    };

    const handleDeleteLesson = async (lessonId) => {
        if (window.confirm("Are you sure you want to delete this lesson?")) {
            const res = await lessonService.deleteLesson(lessonId);
            if (res.success) {
                message.success("Lesson deleted");
                fetchCourseData();
            } else {
                message.error("Failed to delete lesson");
            }
        }
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Course: {course.courseName}</h1>
                        <p className="text-gray-600">Add or edit lessons for this course.</p>
                    </div>
                    <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
                        Add Lesson
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Lessons</h2>
                    <List
                        itemLayout="horizontal"
                        dataSource={lessons}
                        renderItem={(lesson, index) => (
                            <List.Item
                                actions={[
                                    <Button type="text" danger icon={<Trash2 size={16} />} onClick={() => handleDeleteLesson(lesson.lessonId)} />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        lesson.type === 'VIDEO' ? <Video size={20} className="text-blue-500" /> :
                                            lesson.type === 'PDF' ? <FileText size={20} className="text-red-500" /> :
                                                <Type size={20} className="text-gray-500" />
                                    }
                                    title={`Lesson ${index + 1}: ${lesson.title}`}
                                    description={lesson.description}
                                />
                            </List.Item>
                        )}
                    />
                    {lessons.length === 0 && <p className="text-center text-gray-500 py-4">No lessons added yet.</p>}
                </div>
            </div>

            <Modal
                title="Add New Lesson"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleAddLesson} form={form}>
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select>
                            <Option value="VIDEO">Video</Option>
                            <Option value="PDF">PDF document</Option>
                            <Option value="TEXT">Text content</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prev, current) => prev.type !== current.type}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('type') === 'TEXT' ? (
                                <Form.Item name="content" label="Content">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            ) : (
                                <Form.Item name="file" label="Upload File">
                                    <Upload beforeUpload={() => false} maxCount={1}>
                                        <Button icon={<UploadOutlined />}>Select File</Button>
                                    </Upload>
                                </Form.Item>
                            )
                        }
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={lessonLoading} block>
                        Create Lesson
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}

export default ManageCourse;
