// File: `apps/web/app/game/DemoGame.tsx`
"use client";
import { useEffect, useRef, useState } from "react";
import { GameManager } from "@repo/game-engine";
import { createMarioGame, startMarioGame, destroyMarioGame } from "./mario";

export default function DemoGame() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const gameManagerRef = useRef<GameManager | null>(null);
  const [gameState, setGameState] = useState({ score: 0, lives: 3 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Create and start the Mario game
    (async () => {
      try {
        const gameManager = await createMarioGame(mount);
        gameManagerRef.current = gameManager;

        startMarioGame(gameManager);
        setIsLoading(false);

        // Listen for game events
        const eventBus = gameManager.getEventBus();
        eventBus.on("levelComplete", () => {
          console.log("Level completed!");
        });

        eventBus.on("gameOver", () => {
          console.log("Game over!");
        });

        // Update UI with game state
        const updateInterval = setInterval(() => {
          const entities = gameManager.getEntities();
          const player = entities.find((e) => e.name === "Mario");
          if (player) {
            const state = player.getComponent<any>("PlayerState");
            if (state) {
              setGameState({ score: state.score, lives: state.lives });
            }
          }
        }, 100);

        // Cleanup on unmount
        return () => {
          clearInterval(updateInterval);
          destroyMarioGame(gameManager);
          gameManagerRef.current = null;
        };
      } catch (error) {
        console.error("Failed to initialize game:", error);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Game canvas */}
      <div style={{ width: "100%", height: "100%", position: "relative" }} ref={mountRef} />

      {/* Loading screen */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            color: "white",
            fontSize: "24px",
          }}
        >
          Loading 3D Assets...
        </div>
      )}

      {/* HUD - Score and Lives */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          zIndex: 10,
        }}
      >
        <div>Score: {gameState.score}</div>
        <div>Lives: {gameState.lives}</div>
      </div>

      {/* Controls - Help Text */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: "white",
          fontSize: "16px",
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: "15px",
          borderRadius: "8px",
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Controls:</div>
        <div>← → A D - Move</div>
        <div>SPACE W ↑ - Jump</div>
        <div>Gamepad - Supported</div>
        <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.8 }}>
          Collect coins • Avoid enemies • Reach the flag
        </div>
      </div>
    </div>
  );
}