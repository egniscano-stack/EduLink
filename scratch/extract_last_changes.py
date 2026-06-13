import json

transcript_path = "/Users/egnis/.gemini/antigravity-ide/brain/0a4e46a6-cd4d-4315-95d9-a0b07087af69/.system_generated/logs/transcript.jsonl"

# Read transcript lines backwards to find the last updates to app.js and index.html
app_js_content = None
index_html_content = None

with open(transcript_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in transcript: {len(lines)}")

# We can search for tool calls to replace_file_content or write_to_file
for line in reversed(lines):
    try:
        step = json.loads(line)
        if step.get("type") == "TOOL_CALL" or "tool_calls" in step:
            tool_calls = step.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name")
                args = tc.get("args", {})
                if not args:
                    continue
                # If it's a replacement or write
                target_file = args.get("TargetFile") or args.get("Target")
                if not target_file:
                    continue
                if "app.js" in target_file and app_js_content is None:
                    print("Found edit to app.js:")
                    print(json.dumps(args, indent=2)[:500])
                    # Wait, if we find a tool call to write_to_file or replace_file_content,
                    # we can note it, but let's see if we have the full content in the workspace backup or previous git commit
                
    except Exception as e:
        pass
