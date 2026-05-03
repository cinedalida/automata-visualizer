from automata.fa.dfa import DFA

dfa = DFA(
    states={
        'q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'
    },
    input_symbols={'0', '1'},
    transitions={
        # -------------------------------------------------
        # LAYER 1: find the first 00 or 11
        # -------------------------------------------------
        'q0': {'0': 'q2', '1': 'q1'},
        'q1': {'0': 'q2', '1': 'q3'},
        'q2': {'0': 'q3', '1': 'q1'},

        # -------------------------------------------------
        # LAYER 2: mandatory bridge (1+0+11)
        # q3 = double found, consume one bridge symbol
        # -------------------------------------------------
        'q3': {'0': 'q4', '1': 'q4'},

        # -------------------------------------------------
        # LAYER 3: seek start of 101 or 111
        # FIX: q4 on '0' loops to itself, NOT back to q3
        # -------------------------------------------------
        'q4': {'0': 'q4', '1': 'q5'},

        # -------------------------------------------------
        # LAYER 4: detect mandatory pattern 101 or 111
        # q5 = saw '1' (pattern start)
        # q6 = saw '10' (tracking 101)
        # q7 = saw '110' (recovery, still trackable via 1101)
        # q8 = saw '11' (tracking 111)
        # -------------------------------------------------
        'q5': {'0': 'q6', '1': 'q8'},
        'q6': {'0': 'q4', '1': 'q9'},
        'q7': {'0': 'q4', '1': 'q9'},
        'q8': {'0': 'q7', '1': 'q9'},

        # -------------------------------------------------
        # LAYER 5: accept state, absorb remaining tail
        # q9 is accepting
        # -------------------------------------------------
        'q9': {'0': 'q9', '1': 'q9'},
    },
    initial_state='q0',
    final_states={'q9'}
)

tests = [
    "0011010",
    "1111010",
    "00111110",
    "11111",
    "00111",
    "010101010101",
    "1100000000",
    "111111",
    "00000000110000000011111111111111111110111100000000111111"
]

for s in tests:
    result = "Accepted" if dfa.accepts_input(s) else "Rejected"
    print(f"{s}: {result}")