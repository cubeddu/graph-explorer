# Fetching the content of the provided URL to extract the TypeScript types
import requests

url = "https://raw.githubusercontent.com/aws/graph-explorer/main/packages/graph-explorer/src/core/ConfigurationProvider/types.ts"
response = requests.get(url)
types_ts_content = response.text
print(types_ts_content[:1000])  # Displaying the first 1000 characters for a brief overview
