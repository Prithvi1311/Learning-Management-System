import api from "./api";

async function getLessonsByCourse(courseId) {
    try {
        const { data } = await api.get(`/api/lessons/course/${courseId}`);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.response?.data || "Could not fetch lessons" };
    }
}

async function createLesson(courseId, formData) {
    try {
        const { data } = await api.post(`/api/lessons/course/${courseId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.response?.data || "Could not create lesson" };
    }
}

async function deleteLesson(lessonId) {
    try {
        await api.delete(`/api/lessons/${lessonId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.response?.data || "Could not delete lesson" };
    }
}

export const lessonService = {
    getLessonsByCourse,
    createLesson,
    deleteLesson
};
