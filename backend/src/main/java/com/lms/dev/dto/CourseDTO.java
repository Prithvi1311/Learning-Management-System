package com.lms.dev.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CourseDTO {
    private String courseName;
    private int price;
    private String description;
    private String thumbnail;
    private String videoLink; // Or y_link, usually prefer camelCase in DTO
    private UUID instructorId;
}
