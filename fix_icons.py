import sys

with open('App.tsx', 'r') as f:
    content = f.read()

# Replace Store Analytics
content = content.replace('><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span>',
                          '><Store size={20} /><span className="font-black text-sm hidden lg:block">Store Analytics</span>')

# Replace Payment Analytics
content = content.replace('><CreditCard size={20} /><span className="font-black text-sm hidden lg:block">Payment Analytics</span>',
                          '><div className="flex items-center -space-x-1"><BarChart3 size={20} /><DollarSign size={14} /></div><span className="font-black text-sm hidden lg:block">Payment Analytics</span>')

# Replace Staff Analytics
content = content.replace('><BarChart3 size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span>',
                          '><Users size={20} /><span className="font-black text-sm hidden lg:block">Staff Analytics</span>')

with open('App.tsx', 'w') as f:
    f.write(content)
print("Icons replaced")
