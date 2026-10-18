"""
Shaheen Interceptor - Graph Store & Topology Subgraph Engine (P1-4)
Manages transaction graph nodes and edges with 3-hop BFS retrieval.
Backed by Firestore collection 'mule_graph' with resilient in-memory fallback.
"""

import logging
from typing import Dict, List, Any, Optional, Set
from collections import deque

logger = logging.getLogger("shaheen.graph_store")


class GraphStore:
    """
    Sub-graph extraction and topology store.
    Supports Firestore synchronization and in-memory BFS expansion.
    """

    def __init__(self, firestore_db=None):
        self.firestore_db = firestore_db
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Dict[str, Any]] = []
        self._load_seed_defaults()

    def _load_seed_defaults(self):
        """Loads canonical seed topology into memory as offline baseline."""
        try:
            from seed_data import SCENARIOS
            for sc_key, sc_data in SCENARIOS.items():
                m_graph = sc_data.get("mule_graph", {})
                for n in m_graph.get("nodes", []):
                    nid = n.get("id")
                    if nid:
                        self.nodes[nid] = n
                for e in m_graph.get("edges", []):
                    self.edges.append(e)
        except Exception as e:
            logger.debug(f"Default seed topology load notice: {e}")

    def add_node(self, node_id: str, attributes: Dict[str, Any]):
        """Adds or updates a node in the graph store."""
        clean_id = str(node_id).strip().replace(" ", "").upper()
        attributes["id"] = clean_id
        self.nodes[clean_id] = attributes

        if self.firestore_db:
            try:
                self.firestore_db.collection("mule_graph_nodes").document(clean_id).set(attributes)
            except Exception as e:
                logger.warning(f"Firestore add_node error: {e}")

    def add_edge(self, source: str, target: str, amount: float, ts: Optional[str] = None, channel: str = "Raast P2P"):
        """Adds a directional transaction edge to the graph store."""
        clean_src = str(source).strip().replace(" ", "").upper()
        clean_tgt = str(target).strip().replace(" ", "").upper()
        edge = {
            "source": clean_src,
            "target": clean_tgt,
            "amount": amount,
            "ts": ts,
            "channel": channel
        }
        self.edges.append(edge)

        if self.firestore_db:
            try:
                edge_id = f"{clean_src}_{clean_tgt}_{int(amount)}"
                self.firestore_db.collection("mule_graph_edges").document(edge_id).set(edge)
            except Exception as e:
                logger.warning(f"Firestore add_edge error: {e}")

    def get_subgraph(self, root_iban: str, depth: int = 3) -> Dict[str, Any]:
        """
        Performs bidirectional BFS exploration up to `depth` hops from `root_iban`.
        Returns all reachable nodes and interconnecting edges.
        """
        clean_root = str(root_iban).strip().replace(" ", "").upper()

        visited_nodes: Set[str] = {clean_root}
        queue = deque([(clean_root, 0)])

        while queue:
            current, current_depth = queue.popleft()
            if current_depth >= depth:
                continue

            # Find all outgoing and incoming neighbors
            for edge in self.edges:
                src = edge.get("source")
                tgt = edge.get("target")

                if src == current and tgt and tgt not in visited_nodes:
                    visited_nodes.add(tgt)
                    queue.append((tgt, current_depth + 1))
                elif tgt == current and src and src not in visited_nodes:
                    visited_nodes.add(src)
                    queue.append((src, current_depth + 1))

        # Collect subgraph nodes
        subgraph_nodes = []
        for nid in visited_nodes:
            if nid in self.nodes:
                subgraph_nodes.append(self.nodes[nid])
            else:
                # Stub node if missing explicit metadata
                subgraph_nodes.append({
                    "id": nid,
                    "account_age_days": 365,
                    "kyc_tier": "Tier 1"
                })

        # Collect interconnecting edges
        subgraph_edges = [
            e for e in self.edges
            if e.get("source") in visited_nodes and e.get("target") in visited_nodes
        ]

        return {
            "nodes": subgraph_nodes,
            "edges": subgraph_edges
        }
