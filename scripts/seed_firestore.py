"""
Shaheen Interceptor - Firestore Seeder (P0-6, P1-4)
Seeds verified institutions registry and mule graph topology into Cloud Firestore.
Can be executed safely anytime; updates documents idempotently.
"""

import os
import sys
import logging
from typing import Dict, Any

# Ensure backend directory is in sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from verified_registry import VERIFIED_INSTITUTIONS
from seed_data import SCENARIOS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("shaheen.seed_firestore")

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    logger.warning("firebase_admin not installed. Install with `pip install firebase-admin`")


def get_firestore_client():
    if not FIREBASE_AVAILABLE:
        return None
    try:
        if not firebase_admin._apps:
            # Check for service account key or ADC
            sa_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if sa_path and os.path.exists(sa_path):
                cred = credentials.Certificate(sa_path)
                firebase_admin.initialize_app(cred)
            else:
                firebase_admin.initialize_app()
        return firestore.client()
    except Exception as e:
        logger.warning(f"Could not initialize Firestore client: {e}")
        return None


def seed_verified_institutions(db):
    """Seeds verified institutions into collection 'verified_institutions'."""
    logger.info(f"Seeding {len(VERIFIED_INSTITUTIONS)} verified institutions...")
    coll = db.collection("verified_institutions")
    for iban, inst in VERIFIED_INSTITUTIONS.items():
        doc_ref = coll.document(iban)
        doc_ref.set(inst)
        logger.info(f"  [+] Seeded institution: {inst['name']} ({iban})")


def seed_mule_graphs(db):
    """Seeds graph nodes and edges from scenarios into 'mule_graph_nodes' and 'mule_graph_edges'."""
    nodes_coll = db.collection("mule_graph_nodes")
    edges_coll = db.collection("mule_graph_edges")

    total_nodes = 0
    total_edges = 0

    for sc_key, sc_data in SCENARIOS.items():
        m_graph = sc_data.get("mule_graph", {})
        for node in m_graph.get("nodes", []):
            nid = node.get("id")
            if nid:
                nodes_coll.document(nid).set(node)
                total_nodes += 1

        for idx, edge in enumerate(m_graph.get("edges", [])):
            src = edge.get("source", "UNKNOWN")
            tgt = edge.get("target", "UNKNOWN")
            amt = int(edge.get("amount", 0))
            edge_id = f"{src}_{tgt}_{amt}_{idx}"
            edges_coll.document(edge_id).set(edge)
            total_edges += 1

    logger.info(f"Seeded {total_nodes} graph nodes and {total_edges} transaction edges.")


def main():
    logger.info("--- Starting Shaheen Interceptor Firestore Seeder ---")
    db = get_firestore_client()
    if not db:
        logger.warning("Firestore client unavailable. Seeder running in dry-run mode (offline verification).")
        logger.info(f"Verified institutions count: {len(VERIFIED_INSTITUTIONS)}")
        logger.info(f"Scenarios available: {list(SCENARIOS.keys())}")
        print("Dry run completed successfully. (Set GOOGLE_APPLICATION_CREDENTIALS for cloud deployment).")
        return

    seed_verified_institutions(db)
    seed_mule_graphs(db)
    logger.info("[SUCCESS] Firestore seeding finished cleanly.")


if __name__ == "__main__":
    main()
