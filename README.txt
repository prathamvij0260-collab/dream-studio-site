Dream Studio Print V3.2 — smoother opening animation

Replace only:
- script.js
- experience.css

What changed:
- The opening animation now smooths raw scroll input with requestAnimationFrame damping.
- Sitting -> rising -> standing uses continuous eased crossfades instead of abrupt opacity windows.
- Walking frames blend continuously instead of switching on/off.
- Horizontal walking uses eased movement.
- A very small walking bob makes the gait feel less mechanical.
- The opening has more scroll distance so standing up doesn't happen too quickly.
- GPU-friendly translate3d/backface settings reduce visual jitter.

No image files need to be replaced for this update.

After upload:
1. Commit.
2. Wait for Vercel Ready.
3. Hard refresh with Ctrl+Shift+R.
4. Test the first animation with a slow scroll.
