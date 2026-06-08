"""One-time script to generate book cover images using Gemini Nano Banana.
Outputs are saved to /app/frontend/public/images/books/.
"""
import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")

OUTPUT_DIR = Path("/app/frontend/public/images/books")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = os.getenv("EMERGENT_LLM_KEY")
MODEL = "gemini-3.1-flash-image-preview"

BOOKS = [
    {
        "slug": "max-the-boy-who-counts",
        "prompt": (
            "A warm, literary middle-grade children's book cover illustration titled "
            "'Max, the Boy Who Counts'. A thoughtful 10-year-old boy sitting cross-legged "
            "on a wooden floor counting acorns or buttons, soft natural window light, "
            "watercolor and pencil-sketch hybrid style, warm cream background, dusty rose "
            "and sage green accents, gentle and quiet mood, not cartoonish. Book cover layout "
            "with title 'Max, the Boy Who Counts' in elegant warm serif typography (Playfair "
            "Display style) at the top, author name 'Christina Carlsen' in smaller serif at "
            "the bottom. Subtle texture, like a hand-printed book. No glossy effects, no "
            "cartoon style. Vertical book cover proportions 2:3."
        ),
    },
    {
        "slug": "playing-by-ear",
        "prompt": (
            "A warm, literary middle-grade children's book cover illustration titled "
            "'Playing by Ear'. A young girl with headphones listening intently, sitting "
            "beside an old upright piano in a sunlit room, soft natural afternoon light, "
            "watercolor and pencil sketch style, warm cream background, dusty rose and "
            "warm amber accents, sage green elements, quietly joyful mood, dignified portrayal. "
            "Book cover layout with title 'Playing by Ear' in elegant warm serif typography "
            "(Playfair Display style) at the top, author name 'Christina Carlsen' in smaller "
            "serif at the bottom. Hand-printed feel, no glossy effects. Vertical book cover "
            "proportions 2:3."
        ),
    },
    {
        "slug": "read-the-room",
        "prompt": (
            "Warm literary book cover, watercolor illustration: a young person sitting quietly "
            "by a sunlit window with a book on their lap, soft afternoon light, warm cream "
            "background, dusty rose and sage green colors, hand-painted style. Title text "
            "'Read the Room' in elegant serif at the top, smaller serif author name "
            "'Christina Carlsen' at the bottom. Vertical 2:3 book cover format."
        ),
    },
    {
        "slug": "childrens-coming-soon",
        "prompt": (
            "A warm, literary children's picture book cover illustration, ages 3-8, "
            "untitled placeholder cover. A small child looking up at a tree filled with "
            "lanterns at dusk, gentle imagination and everyday-magic feeling, soft "
            "natural twilight light, watercolor with pencil sketch outlines, warm cream "
            "background, dusty rose, sage green, and warm amber accents. Hand-painted, "
            "not cartoonish. Vertical book cover proportions 2:3, no text on the cover."
        ),
    },
]

GENERIC_BG_PROMPTS = [
    {
        "slug": "watercolor-leaf-divider",
        "prompt": (
            "A single delicate watercolor and pencil-sketch botanical illustration: a "
            "small sage green leaf branch with a tiny dusty rose flower, on a warm cream "
            "(#FAF7F2) background. Minimal, gentle, hand-painted. Horizontal composition, "
            "lots of empty cream space around the illustration. No text."
        ),
    },
    {
        "slug": "watercolor-book-stack",
        "prompt": (
            "A delicate watercolor illustration of a small stack of three antique-looking "
            "hardcover books on a warm wooden surface, soft natural window light, warm "
            "cream background, dusty rose and sage green tones, pencil sketch outlines, "
            "gentle and quiet. No text. Horizontal composition."
        ),
    },
]


async def generate_one(slug: str, prompt: str) -> None:
    out_path = OUTPUT_DIR / f"{slug}.png"
    if out_path.exists():
        print(f"[skip] {slug} already exists")
        return
    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"cc-cover-{slug}",
        system_message="You generate warm, literary children's book cover illustrations.",
    )
    chat.with_model("gemini", MODEL).with_params(modalities=["image", "text"])

    print(f"[gen ] {slug} ...")
    _text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if not images:
        print(f"[fail] {slug}: no image returned")
        return
    image_bytes = base64.b64decode(images[0]["data"])
    out_path.write_bytes(image_bytes)
    print(f"[done] {slug} -> {out_path} ({len(image_bytes)} bytes)")


async def main() -> None:
    for book in BOOKS + GENERIC_BG_PROMPTS:
        try:
            await generate_one(book["slug"], book["prompt"])
        except Exception as exc:  # noqa: BLE001
            print(f"[err ] {book['slug']}: {exc}")


if __name__ == "__main__":
    asyncio.run(main())
