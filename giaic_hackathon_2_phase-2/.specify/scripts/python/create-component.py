#!/usr/bin/env python3
"""
Script to generate Next.js components with TypeScript
"""

import os
import sys
from pathlib import Path

def create_component(component_name: str, props_interface: str = ""):
    """Create a Next.js component with TypeScript"""

    # Create components directory if it doesn't exist
    components_dir = Path("src/frontend/src/components")
    components_dir.mkdir(parents=True, exist_ok=True)

    component_dir = components_dir / component_name
    component_dir.mkdir(exist_ok=True)

    # Create the component file
    component_content = f'''// src/components/{component_name}/{component_name}.tsx
"use client";

import React from 'react';
{f'import {{ {component_name}Props }} from "./{component_name}.types";' if props_interface else ''}

interface {component_name}Props {'{' + props_interface + '}' if props_interface else '{}'}

const {component_name}: React.FC<{component_name}Props> = ({'{' + props_interface.replace(";", ", ") + '}' if props_interface else ''}) => {{
  return (
    <div className="{component_name.lower()}">
      <h1>{component_name} Component</h1>
      {/* Add your component JSX here */}
    </div>
  );
}};

export default {component_name};
'''

    with open(component_dir / f"{component_name}.tsx", "w") as f:
        f.write(component_content)

    # Create types file if props interface is provided
    if props_interface:
        types_content = f'''// src/components/{component_name}/{component_name}.types.ts
export interface {component_name}Props {{
  {props_interface}
}}
'''
        with open(component_dir / f"{component_name}.types.ts", "w") as f:
            f.write(types_content)

    # Create stories file for Storybook
    stories_content = f'''// src/components/{component_name}/{component_name}.stories.tsx
import type {{ Meta, StoryObj }} from '@storybook/react';
import {component_name} from './{component_name}';

const meta: Meta<typeof {component_name}> = {{
  title: 'Components/{component_name}',
  component: {component_name},
  tags: ['autodocs'],
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Primary: Story = {{
  args: {{}},
}};
'''

    with open(component_dir / f"{component_name}.stories.tsx", "w") as f:
        f.write(stories_content)

    # Create test file
    test_content = f'''// src/components/{component_name}/{component_name}.test.tsx
import {{ render, screen }} from '@testing-library/react';
import {component_name} from './{component_name}';

describe('{component_name}', () => {{
  it('should render successfully', () => {{
    const {{ baseElement }} = render(<{component_name} />);
    expect(baseElement).toBeTruthy();
  }});
}});
'''

    with open(component_dir / f"{component_name}.test.tsx", "w") as f:
        f.write(test_content)

    print(f"Component {component_name} created successfully!")
    print(f"Files created:")
    print(f"- {component_dir}/{component_name}.tsx")
    if props_interface:
        print(f"- {component_dir}/{component_name}.types.ts")
    print(f"- {component_dir}/{component_name}.stories.tsx")
    print(f"- {component_dir}/{component_name}.test.tsx")

def main():
    if len(sys.argv) < 2:
        print("Usage: python create-component.py <component_name> [props_interface]")
        print("Example: python create-component.py Button 'children: React.ReactNode; onClick?: () => void;'")
        sys.exit(1)

    component_name = sys.argv[1]
    props_interface = sys.argv[2] if len(sys.argv) > 2 else ""

    create_component(component_name, props_interface)

if __name__ == "__main__":
    main()