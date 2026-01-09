#!/usr/bin/env python3
"""
MCP Server for Auto-Dev Agent
This server allows Claude Code to communicate with our auto-execution agent
"""

import json
import sys
import os
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from autodev_agent import AutoDevAgent

def handle_request(request):
    """Handle incoming MCP requests"""
    method = request.get("method")

    if method == "tools/list":
        # Return available tools
        return {
            "result": {
                "tools": [
                    {
                        "name": "auto_execute_skill",
                        "description": "Automatically execute the appropriate development skill based on context",
                        "input_schema": {
                            "type": "object",
                            "properties": {
                                "context": {
                                    "type": "string",
                                    "description": "The user request context that determines which skill to execute"
                                }
                            },
                            "required": ["context"]
                        }
                    }
                ]
            }
        }
    elif method == "tools/call":
        # Execute a tool
        tool_name = request["params"]["name"]
        tool_arguments = request["params"]["arguments"]

        if tool_name == "auto_execute_skill":
            context = tool_arguments.get("context", "")
            agent = AutoDevAgent()
            result = agent.process_request(context)

            return {
                "result": {
                    "output": result
                }
            }

    return {"error": {"code": -32601, "message": "Method not found"}}

def main():
    """Main MCP server loop"""
    for line in sys.stdin:
        try:
            request = json.loads(line.strip())
            response = handle_request(request)
            response["id"] = request.get("id")

            print(json.dumps(response), flush=True)
        except json.JSONDecodeError:
            continue
        except Exception as e:
            error_response = {
                "id": None,
                "error": {
                    "code": -32603,
                    "message": f"Internal error: {str(e)}"
                }
            }
            print(json.dumps(error_response), flush=True)

if __name__ == "__main__":
    main()