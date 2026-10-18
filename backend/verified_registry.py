"""
Shaheen Interceptor - Server-Side Verified Institutional Registry
Simulates bank-core KYC / verified institutional payees (e.g. SBP/Raast approved institutional billers).
Security Rule (P0-6): Client-supplied receiver name strings or 'role' fields are NEVER trusted.
Only IBANs present in this verified registry qualify for institutional baseline exemptions.
"""

from typing import Dict, Any, Optional

# Verified institutional billers (Hospitals, Universities, Government Utilities, Port Authorities)
# Structure: Keyed by canonical 24-character (or recognized) IBAN
VERIFIED_INSTITUTIONS: Dict[str, Dict[str, Any]] = {
    # NUST University Official Tuition Collection
    "PK35HABB00021948291005": {
        "name": "National University of Sciences and Technology (NUST)",
        "category": "EDUCATION",
        "kyc_tier": "Tier 3 Corporate Institutional",
        "verified_biller_id": "BIL-EDU-NUST-01",
        "status": "ACTIVE_VERIFIED"
    },
    # Shifa International Hospital Emergency Admissions & Patient Billing
    "PK20AKBL00039281726359": {
        "name": "Shifa International Hospital Emergency Admissions",
        "category": "HEALTHCARE",
        "kyc_tier": "Tier 3 Corporate Institutional",
        "verified_biller_id": "BIL-HLT-SHIFA-01",
        "status": "ACTIVE_VERIFIED"
    },
    # Karachi International Container Terminal (KICT) - Port & Customs
    "PK12SCBL00049281726350": {
        "name": "Karachi International Container Terminal (KICT)",
        "category": "PORT_LOGISTICS",
        "kyc_tier": "Tier 3 Corporate Institutional",
        "verified_biller_id": "BIL-PRT-KICT-01",
        "status": "ACTIVE_VERIFIED"
    },
    # Aga Khan University Hospital Official Patient Billing
    "PK44HABB00010928374651": {
        "name": "Aga Khan University Hospital Patient Services",
        "category": "HEALTHCARE",
        "kyc_tier": "Tier 3 Corporate Institutional",
        "verified_biller_id": "BIL-HLT-AKUH-01",
        "status": "ACTIVE_VERIFIED"
    },
    # Shaukat Khanum Memorial Cancer Hospital & Research Centre
    "PK88MEZN00099887766554": {
        "name": "Shaukat Khanum Memorial Cancer Hospital Collection",
        "category": "HEALTHCARE",
        "kyc_tier": "Tier 3 Corporate Institutional",
        "verified_biller_id": "BIL-HLT-SKMCH-01",
        "status": "ACTIVE_VERIFIED"
    },
    # Lahore University of Management Sciences (LUMS) Fee Collection
    "PK19MCB000088776655443": {
        "name": "Lahore University of Management Sciences (LUMS)",
        "category": "EDUCATION",
        "kyc_tier": "Tier 3 Corporate Institutional",
        "verified_biller_id": "BIL-EDU-LUMS-01",
        "status": "ACTIVE_VERIFIED"
    }
}


def lookup_verified_institution(iban: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Looks up a receiver IBAN in the server-side verified registry.
    Returns institution metadata if registered, else None.
    """
    if not iban:
        return None
    clean_iban = str(iban).strip().replace(" ", "").upper()
    return VERIFIED_INSTITUTIONS.get(clean_iban)


def is_verified_institution(iban: Optional[str]) -> bool:
    """Returns True ONLY if receiver IBAN is present in server-side registry."""
    return lookup_verified_institution(iban) is not None
