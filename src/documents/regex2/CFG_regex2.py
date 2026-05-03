from collections import deque

# ============================================================
# CFG2: Alphabet {a, b}
# Start: q0, Accept: q14/q15 → ε, Trap: T
# ============================================================

cfg = {
    "q0":  ["aq2", "bq1"],
    "q1":  ["aq4", "bq3"],
    "q2":  ["aq5", "bq3"],
    "q3":  ["aq7", "bT"],
    "q4":  ["aT",  "bq6"],
    "q5":  ["aT",  "bq8"],
    "q6":  ["aq10","bq1"],
    "q7":  ["bq9", "aT"],
    "q8":  ["aq10","bT"],
    "q9":  ["aq11","bq11"],
    "q10": ["aq11","bq11"],
    "q11": ["aq13","bq12"],
    "q12": ["bq14","aq13"],
    "q13": ["aq15","bq12"],
    "q14": ["aq13","bq14",""],
    "q15": ["aq15","bq12",""],
    "T":   ["aT",  "bT"]
}

START = "q0"
ALLOWED = {"a", "b"}
VARS = sorted(cfg.keys(), key=lambda x: -len(x))


def get_leftmost_var(s):
    for i in range(len(s)):
        for v in VARS:
            if s[i:].startswith(v):
                return (v, i)
    return (None, -1)


def get_prefix(s):
    for i in range(len(s)):
        for v in VARS:
            if s[i:].startswith(v):
                return s[:i]
    return s


def all_terminals(s):
    for v in VARS:
        if v in s:
            return False
    return True


def count_terms(s):
    r = s
    for v in VARS:
        r = r.replace(v, "")
    return len(r)


def bfs(target, max_depth=100):
    queue = deque([(START, [START])])
    visited = {START}

    while queue:
        current, history = queue.popleft()

        if all_terminals(current):
            if current == target:
                return {"accepted": True, "sequence": history}
            continue

        if not target.startswith(get_prefix(current)):
            continue

        if count_terms(current) > len(target):
            continue

        if len(history) > max_depth:
            continue

        var, idx = get_leftmost_var(current)
        if var and var in cfg:
            for prod in cfg[var]:
                new = current[:idx] + prod + current[idx + len(var):]
                if new not in visited:
                    visited.add(new)
                    if not target.startswith(get_prefix(new)):
                        continue
                    queue.append((new, history + [new]))

    return {"accepted": False, "sequence": []}


def show(s, result):
    status = "✅ Accepted" if result["accepted"] else "❌ Rejected"
    print(f"\n  '{s}': {status}")
    if result["accepted"]:
        print(f"  Steps ({len(result['sequence'])}):")
        for i, step in enumerate(result["sequence"]):
            print(f"    {i}: {step if step else 'ε'}")


def run_tests():
    print("=" * 50)
    print("CFG2 TEST — Alphabet: {a, b}")
    print("=" * 50)

    print("\n  --- VALID ---")
    for s in ["ababaaa", "aabaabb"]:
        show(s, bfs(s))

    print("\n  --- INVALID ---")
    for s in ["baabaaa", "baba"]:
        show(s, bfs(s))


def interactive():
    print("\n" + "=" * 50)
    print("CFG2 Interactive (Ctrl+C to exit)")
    print("Alphabet: {a, b}")
    print("=" * 50)

    while True:
        try:
            raw = input("\nEnter string: ").strip().lower()
            filtered = "".join(c for c in raw if c in ALLOWED)

            if filtered != raw:
                print(f"  [Filtered: '{filtered}']")
            if not filtered:
                print("  Empty string.")
                continue

            show(filtered, bfs(filtered))

        except KeyboardInterrupt:
            print("\nExiting.")
            break


if __name__ == "__main__":
    run_tests()
    interactive()