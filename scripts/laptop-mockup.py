#!/usr/bin/env python3
"""
Composite a browser screenshot into a laptop mockup on an art-directed ground.

    python3 scripts/laptop-mockup.py <input> <output> [--hue "#0f2418"] [--accent "#3ddc84"]

Renders at 2x and downsamples, so the bezel corners and hinge stay clean.
"""
import argparse

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

S = 2  # supersample factor
W, H = 2000, 1330


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def ground(w, h, hue, accent):
    """Dark gradient + accent glow + faint grid, matching the site's cover art."""
    base = Image.new("RGB", (w, h), hexrgb(hue))
    ink = hexrgb("#05050C")
    top = Image.new("RGB", (w, h), ink)
    mask = Image.linear_gradient("L").resize((w, h)).rotate(0)
    base = Image.composite(top, base, mask.point(lambda v: int(v * 0.95)))

    glow = Image.new("L", (w, h), 0)
    gd = ImageDraw.Draw(glow)
    cx, cy, r = int(w * 0.78), int(h * 0.12), int(w * 0.55)
    gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=64)
    glow = glow.filter(ImageFilter.GaussianBlur(r // 3))
    base = Image.composite(Image.new("RGB", (w, h), hexrgb(accent)), base, glow)

    grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdd = ImageDraw.Draw(grid)
    step = 40 * S
    for x in range(0, w, step):
        gdd.line([(x, 0), (x, h)], fill=(255, 255, 255, 10), width=S)
    for y in range(0, h, step):
        gdd.line([(0, y), (w, y)], fill=(255, 255, 255, 10), width=S)
    return Image.alpha_composite(base.convert("RGBA"), grid)


def trim_chrome(img):
    """Drop the dark surround and the browser tab strip.

    The captures are a rounded browser window on a dark backdrop, and the tab
    strip shows unrelated tabs — noise in a portfolio. Crop to the window, then
    to the first predominantly white row, which is where the page itself starts.
    """
    lum = np.array(img.convert("RGB")).mean(axis=2)
    rows = np.where(lum.mean(axis=1) > 40)[0]
    cols = np.where(lum.mean(axis=0) > 40)[0]
    if not len(rows) or not len(cols):
        return img
    top, bottom = int(rows.min()), int(rows.max())
    left, right = int(cols.min()), int(cols.max())

    band = lum[top:bottom, left:right]
    for i in range(min(400, band.shape[0])):
        if (band[i] > 235).mean() > 0.9:
            top += i
            break
    return img.crop((left, top, right, bottom))


def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, *[v - 1 for v in img.size]], radius, fill=255)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


def build(src_path, out_path, hue, accent):
    w, h = W * S, H * S
    canvas = ground(w, h, hue, accent)

    shot = trim_chrome(Image.open(src_path).convert("RGB"))
    inner_w = int(1520 * S)
    inner_h = int(inner_w * shot.height / shot.width)
    shot = shot.resize((inner_w, inner_h), Image.LANCZOS)

    bez = int(15 * S)
    ow, oh = inner_w + bez * 2, inner_h + bez * 2
    x0 = (w - ow) // 2
    y0 = int(120 * S)

    # drop shadow under the whole machine
    sh = Image.new("L", (w, h), 0)
    ImageDraw.Draw(sh).rounded_rectangle(
        [x0 + int(30 * S), y0 + int(60 * S), x0 + ow - int(30 * S), y0 + oh + int(70 * S)],
        int(40 * S),
        fill=150,
    )
    sh = sh.filter(ImageFilter.GaussianBlur(int(55 * S)))
    canvas = Image.composite(Image.new("RGBA", (w, h), (0, 0, 0, 255)), canvas, sh)

    # lid
    lid = Image.new("RGBA", (ow, oh), (0, 0, 0, 0))
    ImageDraw.Draw(lid).rounded_rectangle([0, 0, ow - 1, oh - 1], int(20 * S), fill=(18, 18, 22, 255))
    canvas.alpha_composite(lid, (x0, y0))
    canvas.alpha_composite(rounded(shot, int(7 * S)), (x0 + bez, y0 + bez))

    # camera dot in the top bezel
    d = ImageDraw.Draw(canvas)
    cr = int(3 * S)
    ccx, ccy = x0 + ow // 2, y0 + bez // 2
    d.ellipse([ccx - cr, ccy - cr, ccx + cr, ccy + cr], fill=(48, 48, 54, 255))

    # base: shallow trapezoid with a rounded front lip
    by0 = y0 + oh
    bh = int(26 * S)
    spread = int(78 * S)
    d.polygon(
        [
            (x0 - int(6 * S), by0),
            (x0 + ow + int(6 * S), by0),
            (x0 + ow + spread, by0 + bh),
            (x0 - spread, by0 + bh),
        ],
        fill=(176, 180, 188, 255),
    )
    d.line([(x0 - int(6 * S), by0), (x0 + ow + int(6 * S), by0)], fill=(120, 124, 132, 255), width=S)
    # front lip
    d.rounded_rectangle(
        [x0 - spread, by0 + bh - int(4 * S), x0 + ow + spread, by0 + bh + int(9 * S)],
        int(6 * S),
        fill=(150, 154, 162, 255),
    )
    # thumb notch
    nw = int(120 * S)
    d.rounded_rectangle(
        [w // 2 - nw, by0, w // 2 + nw, by0 + int(7 * S)],
        int(4 * S),
        fill=(150, 154, 162, 255),
    )

    canvas.convert("RGB").resize((W, H), Image.LANCZOS).save(
        out_path, "JPEG", quality=88, optimize=True, progressive=True
    )
    print(f"{out_path}  {W}x{H}")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("src")
    p.add_argument("out")
    p.add_argument("--hue", default="#0f2418")
    p.add_argument("--accent", default="#3ddc84")
    a = p.parse_args()
    build(a.src, a.out, a.hue, a.accent)
