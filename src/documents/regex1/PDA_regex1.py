# ============================================================
# PDA1: Mirrors corrected DFA1
# Regex: (1+0)* (11+00) (00+11)* (1+0+11) (1+0+11)* (101+111)
#        (101+111)* (1+0*+11) (1+0*+11)*
# Alphabet: {0, 1}
# Accept state: Q9
# ============================================================

pda_transitions = {
    # Layer 1: Find 00 or 11
    ("Q0", "0", "Z0"): ("Q2", "Z0"),
    ("Q0", "1", "Z0"): ("Q1", "Z0"),

    ("Q1", "0", "Z0"): ("Q2", "Z0"),
    ("Q1", "1", "Z0"): ("Q3", "Z0"),

    ("Q2", "0", "Z0"): ("Q3", "Z0"),
    ("Q2", "1", "Z0"): ("Q1", "Z0"),

    # Layer 2: Mandatory bridge
    ("Q3", "0", "Z0"): ("Q4", "Z0"),
    ("Q3", "1", "Z0"): ("Q4", "Z0"),

    # Layer 3: Seek start of 101 or 111
    ("Q4", "0", "Z0"): ("Q4", "Z0"),
    ("Q4", "1", "Z0"): ("Q5", "Z0"),

    # Layer 4: Detect 101 or 111
    ("Q5", "0", "Z0"): ("Q6", "Z0"),
    ("Q5", "1", "Z0"): ("Q8", "Z0"),

    ("Q6", "0", "Z0"): ("Q4", "Z0"),
    ("Q6", "1", "Z0"): ("Q9", "Z0"),   # 101 complete

    ("Q7", "0", "Z0"): ("Q4", "Z0"),
    ("Q7", "1", "Z0"): ("Q9", "Z0"),   # 1101 complete

    ("Q8", "0", "Z0"): ("Q7", "Z0"),
    ("Q8", "1", "Z0"): ("Q9", "Z0"),   # 111 complete

    # Accept state: absorb remaining input
    ("Q9", "0", "Z0"): ("Q9", "Z0"),
    ("Q9", "1", "Z0"): ("Q9", "Z0"),
}

START_STATE  = "Q0"
ACCEPT_STATE = {"Q9"}
ALLOWED      = {"0", "1"}


# ============================================================
# SIMULATOR
# ============================================================
def run_pda(input_string):
    """
    Simulate the PDA step by step.
    Returns (accepted, final_state, trace).
    """
    state = START_STATE
    stack = ["Z0"]
    trace = [f"  START  : state={state}  stack={stack}"]

    for i, symbol in enumerate(input_string):
        top = stack[-1]
        key = (state, symbol, top)

        if key not in pda_transitions:
            trace.append(
                f"  STEP {i+1:02d}: '{symbol}'  "
                f"NO TRANSITION from {state}  → REJECT"
            )
            return False, state, trace

        new_state, new_top = pda_transitions[key]
        stack[-1] = new_top

        trace.append(
            f"  STEP {i+1:02d}: '{symbol}'  "
            f"{state} → {new_state}  "
            f"stack={stack}"
        )
        state = new_state

    accepted = state in ACCEPT_STATE
    trace.append(
        f"  END    : state={state}  "
        f"{'✅ ACCEPTED' if accepted else '❌ REJECTED'}"
    )
    return accepted, state, trace


def show(s, accepted, final_state, trace):
    """Print result and trace cleanly."""
    status = "✅ Accepted" if accepted else "❌ Rejected"
    print(f"\n  '{s}': {status}  (ended in {final_state})")
    for line in trace:
        print(line)


# ============================================================
# TESTS
# ============================================================
def run_tests():
    print("=" * 55)
    print("PDA1 TEST — Alphabet: {0, 1}")
    print("=" * 55)

    valid_strings = [
        "111111",       # 11(double) + 1(bridge) + 111(pattern)
        "0011010",      # 00(double) + 1(bridge) + 101(pattern) + 0(tail)
    ]

    invalid_strings = [
        "11111",        # too short, pattern incomplete
        "00111",        # too short, pattern incomplete
    ]

    print("\n  --- VALID ---")
    for s in valid_strings:
        accepted, final_state, trace = run_pda(s)
        show(s, accepted, final_state, trace)

    print("\n  --- INVALID ---")
    for s in invalid_strings:
        accepted, final_state, trace = run_pda(s)
        show(s, accepted, final_state, trace)


# ============================================================
# INTERACTIVE
# ============================================================
def interactive():
    print("\n" + "=" * 55)
    print("PDA1 Interactive (Ctrl+C to exit)")
    print("Alphabet: {0, 1}")
    print("=" * 55)

    while True:
        try:
            raw = input("\nEnter string: ").strip()
            filtered = "".join(c for c in raw if c in ALLOWED)

            if filtered != raw:
                print(f"  [Filtered to valid symbols: '{filtered}']")
            if not filtered:
                print("  Empty string.")
                continue

            accepted, final_state, trace = run_pda(filtered)
            show(filtered, accepted, final_state, trace)

        except KeyboardInterrupt:
            print("\nExiting.")
            break


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    run_tests()
    interactive()