# ============================================================
# PDA2: Mirrors DFA2
# Regex: (bab)* (b+a) (bab+aba) (a+b)* (aa+bb)* (b+a+bb)
#        (a+b)* (aa+bb)
# Alphabet: {a, b}
# Accept states: q14, q15
# ============================================================

pda_transitions = {
    # Layer 1: (bab)* prefix
    ("q0", "a", "Z0"): ("q2",  "Z0"),
    ("q0", "b", "Z0"): ("q1",  "Z0"),

    ("q1", "a", "Z0"): ("q4",  "Z0"),
    ("q1", "b", "Z0"): ("q3",  "Z0"),

    ("q4", "a", "Z0"): ("T",   "Z0"), 
    ("q4", "b", "Z0"): ("q6",  "Z0"),

    ("q6", "a", "Z0"): ("q10", "Z0"), 
    ("q6", "b", "Z0"): ("q1",  "Z0"),

    # Layer 2: (b+a) bridge
    ("q2", "a", "Z0"): ("q5",  "Z0"),
    ("q2", "b", "Z0"): ("q3",  "Z0"),

    # Layer 3: (bab+aba) pattern
    ("q3", "a", "Z0"): ("q7",  "Z0"),
    ("q3", "b", "Z0"): ("T",   "Z0"),

    ("q5", "a", "Z0"): ("T",   "Z0"),
    ("q5", "b", "Z0"): ("q8",  "Z0"),

    ("q7", "a", "Z0"): ("T",   "Z0"),
    ("q7", "b", "Z0"): ("q9",  "Z0"),

    ("q8", "a", "Z0"): ("q10", "Z0"),
    ("q8", "b", "Z0"): ("T",   "Z0"),

    # Layer 3 completion → Layer 4
    ("q9",  "a", "Z0"): ("q11", "Z0"),
    ("q9",  "b", "Z0"): ("q11", "Z0"),
    ("q10", "a", "Z0"): ("q11", "Z0"),
    ("q10", "b", "Z0"): ("q11", "Z0"),

    # Layer 4: Tail checker (must end in aa or bb)
    ("q11", "a", "Z0"): ("q13", "Z0"),
    ("q11", "b", "Z0"): ("q12", "Z0"),

    ("q12", "a", "Z0"): ("q13", "Z0"),
    ("q12", "b", "Z0"): ("q14", "Z0"),  # bb → Accept

    ("q13", "a", "Z0"): ("q15", "Z0"),  # aa → Accept
    ("q13", "b", "Z0"): ("q12", "Z0"),

    ("q14", "a", "Z0"): ("q13", "Z0"),
    ("q14", "b", "Z0"): ("q14", "Z0"),  # still bb

    ("q15", "a", "Z0"): ("q15", "Z0"),  # still aa
    ("q15", "b", "Z0"): ("q12", "Z0"),

    # Trap state
    ("T", "a", "Z0"): ("T", "Z0"),
    ("T", "b", "Z0"): ("T", "Z0"),
}

START_STATE   = "q0"
ACCEPT_STATES = {"q14", "q15"}
ALLOWED       = {"a", "b"}


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

    accepted = state in ACCEPT_STATES
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
    print("PDA2 TEST — Alphabet: {a, b}")
    print("=" * 55)

    valid_strings = [
        "ababaaa",      # a(L2) + bab(L3) + aa(tail)
        "aabaabb",      # a(L2) + aba(L3) + bb(tail)
    ]

    invalid_strings = [
        "baabaaa",      # baa triggers trap at q4
        "baba",         # too short, missing pattern
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
    print("PDA2 Interactive (Ctrl+C to exit)")
    print("Alphabet: {a, b}")
    print("=" * 55)

    while True:
        try:
            raw = input("\nEnter string: ").strip().lower()
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