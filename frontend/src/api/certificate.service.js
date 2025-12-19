import api from "./api";

const downloadCertificate = async (userId, courseId) => {
    try {
        const response = await api.get(`/api/certificates/download/${userId}/${courseId}`, {
            responseType: 'blob',
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error downloading certificate:", error);
        return { success: false, error: "Unable to download certificate" };
    }
};

const saveAssessment = async (userId, courseId, marks) => {
    try {
        const response = await api.post(`/api/assessments/add/${userId}/${courseId}`, { marks });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error saving assessment:", error);
        return { success: false, error: "Unable to save assessment" };
    }
}

export const certificateService = {
    downloadCertificate,
    saveAssessment
};
