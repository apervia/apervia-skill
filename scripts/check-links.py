#!/usr/bin/env python3
"""Fails when a Markdown file of the plugin links to a file that does not
exist. The skill reads its reference files through these links."""
import pathlib
import re
import sys

root = pathlib.Path(__file__).resolve().parent.parent
link = re.compile(r"\]\(([^)#\s]+)(?:#[^)]*)?\)")
bad = []
files = list((root / "plugins").rglob("*.md")) + [root / "README.md"]
for md in files:
    for target in link.findall(md.read_text()):
        if re.match(r"^[a-z]+:", target):
            continue
        if not (md.parent / target).exists():
            bad.append(f"{md.relative_to(root)}: {target}")
if bad:
    print("check-links: these links lead nowhere:", *bad, sep="\n  ")
    sys.exit(1)
print(f"check-links: {len(files)} files, every link resolves")
