import sys

with open('App.tsx', 'r') as f:
    content = f.read()

state_str = "  const [topUpPaymentMethod, setTopUpPaymentMethod] = useState<'card' | 'instapay'>('card');"
new_state_str = state_str + """

  useEffect(() => {
    if (isTopUpOpen) {
      if (currentLocation?.acceptedPaymentMethods) {
        if (currentLocation.acceptedPaymentMethods.card === false && topUpPaymentMethod === 'card') {
          setTopUpPaymentMethod('instapay');
        } else if (currentLocation.acceptedPaymentMethods.instapay === false && topUpPaymentMethod === 'instapay') {
          setTopUpPaymentMethod('card');
        }
      }
    }
  }, [isTopUpOpen, currentLocation, topUpPaymentMethod]);
"""
content = content.replace(state_str, new_state_str)

with open('App.tsx', 'w') as f:
    f.write(content)

print("Top up effect added")
