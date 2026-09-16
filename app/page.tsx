"use client";

import { useMemo, useState } from "react";

type Direction = "n" | "e" | "s" | "w";
type Command = "move" | "left" | "right";
type Mode = "explorer" | "builder";

type BotState = {
  x: number;
  y: number;
  direction: Direction;
};

const WIDTH = 6;
const HEIGHT = 4;
const START: BotState = { x: 0, y: 2, direction: "e" };
const GOAL = { x: 4, y: 2 };

const directionOrder: Direction[] = ["n", "e", "s", "w"];

function turn(direction: Direction, delta: -1 | 1): Direction {
  const index = directionOrder.indexOf(direction);
  return directionOrder[(index + delta + directionOrder.length) % directionOrder.length];
}

function moveForward(bot: BotState): BotState | null {
  const next = { ...bot };
  if (bot.direction === "n") next.y -= 1;
  if (bot.direction === "s") next.y += 1;
  if (bot.direction === "e") next.x += 1;
  if (bot.direction === "w") next.x -= 1;

  if (next.x < 0 || next.x >= WIDTH || next.y < 0 || next.y >= HEIGHT) {
    return null;
  }

  return next;
}

function commandLabel(command: Command, mode: Mode) {
  const labels = {
    move: mode === "explorer" ? "➡️ Move" : "move()",
    left: mode === "explorer" ? "↩️ Turn left" : "turn_left()",
    right: mode === "explorer" ? "↪️ Turn right" : "turn_right()",
  };
  return labels[command];
}

function pythonFor(commands: Command[]) {
  if (commands.length === 0) return "# Add some commands to begin";
  return commands
    .map((command) => {
      if (command === "move") return "move()";
      if (command === "left") return "turn_left()";
      return "turn_right()";
    })
    .join("\n");
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("explorer");
  const [commands, setCommands] = useState<Command[]>([]);
  const [bot, setBot] = useState<BotState>(START);
  const [status, setStatus] = useState("Build a program, then press Run.");
  const [statusType, setStatusType] = useState<"normal" | "success" | "error">("normal");
  const [showPython, setShowPython] = useState(false);
  const [running, setRunning] = useState(false);

  const tiles = useMemo(
    () => Array.from({ length: WIDTH * HEIGHT }, (_, index) => ({ x: index % WIDTH, y: Math.floor(index / WIDTH) })),
    [],
  );

  function addCommand(command: Command) {
    if (running || commands.length >= 12) return;
    setCommands((current) => [...current, command]);
    setStatus("Nice. Keep building your program.");
    setStatusType("normal");
  }

  function removeCommand(index: number) {
    if (running) return;
    setCommands((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function resetBot() {
    if (running) return;
    setBot(START);
    setStatus("Bot reset. Your program is still here.");
    setStatusType("normal");
  }

  function clearProgram() {
    if (running) return;
    setCommands([]);
    setBot(START);
    setStatus("Program cleared. Try a new idea.");
    setStatusType("normal");
  }

  async function runProgram() {
    if (running || commands.length === 0) {
      if (commands.length === 0) {
        setStatus("Add at least one command first.");
        setStatusType("error");
      }
      return;
    }

    setRunning(true);
    setBot(START);
    setStatus("Running your code…");
    setStatusType("normal");

    let current = START;
    let crashed = false;

    await new Promise((resolve) => setTimeout(resolve, 350));

    for (const command of commands) {
      if (command === "left") current = { ...current, direction: turn(current.direction, -1) };
      if (command === "right") current = { ...current, direction: turn(current.direction, 1) };
      if (command === "move") {
        const moved = moveForward(current);
        if (!moved) {
          crashed = true;
          setStatus("Bonk! The bot tried to leave the cave. Change your program and try again.");
          setStatusType("error");
          break;
        }
        current = moved;
      }

      setBot(current);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    if (!crashed) {
      if (current.x === GOAL.x && current.y === GOAL.y) {
        setStatus("Mission complete! 💎 You programmed the bot to reach the crystal.");
        setStatusType("success");
      } else {
        setStatus("Good run! The bot did exactly what you told it. Now adjust the program to reach the crystal.");
        setStatusType("normal");
      }
    }

    setRunning(false);
  }

  return (
    <main className="shell">
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="logo" aria-hidden="true">⛏️</div>
            <div>
              <h1>CodeBurrow</h1>
              <p>Dig in. Build up. Code for real.</p>
            </div>
          </div>

          <div className="mode-switch" aria-label="Choose learning view">
            <button type="button" className={mode === "explorer" ? "active" : ""} onClick={() => setMode("explorer")}>🧭 Explorer</button>
            <button type="button" className={mode === "builder" ? "active" : ""} onClick={() => setMode("builder")}>🛠️ Builder</button>
          </div>
        </header>

        <section className="hero">
          <div className="eyebrow">Mission 1 · Sequences</div>
          <h2>Help BurrowBot find the crystal.</h2>
          <p>
            {mode === "explorer"
              ? "Tap commands to tell the bot what to do. Then press Run and watch your code come alive."
              : "Build a sequence of commands, run it, then compare your program with real Python."}
          </p>
        </section>

        <section className="workspace">
          <div className="panel">
            <h3>🗺️ Cave</h3>
            <div className="game-grid" aria-label="Mission game board">
              {tiles.map((tile) => {
                const isBot = bot.x === tile.x && bot.y === tile.y;
                const isGoal = GOAL.x === tile.x && GOAL.y === tile.y;
                const isStart = START.x === tile.x && START.y === tile.y;
                return (
                  <div key={`${tile.x}-${tile.y}`} className={`tile ${isGoal ? "goal" : ""} ${isStart ? "start" : ""}`}>
                    {isGoal && !isBot ? <span aria-label="crystal">💎</span> : null}
                    {isBot ? <span className={`bot direction-${bot.direction}`} aria-label={`BurrowBot facing ${bot.direction}`}>🤖➡️</span> : null}
                  </div>
                );
              })}
            </div>

            <div className={`status ${statusType === "success" ? "success" : ""} ${statusType === "error" ? "error" : ""}`} aria-live="polite">
              {status}
            </div>
          </div>

          <div className="panel">
            <h3>{mode === "explorer" ? "🧩 Your Commands" : "⌨️ Program"}</h3>

            <div className="toolbox">
              <button type="button" className="command-btn" disabled={running} onClick={() => addCommand("move")}>{commandLabel("move", mode)}</button>
              <button type="button" className="command-btn" disabled={running} onClick={() => addCommand("left")}>{commandLabel("left", mode)}</button>
              <button type="button" className="command-btn" disabled={running} onClick={() => addCommand("right")}>{commandLabel("right", mode)}</button>
            </div>

            <div className="program">
              {commands.length === 0 ? (
                <div className="program-empty">Your program is empty. Add a command above. 👆</div>
              ) : (
                <div className="program-list">
                  {commands.map((command, index) => (
                    <span className="program-chip" key={`${command}-${index}`}>
                      {commandLabel(command, mode)}
                      <button type="button" aria-label={`Remove command ${index + 1}`} onClick={() => removeCommand(index)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="actions">
              <button type="button" className="action-btn" disabled={running || commands.length === 0} onClick={runProgram}>▶ Run</button>
              <button type="button" className="action-btn secondary" disabled={running} onClick={resetBot}>↺ Reset bot</button>
              <button type="button" className="action-btn secondary" disabled={running || commands.length === 0} onClick={clearProgram}>Clear</button>
              <button type="button" className="action-btn gold" onClick={() => setShowPython((value) => !value)}>
                🐍 {showPython ? "Hide Python" : "Show Python"}
              </button>
            </div>

            {showPython ? (
              <div className="code-box">
                <pre>{pythonFor(commands)}</pre>
              </div>
            ) : null}

            <div className="lesson-note">
              <strong>What you&apos;re learning:</strong> computers follow instructions in order. That ordered list is called a <strong>sequence</strong>.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
