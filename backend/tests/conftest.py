"""Pytest path setup.

`backend/tests/*.py` imports sibling modules as bare names
(`from pipeline import evaluate_transaction`, `from agents import ...`).
Without this file, pytest resolves those imports relative to
`backend/tests/` and fails with `ModuleNotFoundError`. Adding the
backend root to `sys.path` mirrors how the app itself is launched
(`uvicorn main:app` from the `backend/` directory) so no test source
has to change.
"""

import os
import sys

BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)
