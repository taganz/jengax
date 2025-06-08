# Jengax  (work in progress)

**Jengax** is a browser-based interactive block-stacking game inspired by construction logic puzzles.  
Users can place vertical and horizontal rectangular pieces based on specific support rules.

<div align="center">
    <img src="assets/readme.png" alt="Gameplay preview" width="400">
</div>
## 🎮 How to Play

- **Left-click** to place a piece at the clicked position.
- **Right-click** to remove the last piece.
- **Hover** over a recent point or **hold `Q`** to display its coordinates.
- Only the **last 3 click points** are shown, decreasing in size and darkness.

## 🧠 Game Rules

- Vertical pieces rest on the ground or on the top of other pieces.
- Horizontal pieces can only be placed if two supporting vertical pieces are aligned and close enough.
- Horizontal pieces are slightly wider than the space between supports (extend by half a block on each side).
- Interference (e.g., a piece blocking above) prevents horizontal placement.

## 🛠 Built With

- [p5.js](https://p5js.org/) for rendering and interaction.
- Vanilla JavaScript and HTML5.

## 🌐 Live Demo

You can play the game online here:  
👉 [https://rdalmau.com/jengax/](https://rdalmau.com/jengax/)



