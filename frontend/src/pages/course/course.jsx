import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { List, Button, Typography, Card } from "antd";
import { Play, FileText, ArrowLeft } from "lucide-react";
import { courseService } from "../../api/course.service";
import Navbar from "../../Components/common/Navbar";

const { Title, Text, Paragraph } = Typography;

const Course = () => {
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [played, setPlayed] = useState(0); // Kept for onProgress, though unused logic removed
  const [videoCompleted, setVideoCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];

  const fetchCourse = async () => {
    try {
      const response = await courseService.getCourseById(courseId);
      setCourse(response.data);
      if (response.data.lessons && response.data.lessons.length > 0) {
        setCurrentLesson(response.data.lessons[0]);
      }
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleLessonChange = (lesson) => {
    setCurrentLesson(lesson);
    setPlayed(0); // Reset progress for new lesson
  };

  if (loading) return <div className="p-8 text-center">Loading Course...</div>;
  if (error || !course) return <div className="p-8 text-center text-red-500">Failed to load course.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/courses')}
          className="mb-4"
        >
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-video flex items-center justify-center relative">
              {currentLesson ? (
                <>
                  {currentLesson.type === 'VIDEO' && (
                    <ReactPlayer
                      url={currentLesson.url}
                      controls
                      width="100%"
                      height="100%"
                      onProgress={(state) => setPlayed(state.played)}
                      onEnded={() => setVideoCompleted(true)}
                    />
                  )}
                  {currentLesson.type === 'PDF' && (
                    <div className="text-white text-center">
                      <FileText size={48} className="mx-auto mb-2" />
                      <p>PDF Content. <a href={currentLesson.url} target="_blank" rel="noreferrer" className="text-blue-400 underline">Click to view</a></p>
                    </div>
                  )}
                  {currentLesson.type === 'TEXT' && (
                    <div className="bg-white w-full h-full p-6 overflow-auto text-black">
                      <Title level={3}>{currentLesson.title}</Title>
                      <Paragraph>{currentLesson.content}</Paragraph>
                    </div>
                  )}
                </>
              ) : course && course.videoLink ? (
                <ReactPlayer
                  url={course.videoLink}
                  controls
                  width="100%"
                  height="100%"
                  onEnded={() => setVideoCompleted(true)}
                />
              ) : (
                <div className="text-white">
                  {course && course.thumbnail ? (
                    <img src={course.thumbnail || course.p_link} alt={course.courseName} className="w-full h-full object-cover" />
                  ) : "No lessons or video available for this course."}
                </div>
              )}
              {videoCompleted && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 transition-opacity">
                  <Text className="text-white text-xl mb-4">Course Video Completed!</Text>
                  <Button
                    type="primary"
                    size="large"
                    className="bg-green-600 hover:bg-green-700 border-none px-8 h-12 text-lg font-semibold"
                    onClick={() => navigate(`/course/${courseId}/quiz`)}
                  >
                    Take Test & Get Certificate
                  </Button>
                  <Button
                    type="link"
                    className="text-gray-300 mt-2 hover:text-white"
                    onClick={() => setVideoCompleted(false)}
                  >
                    Watch Again
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Title level={2}>{currentLesson?.title || course.courseName}</Title>
              <Text type="secondary">{course.courseName} - {course.instructor?.username}</Text>
              <Paragraph className="mt-4">{currentLesson?.description || course.description}</Paragraph>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Title level={4}>Course Description</Title>
              <Paragraph>{course.description}</Paragraph>
            </div>
          </div>

          {/* Sidebar / Lesson List */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Course Content" className="shadow-sm rounded-xl">
              <List
                itemLayout="horizontal"
                dataSource={course.lessons}
                renderItem={(lesson, index) => (
                  <List.Item
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${currentLesson?.lessonId === lesson.lessonId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    onClick={() => handleLessonChange(lesson)}
                  >
                    <List.Item.Meta
                      avatar={
                        lesson.type === 'VIDEO' ? <Play size={16} /> : <FileText size={16} />
                      }
                      title={<Text strong={currentLesson?.lessonId === lesson.lessonId}>{`Lesson ${index + 1}: ${lesson.title}`}</Text>}
                      description={<Text type="secondary" className="text-xs">{lesson.type}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card className="shadow-sm rounded-xl">
              <Title level={4}>Instructor</Title>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {course.instructor?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Text strong className="block">{course.instructor?.username}</Text>
                  <Text type="secondary" className="text-xs">{course.instructor?.profession || "Instructor"}</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;