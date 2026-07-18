# Visual Identity & CSS Styling Guide

This guide details the styling variables, design system rules, and motion controls of the Expense Tracker.

## Color Tokens

- **Food:** Rose/Pink (`#f43f5e`)
- **Education:** Emerald Green (`#10b981`)
- **Technology:** Indigo (`#6366f1`)
- **Entertainment:** Warm Amber (`#f59e0b`)
- **Other:** Cyan (`#06b6d4`)

## Motion & 3D Tilt

We employ vanilla JS to track pointer metrics inside card bounds, calculating rotations along X and Y bounds:
- **Max Rotation:** `10deg`
- **Offset:** `-4px` vertical translate on hover.
- **Mobile Safeguard:** JavaScript bypasses tilt calculations on touch-capable screens to prevent UI jitters.
