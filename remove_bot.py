import re

def remove_bot(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Remove imports
    content = re.sub(r"import { getNovaBotResponse } from '\.\./services/geminiService';\n", "", content)
    
    # We will just remove the whole chat interface block later by parsing properly or just replacing pieces.
    return content

