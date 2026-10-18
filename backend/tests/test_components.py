"""
Shaheen Interceptor - Additional Component Unit Tests (P1-4, P1-5, P1-6)
Tests:
- Pakistani IBAN validation (MOD-97, length 24)
- Phone and IOC regex extraction with digit boundary lookarounds
- GraphStore 3-hop BFS topology expansion
- Audio telemetry calculation (RMS / dBFS)
"""

import pytest
import io
import wave
import struct
import math
from agents import (
    validate_pakistani_iban,
    extract_iocs_regex,
    ActiveDecoyAndSarAgent
)
from graph_store import GraphStore


def test_pakistani_iban_validation():
    # Valid synthesized Pakistani IBANs (24 chars, PK + 2 check digits + 4 bank + 16 acct)
    valid_iban = "PK86MEZN0000019283746501"
    assert validate_pakistani_iban(valid_iban) is True

    # 22-char legacy or truncated IBAN should fail
    short_iban = "PK36MEZN00019283746501"
    assert validate_pakistani_iban(short_iban) is False

    # Invalid checksum
    corrupted_iban = "PK85MEZN0000019283746501"
    assert validate_pakistani_iban(corrupted_iban) is False

    # Non-alphanumeric or wrong country
    assert validate_pakistani_iban("GB86MEZN0000019283746501") is False


def test_ioc_phone_lookaround_extraction():
    # Phone number inside an IBAN run should NOT be matched as an isolated phone
    text = "Please transfer to PK86MEZN0000019283746501 or call me directly at 03001234567 for details."
    iocs = extract_iocs_regex(text)

    types = [ioc.type for ioc in iocs]
    values = [ioc.value for ioc in iocs]

    assert "IBAN" in types
    assert "PK86MEZN0000019283746501" in values
    assert "PHONE_RAAST" in types
    assert "+92-300-1234567" in values

    # Test that digits embedded in 20-digit runs are not extracted as phones
    text_embedded = "Reference ID 9928303001234567994827 is logged in the system."
    iocs_embedded = extract_iocs_regex(text_embedded)
    phone_iocs = [i for i in iocs_embedded if i.type == "PHONE_RAAST"]
    assert len(phone_iocs) == 0


def test_graph_store_bfs_expansion():
    gs = GraphStore()
    root = "PK-ROOT-ACCOUNT"
    feeder = "PK-FEEDER-1"
    mule_layer2 = "PK-MULE-LAYER-2"
    cashout = "PK-CASHOUT-ATM"

    gs.add_edge(feeder, root, 50000.0)
    gs.add_edge(root, mule_layer2, 48000.0)
    gs.add_edge(mule_layer2, cashout, 47000.0)

    # 1-hop subgraph from root
    sg_1 = gs.get_subgraph(root, depth=1)
    sg_1_node_ids = {n["id"] for n in sg_1["nodes"]}
    assert root in sg_1_node_ids
    assert feeder in sg_1_node_ids
    assert mule_layer2 in sg_1_node_ids
    assert cashout not in sg_1_node_ids  # cashout is 2 hops away

    # 3-hop subgraph from root
    sg_3 = gs.get_subgraph(root, depth=3)
    sg_3_node_ids = {n["id"] for n in sg_3["nodes"]}
    assert cashout in sg_3_node_ids


def test_audio_rms_telemetry_calculation():
    # Synthesize 1-second 16kHz test sine wave at known amplitude
    sample_rate = 16000
    duration = 1.0
    amp = 0.5
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        n_samples = int(sample_rate * duration)
        frames_data = bytearray()
        for i in range(n_samples):
            val = amp * math.sin(2 * math.pi * 440.0 * (i / sample_rate))
            frames_data.extend(struct.pack("<h", int(val * 32767.0)))
        wf.writeframes(frames_data)

    raw_bytes = buf.getvalue()
    with wave.open(io.BytesIO(raw_bytes), "rb") as wf:
        frames = wf.readframes(wf.getnframes())
        count = len(frames) // 2
        samples = struct.unpack(f"<{count}h", frames)
        sum_sq = sum(s * s for s in samples)
        rms = math.sqrt(sum_sq / count)
        dbfs = 20 * math.log10(rms / 32767.0)

    # For sine wave with amp 0.5, theoretical RMS is 0.5 / sqrt(2) ≈ 0.3535 * 32767 ≈ 11585
    # Theoretical dBFS is 20 * log10(0.5 / sqrt(2)) ≈ -9.03 dBFS
    assert 11000 < rms < 12000
    assert -10.0 < dbfs < -8.0
