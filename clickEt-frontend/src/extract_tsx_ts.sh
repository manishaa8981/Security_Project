#!/bin/bash

# Define the output file
output_file="all_tsx_ts_code.txt"

# Clear the output file if it already exists
> "$output_file"

# Find all .tsx and .ts files and concatenate their content into the output file
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec cat {} >> "$output_file" \;

echo "All TypeScript and TypeScriptX code has been extracted to $output_file"
