# Auto-Dev Agent for Full-Stack Project Automation

This project includes an automated development agent that can execute common tasks based on natural language commands.

## How It Works

The Auto-Dev Agent automatically recognizes common development commands and executes the appropriate scripts from the `.specify/scripts/` directory.

## Available Commands

### Project Setup
- "initialize the full stack project" → Runs `init-project.sh`
- "setup the project" → Runs `init-project.sh`
- "run fastapi" → Runs `init-backend.sh` (if backend doesn't exist)
- "initialize nextjs" → Runs `init-frontend.sh` (if frontend doesn't exist)

### API Development
- "create [entity] endpoint" → Runs `create-endpoint.sh [entity]`
- "add [entity] api" → Runs `create-endpoint.sh [entity]`
- "new [entity] endpoint" → Runs `create-endpoint.sh [entity]`

### Frontend Development
- "create [component] component" → Runs `create-component.py [component]`
- "add [component] component" → Runs `create-component.py [component]`

## Manual Usage

You can also run the scripts directly:

### Bash Scripts
```bash
bash .specify/scripts/bash/init-project.sh
bash .specify/scripts/bash/create-endpoint.sh User
bash .specify/scripts/bash/start-dev-env.sh
```

### Python Scripts
```bash
python .specify/scripts/python/autodev_agent.py "create user endpoint"
python .specify/scripts/python/create-component.py Button
python .specify/scripts/python/generate-api-tests.py User
```

## Automation Agent

The Auto-Dev Agent can be invoked with:
```bash
python .specify/scripts/python/autodev_agent.py "[your command]"
```

It will analyze your command and execute the appropriate automation script automatically.

## Script Directory Structure

```
.specify/
├── scripts/
│   ├── bash/
│   │   ├── init-project.sh        # Initialize complete project
│   │   ├── init-frontend.sh       # Initialize Next.js frontend
│   │   ├── init-backend.sh        # Initialize FastAPI backend
│   │   ├── init-database.sh       # Initialize database structure
│   │   ├── create-endpoint.sh     # Create API endpoint
│   │   ├── start-dev-env.sh       # Start development environment
│   │   └── generate-docs.sh       # Generate documentation
│   └── python/
│       ├── autodev_agent.py       # Auto-execution agent
│       ├── create-component.py    # Create React component
│       └── generate-api-tests.py  # Generate API tests
└── templates/
    ├── spec-template.md
    ├── plan-template.md
    └── tasks-template.md
```

## Integration with Claude Code

The `.claude/settings.local.json` file includes permissions for the automation scripts, allowing Claude Code to execute them when needed.