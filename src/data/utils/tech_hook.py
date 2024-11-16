import json
import os
import sys


def add_technologies(content_dict, technologies):
    if type(content_dict) is dict:
        for key, value in content_dict.items():
            if key == "technologies":
                for tech in value:
                    if str(tech) not in technologies:
                        technologies.add(str(tech))
            else:
                add_technologies(value, technologies)
    elif type(content_dict) is list:
        for item in content_dict:
            add_technologies(item, technologies)


def replace_key(content_dict, key, value):
    if type(content_dict) is dict:
        for k, v in content_dict.items():
            if k == key:
                content_dict[k] = value
            else:
                replace_key(v, key, value)
    elif type(content_dict) is list:
        for item in content_dict:
            replace_key(item, key, value)


def format_file(file_path):
    try:
        with open(file_path, "r+", encoding="utf-8") as f:
            content = f.read()
            content_dict = json.loads(content)

            technologies = set()
            add_technologies(content_dict, technologies)
            technologies = sorted(technologies)

            replace_key(content_dict, "technologiesOptions", technologies)
            modified_content = (
                json.dumps(content_dict, ensure_ascii=False, indent=2) + "\n"
            )

            if content != modified_content:
                f.seek(0)
                f.write(modified_content)
                f.truncate()
                return True
            return False

    except Exception as e:
        print(f"Error modifying {file_path}: {e}")
        return False


def main():
    staged_files = sys.argv[1:]
    formatted_file = False
    for file_path in staged_files:
        if format_file(file_path):
            formatted_file = True

    return 1 if formatted_file else 0


if __name__ == "__main__":
    sys.exit(main())
