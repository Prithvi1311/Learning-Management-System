package com.lms.dev.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Date;

@Service
public class CertificateService {

    public byte[] generateCertificate(String studentName, String courseName, String certificateNumber)
            throws DocumentException {
        // Landscape A4, with margins
        Document document = new Document(PageSize.A4.rotate(), 50, 50, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        // CAPTURE THE WRITER INSTANCE HERE
        PdfWriter writer = PdfWriter.getInstance(document, out);

        document.open();

        // --- 1. Logo (Top Left, Absolute Positioning) ---
        try {
            java.net.URL logoUrl = getClass().getResource("/logo.png");
            Image logo = null;
            if (logoUrl != null) {
                logo = Image.getInstance(logoUrl);
            } else {
                String localPath = "src/main/resources/logo.png";
                logo = Image.getInstance(localPath);
            }

            if (logo != null) {
                logo.scaleToFit(120, 80);
                // Absolute position: Top Right coordinate of page is roughly (842, 595) for A4
                // Landscape
                logo.setAbsolutePosition(50f, 500f);
                document.add(logo);
            }
        } catch (Exception e) {
            System.err.println("Logo not found: " + e.getMessage());
        }

        // --- Layout Spacing ---
        Paragraph spacer = new Paragraph(" ");
        spacer.setSpacingAfter(60);
        document.add(spacer);

        // --- 2. Title ---
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 32, new BaseColor(0, 86, 210));
        Paragraph title = new Paragraph("CERTIFICATE OF COMPLETION", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(0);
        document.add(title);

        // --- 3. Subtitle ---
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.BLACK);
        Paragraph subtitle = new Paragraph("Presented to", subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingBefore(30);
        document.add(subtitle);

        // --- 4. Student Name ---
        Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, BaseColor.BLACK);
        Paragraph name = new Paragraph(studentName, nameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        name.setSpacingBefore(10);
        document.add(name);

        // --- 5. Body text ---
        Paragraph body = new Paragraph("For successfully completing the course", subtitleFont);
        body.setAlignment(Element.ALIGN_CENTER);
        body.setSpacingBefore(20);
        document.add(body);

        // --- 6. Course Name ---
        Font courseFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BaseColor.BLACK);
        Paragraph course = new Paragraph(courseName, courseFont);
        course.setAlignment(Element.ALIGN_CENTER);
        course.setSpacingBefore(10);
        document.add(course);

        // --- 7. Date (Left aligned or Centered) ---
        Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.DARK_GRAY);
        Paragraph date = new Paragraph("Date: " + new Date().toString(), dateFont);
        date.setAlignment(Element.ALIGN_CENTER);
        date.setSpacingBefore(40);
        document.add(date);

        // --- 8. Signature (Bottom Right) ---
        try {
            java.net.URL sigUrl = getClass().getResource("/signature.png");
            Image signature = null;
            if (sigUrl != null) {
                signature = Image.getInstance(sigUrl);
            } else {
                String localPath = "src/main/resources/signature.png";
                signature = Image.getInstance(localPath);
            }

            if (signature != null) {
                signature.scaleToFit(140, 70);
                signature.setAlignment(Element.ALIGN_RIGHT);
                signature.setIndentationRight(50);
                signature.setSpacingBefore(10);
                document.add(signature);
            }
        } catch (Exception e) {
            System.err.println("Signature not found: " + e.getMessage());
        }

        Font signFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);
        Paragraph signatureText = new Paragraph("Instructor Signature", signFont);
        signatureText.setAlignment(Element.ALIGN_RIGHT);
        signatureText.setIndentationRight(60);
        document.add(signatureText);

        // --- 9. Certificate Number (Bottom Center/Left) ---
        Font certNumFont = FontFactory.getFont(FontFactory.COURIER, 10, BaseColor.GRAY);

        // USE THE CAPTURED WRITER INSTANCE
        PdfContentByte canvas = writer.getDirectContent();

        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                new Phrase("Certificate ID: " + certificateNumber, certNumFont),
                421, 30, 0);

        document.close();

        return out.toByteArray();
    }
}
