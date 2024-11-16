import json
import os

# Get list of technologies from Projects.json

projects_path = os.path.join(os.getcwd(), "./src/data/json/Projects.json")

with open(projects_path) as f:
    data = json.load(f)
    projects = data["projects"]
    technologies = []

    for project in projects:
        for technology in project["technologies"]:
            if technology not in technologies:
                technologies.append(technology)

    technologies = sorted(technologies)

    result = "technologiesOptions:["
    for technology in technologies:
        result += f'"{technology}",'
    result = result[:-1] + "]"

    print(result)
