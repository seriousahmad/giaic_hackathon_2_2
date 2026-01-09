#!/bin/bash
# Auto-Dev Agent startup script

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Python3 is required but not installed."
    exit 1
fi

# Run the autodev agent with the provided arguments
python3 .specify/scripts/python/autodev_agent.py "$@"