import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Typography, Space, message, Result, Spin } from 'antd';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import Navbar from '../../Components/common/Navbar';
import { questionService } from '../../api/question.service';
import { certificateService } from '../../api/certificate.service';

const { Title, Text } = Typography;

const TakeQuiz = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);
    const userId = localStorage.getItem("id");

    useEffect(() => {
        fetchQuestions();
    }, [courseId]);

    const fetchQuestions = async () => {
        try {
            const result = await questionService.getQuestionsByCourse(courseId);
            if (result.success) {
                setQuestions(result.data);
            } else {
                message.error("Failed to load questions");
            }
        } catch (error) {
            message.error("Error loading quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(q => {
            // Logic to match selected option content with answer
            // Wait, answer in DB is the value string (e.g. "Option A Content")
            // We need to match the selected value with q.answer
            if (answers[q.id] === q.answer) {
                correctCount++;
            }
        });
        return correctCount;
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            message.warning("Please answer all questions before submitting.");
            return;
        }

        const correctCount = calculateScore();
        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);
        setSubmitted(true);

        const isPassed = finalScore >= 60; // 60% Passing mark
        setPassed(isPassed);

        // Save Assessment
        await certificateService.saveAssessment(userId, courseId, finalScore);

        if (isPassed) {
            message.success("Congratulations! You passed the quiz.");
        } else {
            message.error("You did not pass. Please try again.");
        }
    };

    const handleDownloadCertificate = async () => {
        try {
            const result = await certificateService.downloadCertificate(userId, courseId);
            if (result.success) {
                const url = window.URL.createObjectURL(new Blob([result.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'certificate.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                message.error("Failed to download certificate");
            }
        } catch (error) {
            message.error("Error downloading certificate");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spin size="large" /></div>;

    if (questions.length === 0) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 text-center">
                <Title level={3}>No Quiz Available</Title>
                <Text>There are no questions for this course yet.</Text>
                <br />
                <Button className="mt-4" onClick={() => navigate(`/course/${courseId}`)}>Back to Course</Button>
            </div>
        </div>
    );

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 pb-12">
                <Navbar />
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <Card className="shadow-md rounded-xl text-center p-8 mb-8">
                        <Result
                            status={passed ? "success" : "error"}
                            icon={passed ? <Award className="text-yellow-500 w-24 h-24 mx-auto" /> : <XCircle className="text-red-500 w-24 h-24 mx-auto" />}
                            title={passed ? "Quiz Passed!" : "Quiz Failed"}
                            subTitle={`You scored ${score}%. ${passed ? "You have passed the test! You can now download your certificate." : "You need 60% to pass."}`}
                            extra={[
                                passed && (
                                    <Button type="primary" size="large" onClick={handleDownloadCertificate} key="download" className="bg-blue-600">
                                        Download Certificate
                                    </Button>
                                ),
                                <Button key="back" size="large" onClick={() => navigate(`/course/${courseId}`)}>
                                    Back to Course
                                </Button>,
                                !passed && (
                                    <Button key="retry" size="large" onClick={() => { setSubmitted(false); setAnswers({}); }}>
                                        Try Again
                                    </Button>
                                )
                            ]}
                        />
                    </Card>

                    <Title level={3} className="text-center mb-6">Review Your Answers</Title>
                    <Space direction="vertical" size="middle" className="w-full">
                        {questions.map((q, index) => {
                            const userAnswer = answers[q.id];
                            const isCorrect = userAnswer === q.answer;
                            return (
                                <Card key={q.id} type="inner" title={`Question ${index + 1}`} className={`border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'} bg-white shadow-sm`}>
                                    <Text strong className="text-lg block mb-4">{q.question}</Text>
                                    <div className="space-y-2">
                                        <div className={`p-3 rounded border ${userAnswer === q.option1 ? (q.answer === q.option1 ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : (q.answer === q.option1 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200')}`}>
                                            <Radio checked={userAnswer === q.option1} disabled>A. {q.option1}</Radio>
                                            {q.answer === q.option1 && <CheckCircle className="inline-block w-4 h-4 text-green-600 ml-2" />}
                                            {userAnswer === q.option1 && userAnswer !== q.answer && <XCircle className="inline-block w-4 h-4 text-red-600 ml-2" />}
                                        </div>
                                        <div className={`p-3 rounded border ${userAnswer === q.option2 ? (q.answer === q.option2 ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : (q.answer === q.option2 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200')}`}>
                                            <Radio checked={userAnswer === q.option2} disabled>B. {q.option2}</Radio>
                                            {q.answer === q.option2 && <CheckCircle className="inline-block w-4 h-4 text-green-600 ml-2" />}
                                            {userAnswer === q.option2 && userAnswer !== q.answer && <XCircle className="inline-block w-4 h-4 text-red-600 ml-2" />}
                                        </div>
                                        <div className={`p-3 rounded border ${userAnswer === q.option3 ? (q.answer === q.option3 ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : (q.answer === q.option3 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200')}`}>
                                            <Radio checked={userAnswer === q.option3} disabled>C. {q.option3}</Radio>
                                            {q.answer === q.option3 && <CheckCircle className="inline-block w-4 h-4 text-green-600 ml-2" />}
                                            {userAnswer === q.option3 && userAnswer !== q.answer && <XCircle className="inline-block w-4 h-4 text-red-600 ml-2" />}
                                        </div>
                                        <div className={`p-3 rounded border ${userAnswer === q.option4 ? (q.answer === q.option4 ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : (q.answer === q.option4 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200')}`}>
                                            <Radio checked={userAnswer === q.option4} disabled>D. {q.option4}</Radio>
                                            {q.answer === q.option4 && <CheckCircle className="inline-block w-4 h-4 text-green-600 ml-2" />}
                                            {userAnswer === q.option4 && userAnswer !== q.answer && <XCircle className="inline-block w-4 h-4 text-red-600 ml-2" />}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-2 border-t text-sm text-gray-500">
                                        <Text strong>Correct Answer: </Text> <Text type="success">{q.answer}</Text>
                                    </div>
                                </Card>
                            );
                        })}
                    </Space>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Title level={2} className="mb-6 text-center">Course Quiz</Title>
                <Card className="shadow-sm rounded-xl">
                    <Space direction="vertical" size="large" className="w-full">
                        {questions.map((q, index) => (
                            <Card key={q.id} type="inner" title={`Question ${index + 1}`} className="bg-gray-50">
                                <Text strong className="text-lg block mb-4">{q.question}</Text>
                                <Radio.Group onChange={(e) => handleAnswerChange(q.id, e.target.value)} value={answers[q.id]}>
                                    <Space direction="vertical">
                                        <Radio value={q.option1}>{q.option1}</Radio>
                                        <Radio value={q.option2}>{q.option2}</Radio>
                                        <Radio value={q.option3}>{q.option3}</Radio>
                                        <Radio value={q.option4}>{q.option4}</Radio>
                                    </Space>
                                </Radio.Group>
                            </Card>
                        ))}
                        <div className="flex justify-end pt-4">
                            <Button type="primary" size="large" onClick={handleSubmit} className="bg-blue-600 px-8">
                                Submit Answers
                            </Button>
                        </div>
                    </Space>
                </Card>
            </div>
        </div>
    );
};

export default TakeQuiz;
