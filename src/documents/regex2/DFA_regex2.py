from automata.fa.dfa import DFA

dfa2 = DFA(
    states={
        'q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7',
        'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'T'
    },
    input_symbols={'a', 'b'},
    transitions={
        # -------------------------------------------------
        # LAYER 1: front controller for (bab)* and entry
        # -------------------------------------------------
        'q0': {'a': 'q2', 'b': 'q1'},
        'q1': {'a': 'q4', 'b': 'q3'},
        'q2': {'a': 'q5', 'b': 'q3'},

        # q4 = saw 'ba' on the b-branch
        'q4': {'a': 'T',  'b': 'q6'},

        # q5 = saw 'aa' on the a-branch
        'q5': {'a': 'T',  'b': 'q8'},

        # q6 is the ambiguous checkpoint after 'bab'
        # IMPORTANT: on 'a', we must preserve the valid b+aba route
        'q6': {'a': 'q10', 'b': 'q1'},

        # -------------------------------------------------
        # LAYER 2: complete (bab + aba)
        # -------------------------------------------------
        'q3': {'a': 'q7', 'b': 'T'},
        'q7': {'a': 'T',  'b': 'q9'},

        'q8': {'a': 'q10', 'b': 'T'},

        # -------------------------------------------------
        # LAYER 3: prefix complete, now enter suffix logic
        # Need at least one symbol before final (aa+bb)
        # -------------------------------------------------
        'q9':  {'a': 'q11', 'b': 'q11'},
        'q10': {'a': 'q11', 'b': 'q11'},

        # -------------------------------------------------
        # LAYER 4: final tail checker for ending in aa or bb
        # q14, q15 are accepting
        # -------------------------------------------------
        'q11': {'a': 'q13', 'b': 'q12'},
        'q12': {'a': 'q13', 'b': 'q14'},
        'q13': {'a': 'q15', 'b': 'q12'},
        'q14': {'a': 'q13', 'b': 'q14'},
        'q15': {'a': 'q15', 'b': 'q12'},

        # trap
        'T': {'a': 'T', 'b': 'T'},
    },
    initial_state='q0',
    final_states={'q14', 'q15'}
)

tests = [
    "babababbb",
    "babaabbaa",
    "ababaaa",
    "aabaabb",
    "bbabbbb",
    "aababbb",
    "baabaaa",
    "baba",
]

for s in tests:
    result = "Accepted" if dfa2.accepts_input(s) else "Rejected"
    print(f"{s}: {result}")