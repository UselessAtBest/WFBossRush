import json

input_file = "poolNormal.json"
output_file = "pool_fixed.json"

try:
    with open(input_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Detect opening and closing brackets
    opening_bracket = ""
    closing_bracket = ""
    if lines and lines[0].strip() == "[":
        opening_bracket = lines.pop(0)
    if lines and lines[-1].strip() == "]":
        closing_bracket = lines.pop(-1)

    objects = []
    placeholders = []

    for line in lines:
        raw_line = line.rstrip("\n")
        if not raw_line.strip():
            placeholders.append(None)
            continue

        has_comma = raw_line.rstrip().endswith(",")
        line_clean = raw_line.rstrip(",").strip()

        try:
            obj = json.loads(line_clean)
        except Exception:
            print("Skipping invalid line:", line_clean)
            placeholders.append(None)
            continue

        # Ensure arrays
        if not isinstance(obj.get("category", ""), list):
            obj["category"] = [obj.get("category", "").strip()]
        if not isinstance(obj.get("type", ""), list):
            obj["type"] = [obj.get("type", "").strip()]

        # Remove leading/trailing spaces in name, keep internal spaces
        obj["name"] = obj.get("name", "").strip()
        obj["rerolls"] = str(obj.get("rerolls", ""))

        obj['_comma'] = has_comma
        idx = len(objects)
        objects.append(obj)
        placeholders.append(idx)

    # Compute max lengths for spacing AFTER closing quote
    max_name = max(len(f'"{o["name"]}"') for o in objects)
    max_category = max(len(f'{json.dumps(o["category"])}') for o in objects)
    max_type = max(len(f'{json.dumps(o["type"])}') for o in objects)
    max_rerolls = max(len(f'"{o["rerolls"]}"') for o in objects)

    # Write aligned output preserving blank lines and trailing commas
    with open(output_file, "w", encoding="utf-8") as f:
        if opening_bracket:
            f.write(opening_bracket + "\n")

        for ph in placeholders:
            if ph is None:
                f.write("\n")
            else:
                obj = objects[ph]
                line_out = (
                    f'{{ "name": "{obj["name"]}"'.ljust(9 + max_name) +  # 9 = len('{ "name": ')
                    f', "category": {json.dumps(obj["category"])}'.ljust(14 + max_category) +
                    f', "type": {json.dumps(obj["type"])}'.ljust(9 + max_type) +
                    f', "rerolls": "{obj["rerolls"]}"'.ljust(13 + max_rerolls) +
                    ' }'
                )
                if obj['_comma']:
                    line_out += ","
                f.write(line_out + "\n")

        if closing_bracket:
            f.write(closing_bracket + "\n")

    print(f"Converted JSON saved to {output_file}!")

except Exception as e:
    print("An error occurred:", e)

input("\nPress Enter to exit...")
