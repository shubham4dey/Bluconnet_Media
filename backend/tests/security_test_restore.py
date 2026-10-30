#!/usr/bin/env python3
import sys

filepath = r"C:\Users\Century\Desktop\acceleration-clone\backend\tests\security.test.js"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Keep only first 177 lines (original content)
kept = lines[:177]

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(kept)

print(f"Restored {filepath}: kept {len(kept)} lines, removed {len(lines) - 177} lines")