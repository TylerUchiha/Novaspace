import os

file_path = "App.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_res_single = """        totalPrice: totalPrice,
        paymentMethod,
        hasInstorePurchases: true"""

new_res_single = """        totalPrice: totalPrice,
        paymentMethod,
        origin: isStaff ? 'instore' : 'app',
        hasInstorePurchases: true"""

content = content.replace(old_res_single, new_res_single)

old_res_multiple = """        totalOrderComment: totalOrderComment,
        totalPrice: totalPrice / roomsToBook.length, // Distribute total price among rooms in batch
        paymentMethod
      };"""

new_res_multiple = """        totalOrderComment: totalOrderComment,
        totalPrice: totalPrice / roomsToBook.length, // Distribute total price among rooms in batch
        paymentMethod,
        origin: isStaff ? 'instore' : 'app'
      };"""

content = content.replace(old_res_multiple, new_res_multiple)

with open(file_path, "w") as f:
    f.write(content)

print("Origin patched.")
