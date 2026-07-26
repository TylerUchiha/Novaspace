import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace handleCancelReservation to just change status to cancelled
old_cancel = """  const handleCancelReservation = (id: string) => {
    const reservation = allReservations.find(r => r.id === id);
    if (!reservation) return;

    // Refund logic
    if (reservation.paymentMethod === 'credits' && reservation.totalPrice) {
      const userToRefund = allUsers.find(u => u.email === reservation.userEmail);
      if (userToRefund) {
        const updatedUser = { ...userToRefund, credits: userToRefund.credits + reservation.totalPrice };
        setAllUsers(prev => prev.map(u => u.email === userToRefund.email ? updatedUser : u));
        if (userToRefund.email === userProfile.email) {
          setUserProfile(updatedUser);
        }
        
        // Add refund transaction if it's the current user
        if (userToRefund.email === userProfile.email) {
          const roomName = allLocations.flatMap(l => l.floors).flatMap(f => f.rooms).find(r => r.id === reservation.roomId)?.name || 'Unknown Space';
          setTransactions(prev => [{
            id: `tx-refund-${Date.now()}`,
            type: 'credit',
            amount: reservation.totalPrice!,
            description: `Refund: ${roomName}`,
            date: new Date().toISOString(),
            isReservation: true,
            roomName: roomName,
            locationName: allLocations.find(l => l.id === reservation.locationId)?.name,
            floorName: allLocations.flatMap(l => l.floors).find(f => f.id === reservation.floorId)?.name,
            duration: reservation.duration,
            paymentMethod: reservation.paymentMethod,
            hasInstorePurchases: reservation.selectedMenuItems && reservation.selectedMenuItems.length > 0
          }, ...prev]);
        }
      }
    }

    setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };"""

new_cancel_resolve = """  const handleCancelReservation = (id: string) => {
    setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const handleResolveCancellation = (id: string) => {
    const reservation = allReservations.find(r => r.id === id);
    if (!reservation) return;

    // Refund logic
    if (reservation.paymentMethod === 'credits' && reservation.totalPrice) {
      const userToRefund = allUsers.find(u => u.email === reservation.userEmail);
      if (userToRefund) {
        const updatedUser = { ...userToRefund, credits: userToRefund.credits + reservation.totalPrice };
        setAllUsers(prev => prev.map(u => u.email === userToRefund.email ? updatedUser : u));
        if (userToRefund.email === userProfile.email) {
          setUserProfile(updatedUser);
        }
        
        // Add refund transaction if it's the current user
        if (userToRefund.email === userProfile.email) {
          const roomName = allLocations.flatMap(l => l.floors).flatMap(f => f.rooms).find(r => r.id === reservation.roomId)?.name || 'Unknown Space';
          setTransactions(prev => [{
            id: `tx-refund-${Date.now()}`,
            type: 'credit',
            amount: reservation.totalPrice!,
            description: `Refund: ${roomName}`,
            date: new Date().toISOString(),
            isReservation: true,
            roomName: roomName,
            locationName: allLocations.find(l => l.id === reservation.locationId)?.name,
            floorName: allLocations.flatMap(l => l.floors).find(f => f.id === reservation.floorId)?.name,
            duration: reservation.duration,
            paymentMethod: reservation.paymentMethod,
            hasInstorePurchases: reservation.selectedMenuItems && reservation.selectedMenuItems.length > 0
          }, ...prev]);
        }
      }
    }

    setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };"""

content = content.replace(old_cancel, new_cancel_resolve)

# Add onResolveCancellation to EmployeeDashboard props
content = content.replace("onCancelReservation={handleCancelReservation}", "onCancelReservation={handleCancelReservation}\n          onResolveCancellation={handleResolveCancellation}")

with open(file_path, "w") as f:
    f.write(content)

print("App patched.")
