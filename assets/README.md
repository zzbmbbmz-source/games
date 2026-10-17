# Mythvale Online — Art Assets

This directory stores individually addressable, original SVG pixel-art assets for the browser game.

## Layout
- `characters/<job>/sprites.svg`: one 192×32 strip per job, 6 frames at 32×32 each.
- `monsters/<monster>/sprites.svg`: one 192×32 strip per standard monster, 6 frames; dragon uses 8 frames (256×32).
- `effects/slash-magic.svg`: 6-frame combat VFX strip.
- `world/tiles.svg`: 4 world tiles in a 128×32 strip (grass, path, water, tree).

## Character IDs
knight, archer, mage, priest

## Monster IDs
slime, poring, mushroom, wolf, skeleton, demon, golem, dragon (boss)

## Frame contract
Each standard frame is 32×32 pixels. Frame index is zero-based and can be drawn with source rectangle `sx = frameIndex * 32, sy = 0, sw = 32, sh = 32`. For the dragon strip, valid indices are 0–7.

These are authored as vector SVGs using crisp-edged pixel shapes, not raster PNGs. Each file is a starter strip: walk/idle/hit/attack/death are not yet separate polished animation sets, and the repository should not be considered a complete MMO until gameplay integration, per-state animation, and browser tests are complete.
