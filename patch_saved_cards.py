import sys

with open('App.tsx', 'r') as f:
    content = f.read()

# 1. Add topUpSavedCardId state
content = content.replace(
    "const [topUpCardDetails, setTopUpCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });",
    "const [topUpCardDetails, setTopUpCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });\n  const [topUpSavedCardId, setTopUpSavedCardId] = useState<string | 'new' | null>(null);"
)

# 2. Add useEffect to set default selected card when modal opens
use_effect_topup_old = """  useEffect(() => {
    if (isTopUpOpen) {
      if (selectedVendor?.acceptedPaymentMethods) {
        if (selectedVendor.acceptedPaymentMethods.card === false && topUpPaymentMethod === 'card') {
          setTopUpPaymentMethod('instapay');
        } else if (selectedVendor.acceptedPaymentMethods.instapay === false && topUpPaymentMethod === 'instapay') {
          setTopUpPaymentMethod('card');
        }
      }
    }
  }, [isTopUpOpen, currentLocation, topUpPaymentMethod]);"""

use_effect_topup_new = """  useEffect(() => {
    if (isTopUpOpen) {
      if (userProfile.paymentMethods && userProfile.paymentMethods.length > 0) {
        const defaultCard = userProfile.paymentMethods.find(c => c.isDefault) || userProfile.paymentMethods[0];
        setTopUpSavedCardId(defaultCard.id);
      } else {
        setTopUpSavedCardId('new');
      }
      
      if (selectedVendor?.acceptedPaymentMethods) {
        if (selectedVendor.acceptedPaymentMethods.card === false && topUpPaymentMethod === 'card') {
          setTopUpPaymentMethod('instapay');
        } else if (selectedVendor.acceptedPaymentMethods.instapay === false && topUpPaymentMethod === 'instapay') {
          setTopUpPaymentMethod('card');
        }
      }
    }
  }, [isTopUpOpen, currentLocation, topUpPaymentMethod, userProfile.paymentMethods]);"""

content = content.replace(use_effect_topup_old, use_effect_topup_new)


# 3. Update handleTopUp to check if using a new card
handle_top_up_old = """    // Process checkout
    if (topUpPaymentMethod === 'card') {
      if (!topUpCardDetails.number || !topUpCardDetails.expiry || !topUpCardDetails.cvc || !topUpCardDetails.name) {
        setBookingError("Please fill all card details");
        setTimeout(() => setBookingError(null), 3000);
        return;
      }
    } else {"""

handle_top_up_new = """    // Process checkout
    if (topUpPaymentMethod === 'card') {
      if (topUpSavedCardId === 'new') {
        if (!topUpCardDetails.number || !topUpCardDetails.expiry || !topUpCardDetails.cvc || !topUpCardDetails.name) {
          setBookingError("Please fill all card details");
          setTimeout(() => setBookingError(null), 3000);
          return;
        }
      }
    } else {"""

content = content.replace(handle_top_up_old, handle_top_up_new)

# 4. Modify the render to show saved cards
card_render_old = """                  {topUpPaymentMethod === 'card' ? (
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.number} onChange={e => setTopUpCardDetails({...topUpCardDetails, number: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.expiry} onChange={e => setTopUpCardDetails({...topUpCardDetails, expiry: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">CVC</label>
                          <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.cvc} onChange={e => setTopUpCardDetails({...topUpCardDetails, cvc: e.target.value})} />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-black text-slate-900" value={topUpCardDetails.name} onChange={e => setTopUpCardDetails({...topUpCardDetails, name: e.target.value})} />
                      </div>
                    </div>"""

card_render_new = """                  {topUpPaymentMethod === 'card' ? (
                    <div className="space-y-4 mb-8">
                      {userProfile.paymentMethods && userProfile.paymentMethods.length > 0 && (
                        <div className="mb-4 space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Saved Cards</label>
                          {userProfile.paymentMethods.map(card => (
                            <button
                              key={card.id}
                              onClick={() => setTopUpSavedCardId(card.id)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${topUpSavedCardId === card.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${topUpSavedCardId === card.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                  <CreditCard size={16} />
                                </div>
                                <div className="text-left">
                                  <p className={`text-sm font-black ${topUpSavedCardId === card.id ? 'text-blue-900' : 'text-slate-700'}`}>{card.type} •••• {card.last4}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.name || 'Saved Card'} {card.isDefault && '• DEFAULT'}</p>
                                </div>
                              </div>
                              {topUpSavedCardId === card.id && <CheckCircle2 size={18} className="text-blue-600" />}
                            </button>
                          ))}
                          <button
                            onClick={() => setTopUpSavedCardId('new')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${topUpSavedCardId === 'new' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${topUpSavedCardId === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                <Plus size={16} />
                              </div>
                              <div className="text-left">
                                <p className={`text-sm font-black ${topUpSavedCardId === 'new' ? 'text-blue-900' : 'text-slate-700'}`}>Use a new card</p>
                              </div>
                            </div>
                            {topUpSavedCardId === 'new' && <CheckCircle2 size={18} className="text-blue-600" />}
                          </button>
                        </div>
                      )}
                      
                      {(!userProfile.paymentMethods || userProfile.paymentMethods.length === 0 || topUpSavedCardId === 'new') && (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.number} onChange={e => setTopUpCardDetails({...topUpCardDetails, number: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Expiry</label>
                              <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.expiry} onChange={e => setTopUpCardDetails({...topUpCardDetails, expiry: e.target.value})} />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">CVC</label>
                              <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-mono text-sm" value={topUpCardDetails.cvc} onChange={e => setTopUpCardDetails({...topUpCardDetails, cvc: e.target.value})} />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Cardholder Name</label>
                            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-black text-slate-900" value={topUpCardDetails.name} onChange={e => setTopUpCardDetails({...topUpCardDetails, name: e.target.value})} />
                          </div>
                        </div>
                      )}
                    </div>"""

content = content.replace(card_render_old, card_render_new)

with open('App.tsx', 'w') as f:
    f.write(content)
