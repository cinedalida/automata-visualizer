from collections import deque
import re

# ============================================================
# CFG1: Alphabet {0, 1}
# Start: Q0, Accept: Q9 → ε
# ============================================================

cfg = {
    "Q0": ["0Q2", "1Q1"],
    "Q1": ["0Q2", "1Q3"],
    "Q2": ["0Q3", "1Q1"],
    "Q3": ["0Q4", "1Q4"],
    "Q4": ["0Q4", "1Q5"],
    "Q5": ["0Q6", "1Q8"],
    "Q6": ["0Q4", "1Q9"],
    "Q7": ["0Q4", "1Q9"],
    "Q8": ["0Q7", "1Q9"],
    "Q9": ["0Q9", "1Q9", ""]
}

START = "Q0"
ALLOWED = {"0", "1"}
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
    print("CFG1 TEST — Alphabet: {0, 1}")
    print("=" * 50)

    print("\n  --- VALID ---")
    for s in ["111111", "0011010"]:
        show(s, bfs(s))

    print("\n  --- INVALID ---")
    for s in ["11111", "00111"]:
        show(s, bfs(s))


def interactive():
    print("\n" + "=" * 50)
    print("CFG1 Interactive (Ctrl+C to exit)")
    print("Alphabet: {0, 1}")
    print("=" * 50)

    while True:
        try:
            raw = input("\nEnter string: ").strip()
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