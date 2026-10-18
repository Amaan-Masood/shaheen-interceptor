"""
Shaheen Interceptor - Synthetic Pakistani IBAN Generator (P2-11)
Generates structurally valid, ISO 7064 MOD 97-10 compliant 24-character Pakistani IBANs
for synthetic benchmarks, simulation tests, and mock bank datasets.
All generated IBANs are strictly synthetic.
"""

import sys
import random
import argparse
from typing import List

BANK_CODES = [
    "HABB",  # Habib Bank Limited
    "MEZN",  # Meezan Bank Limited
    "MCBL",  # MCB Bank Limited
    "UBLP",  # United Bank Limited
    "BAHL",  # Bank AL Habib Limited
    "ALFH",  # Bank Alfalah
    "ASCM",  # Askari Bank
    "SCBL",  # Standard Chartered Pakistan
    "SONE",  # Soneri Bank
    "JSBL",  # JS Bank
]


def generate_synthetic_pak_iban(bank_code: str = None, account_id: str = None) -> str:
    """
    Constructs a 24-character ISO 7064 MOD 97-compliant Pakistani IBAN:
    - 2 country letters ('PK')
    - 2 check digits (MOD 97)
    - 4 bank code letters
    - 16 account digits
    """
    bank = (bank_code or random.choice(BANK_CODES)).upper()[:4]
    if not account_id:
        acct_digits = "".join(random.choices("0123456789", k=16))
    else:
        # Extract digits or pad
        raw_digits = "".join(c for c in account_id if c.isdigit())
        acct_digits = raw_digits.zfill(16)[:16]

    # Rearrange: BANK (4) + ACCOUNT (16) + PK (2520) + 00
    rearranged = bank + acct_digits + "PK00"
    num_str = ""
    for ch in rearranged:
        if ch.isdigit():
            num_str += ch
        elif ch.isalpha():
            num_str += str(ord(ch) - ord('A') + 10)
        else:
            raise ValueError(f"Invalid character in IBAN structure: {ch}")

    check_digits = 98 - (int(num_str) % 97)
    return f"PK{check_digits:02d}{bank}{acct_digits}"


def validate_pakistani_iban(iban: str) -> bool:
    """Validates 24-character Pakistani IBAN using MOD 97."""
    clean = iban.replace(" ", "").upper()
    if len(clean) != 24 or not clean.startswith("PK"):
        return False
    rearranged = clean[4:] + clean[:4]
    num_str = ""
    for ch in rearranged:
        if ch.isdigit():
            num_str += ch
        elif ch.isalpha():
            num_str += str(ord(ch) - ord('A') + 10)
        else:
            return False
    return int(num_str) % 97 == 1


def main():
    parser = argparse.ArgumentParser(description="Generate synthetic, valid Pakistani IBANs.")
    parser.add_argument("-n", "--count", type=int, default=5, help="Number of IBANs to generate")
    parser.add_argument("-b", "--bank", type=str, default=None, help="Bank code (e.g. MEZN, HABB)")
    args = parser.parse_args()

    print(f"--- Generating {args.count} Synthetic Pakistani IBANs ---")
    for i in range(args.count):
        iban = generate_synthetic_pak_iban(bank_code=args.bank)
        valid = validate_pakistani_iban(iban)
        print(f"[{i+1}] {iban} (Valid: {valid}, Len: {len(iban)})")


if __name__ == "__main__":
    main()
