import os

file_path = "components/PaymentAnalytics.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_stats_calc = """  const paymentStats = useMemo(() => {
    let cash = 0;
    let card = 0;
    let instapay = 0;
    let novapoints = 0;

    targetReservations.forEach(res => {
      // Determine base room price
      let resPrice = 0;
      if (res.totalPrice !== undefined) {
        resPrice = res.totalPrice;
      } else {
        // We'll need to calculate from location if needed, but normally totalPrice is populated on creation
        const loc = locations.find(l => l.id === res.locationId);
        const floor = loc?.floors.find(f => f.id === res.floorId);
        const room = floor?.rooms.find(r => r.id === res.roomId);
        if (room) {
          resPrice += room.pricePerHour * res.duration;
        }
      }

      // Add menu price if any
      if (res.selectedMenuItems && res.selectedMenuItems.length > 0) {
        // Normally, the totalPrice overrides room cost + menu cost
        // BUT some older reservations might not have it.
        // Assume totalPrice has EVERYTHING if defined.
      }

      const method = res.paymentMethod?.toLowerCase() || 'unknown';
      if (method === 'cash') cash += resPrice;
      else if (method === 'card' || method === 'pos') card += resPrice;
      else if (method === 'instapay') instapay += resPrice;
      else if (method === 'novapoints' || method === 'credits') novapoints += resPrice;
    });

    return {
      cash,
      card,
      instapay,
      novapoints,
      total: cash + card + instapay + novapoints
    };
  }, [targetReservations, locations]);"""

new_stats_calc = """  const paymentStats = useMemo(() => {
    let cash = 0;
    let cardApp = 0;
    let cardInstore = 0;
    let instapay = 0;
    let novapoints = 0;

    targetReservations.forEach(res => {
      let resPrice = 0;
      if (res.totalPrice !== undefined) {
        resPrice = res.totalPrice;
      } else {
        const loc = locations.find(l => l.id === res.locationId);
        const floor = loc?.floors.find(f => f.id === res.floorId);
        const room = floor?.rooms.find(r => r.id === res.roomId);
        if (room) {
          resPrice += room.pricePerHour * res.duration;
        }
      }

      const method = res.paymentMethod?.toLowerCase() || 'unknown';
      if (method === 'cash') cash += resPrice;
      else if (method === 'card' || method === 'pos') {
        if (res.origin === 'instore') cardInstore += resPrice;
        else cardApp += resPrice;
      }
      else if (method === 'instapay') instapay += resPrice;
      else if (method === 'novapoints' || method === 'credits') novapoints += resPrice;
    });

    return {
      cash,
      cardApp,
      cardInstore,
      instapay,
      novapoints,
      total: cash + cardApp + cardInstore + instapay + novapoints
    };
  }, [targetReservations, locations]);"""

content = content.replace(old_stats_calc, new_stats_calc)

old_pdf_calc = """    let cash = 0;
    let card = 0;
    let instapay = 0;
    let novapoints = 0;

    exportRes.forEach(res => {
      let resPrice = res.totalPrice;
      if (!resPrice) {
        const loc = locations.find(l => l.id === res.locationId);
        const room = loc?.floors.find(f => f.id === res.floorId)?.rooms.find(r => r.id === res.roomId);
        if (room) resPrice = room.pricePerHour * res.duration;
      }
      const method = res.paymentMethod?.toLowerCase() || '';
      if (method === 'cash') cash += resPrice;
      else if (method === 'card' || method === 'pos') card += resPrice;
      else if (method === 'instapay') instapay += resPrice;
      else if (method === 'novapoints' || method === 'credits') novapoints += resPrice;
    });

    const total = cash + card + instapay + novapoints;"""

new_pdf_calc = """    let cash = 0;
    let cardApp = 0;
    let cardInstore = 0;
    let instapay = 0;
    let novapoints = 0;

    exportRes.forEach(res => {
      let resPrice = res.totalPrice;
      if (!resPrice) {
        const loc = locations.find(l => l.id === res.locationId);
        const room = loc?.floors.find(f => f.id === res.floorId)?.rooms.find(r => r.id === res.roomId);
        if (room) resPrice = room.pricePerHour * res.duration;
      }
      const method = res.paymentMethod?.toLowerCase() || '';
      if (method === 'cash') cash += resPrice;
      else if (method === 'card' || method === 'pos') {
        if (res.origin === 'instore') cardInstore += resPrice;
        else cardApp += resPrice;
      }
      else if (method === 'instapay') instapay += resPrice;
      else if (method === 'novapoints' || method === 'credits') novapoints += resPrice;
    });

    const total = cash + cardApp + cardInstore + instapay + novapoints;"""

content = content.replace(old_pdf_calc, new_pdf_calc)

old_pdf_print = """    doc.text(`Card / POS: ${card.toLocaleString()} EGP`, 14, y); y += 8;"""
new_pdf_print = """    doc.text(`Card / POS (App): ${cardApp.toLocaleString()} EGP`, 14, y); y += 8;
    doc.text(`Card / POS (In-store): ${cardInstore.toLocaleString()} EGP`, 14, y); y += 8;"""

content = content.replace(old_pdf_print, new_pdf_print)

old_cards = """            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Card / POS</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.card.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>"""

new_cards = """            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Card / POS (App)</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.cardApp.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-full">Card / POS (In-store)</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{paymentStats.cardInstore.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">EGP Income</p>
            </div>"""

content = content.replace(old_cards, new_cards)

with open(file_path, "w") as f:
    f.write(content)

print("PaymentAnalytics patched.")
