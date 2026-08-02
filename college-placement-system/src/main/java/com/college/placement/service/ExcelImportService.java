package com.college.placement.service;

import com.college.placement.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ExcelImportService {

    public List<String> extractEmails(MultipartFile file) {

        List<String> emails = new ArrayList<>();

        try (Workbook workbook =
                     WorkbookFactory.create(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            if (sheet == null) {
                throw new BadRequestException(
                        "Excel sheet not found.");
            }

            Row headerRow = sheet.getRow(0);

            if (headerRow == null) {
                throw new BadRequestException(
                        "Header row not found.");
            }

            int emailColumn =
                    findEmailColumn(headerRow);

            DataFormatter formatter =
                    new DataFormatter();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {

                Row row = sheet.getRow(i);

                if (row == null) {
                    continue;
                }

                Cell cell =
                        row.getCell(emailColumn);

                String email =
                        getCellValue(cell, formatter);

                if (!email.isBlank()) {
                    emails.add(
                            email.trim().toLowerCase()
                    );
                }
            }

        } catch (IOException e) {

            throw new BadRequestException(
                    "Unable to read excel file."
            );
        }

        return emails;
    }

    private int findEmailColumn(Row headerRow) {

        DataFormatter formatter =
                new DataFormatter();

        for (Cell cell : headerRow) {

            String value =
                    formatter
                            .formatCellValue(cell)
                            .trim()
                            .toLowerCase();

            if (value.equals("email")
                    || value.equals("email id")
                    || value.equals("mail")
                    || value.equals("email address")) {

                return cell.getColumnIndex();
            }
        }

        throw new BadRequestException(
                "Email column not found."
        );
    }

    private String getCellValue(
            Cell cell,
            DataFormatter formatter) {

        if (cell == null) {
            return "";
        }

        return formatter
                .formatCellValue(cell)
                .trim();
    }

}