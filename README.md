# CodeBurrow

**Dig in. Build up. Code for real.**

CodeBurrow is a coding adventure for kids where programming visibly changes the world. Younger learners can begin with visual commands and older learners can progressively reveal, read, debug, and eventually write real Python.

## Product idea

CodeBurrow is not designed as a traditional course page. The world itself is the learning environment.

- **Explorer** — icon-first commands, sequencing, directions, minimal reading
- **Builder** — programming concepts with real code vocabulary and Python side-by-side
- **Coder** — typed Python, debugging, and multi-step challenges
- **Creator** — open-ended games, automation, simulations, and projects

These are skill levels, not age gates.

## Current MVP

Mission 1 is now implemented as the first playable learning loop:

- 2D cave grid
- BurrowBot character
- Move / turn command builder
- Run and reset controls
- Deterministic command execution
- Success and retry feedback
- Explorer and Builder views
- Live **Show Python** translation
- Responsive kid-friendly interface

Mission 1 teaches **sequences**: computers follow instructions in order.

## Planned first missions

1. Move the Bot — sequences
2. Build a Bridge — loops
3. Escape the Cave — conditions
4. Collect Crystals — variables
5. Build Automatically — functions
6. Protect the Camp — compound logic
7. Meet Python — block/code comparison
8. Fix the Code — debugging
9. Write Your First Program — typed commands
10. Build Your Own World — guided sandbox

## Tech direction

- Next.js 16
- React 19
- TypeScript
- Blockly-style visual programming as the block system grows
- Python generation from blocks
- Pyodide for browser-side Python execution where appropriate
- Supabase later for profiles, progress, parent views, and lesson state
- Vercel for deployment

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
npm run lint
```

## MVP success test

A child should be able to open CodeBurrow, understand Mission 1 with little or no adult explanation, program BurrowBot successfully, and want to continue to Mission 2.
