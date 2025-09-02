# Libra UI

**The perfect balance between Developer Experience (DX) and User Experience (UX).**

A collection of beautifully designed, accessible, and customizable UI components for SolidJS.

[![NPM version](https://img.shields.io/npm/v/solid-libra-ui.svg)](https://www.npmjs.com/package/solid-libra-ui)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/OkihiraHijirikawa/solid-libra-ui/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/OkihiraHijirikawa/solid-libra-ui?style=social)](https://github.com/OkihiraHijirikawa/solid-libra-ui/stargazers)

## Overview

**Libra UI** is a component library for SolidJS.

This is not a component library in the traditional sense. It's not a package you install from npm and `import` from. Instead, you use the CLI to add components directly into your source code, giving you 100% ownership.

### Why this approach?

- **Full Ownership:** Components become part of your codebase. You can freely customize their styles and logic without wrestling with third-party abstractions.
- **Learn by Reading:** The internal implementation of components is not a black box. You can learn by reading the code directly.
- **No Unnecessary Dependencies:** You don't need to add the entire massive library to your `node_modules`. Pick and choose only what you need.

## Installation and Usage

You can easily set up Libra UI with its CLI tool.

### 1. Initialization

First, run the following command in your SolidJS project.
This will generate a configuration file (`libra.config.json`) and inject basic CSS variables into your stylesheet.

```bash
npx solid-libra-ui@latest init
2. Adding Components
Next, use the add command to add the components you need to your project. Any internal dependencies will be added automatically.
code
Bash
npx solid-libra-ui@latest add [component-name]
Examples:
code
Bash
# Add a single button component
npx solid-libra-ui@latest add button

# Add multiple components at once
npx solid-libra-ui@latest add dialog input
3. Usage
When you add a component, its files will be created in the directory specified in libra.config.json (default: src/components/ui). From there, you can import and use it just like any other SolidJS component.
code
Tsx
import { Button } from "./components/ui/button";

const MyPage = () => {
  return (
    <div class="grid place-items-center h-screen">
      <Button onClick={() => alert("Hello Libra UI!")}>
        Click Me
      </Button>
    </div>
  );
};

export default MyPage;
Available Components
Component	Status
Accordion	✅
Avatar	✅
Button	✅
Calendar	✅
Card	✅
Checkbox	✅
Combobox	✅
Date Picker	✅
Dialog	✅
Drawer	✅
Icon Button	✅
Input	✅
Number Input	✅
Popover	✅
Radio Group	✅
Selector	✅
Table	✅
Textarea	✅
Future Roadmap
The following components and features are currently planned for implementation:

Carousel

Pagination

Editable Table

Dark Mode theme switching

Badge

Chart

...and more, based on community feedback!
Contributing
We welcome bug reports, feature proposals, and pull requests! Let's work together to enrich the SolidJS ecosystem.
If you'd like to contribute, please start by opening an issue on GitHub Issues to start a discussion, or feel free to tackle an existing issue.
License
This project is licensed under the MIT License. You are free to use it for any purpose, commercial or non-commercial.
```
