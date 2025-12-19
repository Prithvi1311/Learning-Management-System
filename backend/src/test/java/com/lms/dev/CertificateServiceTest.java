package com.lms.dev;

import com.itextpdf.text.DocumentException;
import com.lms.dev.service.CertificateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class CertificateServiceTest {

    @Autowired
    private CertificateService certificateService;

    @Test
    public void testGenerateCertificate() throws DocumentException, IOException {
        String studentName = "Test Student";
        String courseName = "Test Course";
        String certificateNumber = "CERT-TEST-123";

        byte[] pdfBytes = certificateService.generateCertificate(studentName, courseName, certificateNumber);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);

        // In a real scenario, we might want to parse the PDF to verify content,
        // but for now, verifying header/bytes is a good sanity check.
        // PDF header starts with %PDF
        if (pdfBytes.length > 4) {
            String header = new String(pdfBytes, 0, 4);
            assertTrue(header.startsWith("%PDF"));
        }
    }
}
