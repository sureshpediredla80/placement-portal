import java.io.*;
import java.nio.file.*;
import java.util.regex.*;

public class AddSwagger {
    public static void main(String[] args) throws Exception {
        String dirPath = "C:\\Users\\Sures\\.gemini\\antigravity\\scratch\\college-placement-system\\src\\main\\java\\com\\college\\placement\\controller";
        File dir = new File(dirPath);
        if (!dir.exists() || !dir.isDirectory()) {
            System.out.println("Directory not found.");
            return;
        }

        String imports = "import io.swagger.v3.oas.annotations.Operation;\n" +
                         "import io.swagger.v3.oas.annotations.security.SecurityRequirement;\n" +
                         "import io.swagger.v3.oas.annotations.tags.Tag;\n";

        for (File file : dir.listFiles()) {
            if (file.getName().endsWith("Controller.java")) {
                String content = new String(Files.readAllBytes(file.toPath()));

                if (content.contains("io.swagger.v3.oas.annotations.Operation")) {
                    continue;
                }

                // Add imports
                content = content.replaceFirst("(package com\\.college\\.placement\\.controller;\\s+)", "$1" + imports + "\n");

                // Add @Tag
                String className = file.getName().replace(".java", "");
                String tagStr = "@Tag(name = \"" + className + "\", description = \"APIs for " + className + "\")\npublic class " + className;
                content = content.replaceFirst("public class " + className, tagStr);

                // Add @Operation and @SecurityRequirement
                Pattern p = Pattern.compile("(@(Get|Post|Put|Delete|Patch)Mapping[^\\n\\r]*)");
                Matcher m = p.matcher(content);
                StringBuffer sb = new StringBuffer();
                while (m.find()) {
                    String mapping = m.group(1);
                    String mappingType = m.group(2);
                    String replacement = "@Operation(summary = \"" + mappingType + " endpoint\")\n    @SecurityRequirement(name = \"Bearer Authentication\")\n    " + mapping;
                    m.appendReplacement(sb, Matcher.quoteReplacement(replacement));
                }
                m.appendTail(sb);

                Files.write(file.toPath(), sb.toString().getBytes());
                System.out.println("Processed " + file.getName());
            }
        }
        System.out.println("Swagger annotations added via Java tool.");
    }
}
