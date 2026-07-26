import re

with open('components/VendorSelection.tsx', 'r') as f:
    content = f.read()

# 1. Remove chatbot states
content = re.sub(r"  // Chatbot states.*?chatEndRef = useRef<HTMLDivElement \| null>\(null\);\n", "", content, flags=re.DOTALL)

# 2. Remove bot welcome message useEffect
content = re.sub(r"  // Initialize bot welcome message\n  useEffect\(\(\) => \{.*?  \}, \[userName, userProfile\]\);\n", "", content, flags=re.DOTALL)

# 3. Remove scroll to bottom of chat
content = re.sub(r"  // Scroll to bottom of chat\n  useEffect\(\(\) => \{.*?  \}, \[chatMessages, isBotTyping, isBotOpen\]\);\n", "", content, flags=re.DOTALL)

# 4. Remove handleSendChatMessage
content = re.sub(r"  const handleSendChatMessage = async \(e\?: React\.FormEvent\) => \{.*?\n  };\n\n", "", content, flags=re.DOTALL)

# 5. Remove chatbotFilteredIds filtering
content = re.sub(r"    if \(chatbotFilteredIds !== null\) \{.*?\n    \}\n", "", content, flags=re.DOTALL)
content = re.sub(r"  \}, \[vendors, searchQuery, selectedTags, selectedCities, locations, chatbotFilteredIds\]\);", "  }, [vendors, searchQuery, selectedTags, selectedCities, locations]);", content)

# 6. Remove clear filter reset of chatbotFilteredIds
content = re.sub(r"                  setChatbotFilteredIds\(null\);\n", "", content)

# 7. Remove chatbot UI code
content = re.sub(r"      \{\/\* AI Assistant Widget \*\/\}.*?\n      \{\/\* End AI Assistant Widget \*\/\}\n", "", content, flags=re.DOTALL)

with open('components/VendorSelection.tsx', 'w') as f:
    f.write(content)

