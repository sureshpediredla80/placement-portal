import os
import re

directory = r"C:\Users\Sures\.gemini\antigravity\scratch\college-placement-system\src\main\java\com\college\placement\controller"

imports = """import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
"""

for filename in os.listdir(directory):
    if filename.endswith("Controller.java"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "io.swagger.v3.oas.annotations.Operation" in content:
            continue
            
        # Add imports
        content = re.sub(r'(package com\.college\.placement\.controller;[\r\n]+)', r'\1\n' + imports + '\n', content, count=1)
        
        # Add @Tag to class
        class_name = filename.replace('.java', '')
        tag_str = f'@Tag(name = "{class_name}", description = "APIs for {class_name}")\npublic class {class_name}'
        content = re.sub(rf'public class {class_name}', tag_str, content, count=1)
        
        # Add @Operation and @SecurityRequirement to endpoints
        def method_replacer(match):
            mapping = match.group(1)
            # Find the next word after mapping to guess the operation name, but mapping is just the annotation.
            # We'll just use a generic summary based on the mapping type
            mapping_type = match.group(2) # Get, Post, Put, Delete
            
            op_str = f'@Operation(summary = "{mapping_type} endpoint")\n    @SecurityRequirement(name = "Bearer Authentication")\n    {mapping}'
            return op_str

        # Match @GetMapping, @PostMapping, @PutMapping, @DeleteMapping with or without path
        content = re.sub(r'(@(Get|Post|Put|Delete)Mapping[^\n\r]*)', method_replacer, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Swagger annotations added to all controllers.")
