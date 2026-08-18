import os
import re

directories = ['src/components', 'src', 'src/data']

replacements = {
    'bg-rose-500 text-white': 'bg-white text-black',
    'bg-rose-500': 'bg-white',
    'text-rose-500': 'text-white',
    'text-rose-400': 'text-zinc-400',
    'text-rose-300': 'text-zinc-300',
    'text-rose-100': 'text-zinc-400',
    'text-rose-600': 'text-black',
    'border-rose-500': 'border-white',
    'ring-rose-500': 'ring-white',
    'shadow-rose-500/20': 'shadow-white/10',
    'shadow-rose-500/50': 'shadow-white/20',
    'ring-rose-500/30': 'ring-white/30',
    'ring-rose-500/50': 'ring-white/50',
    'border-rose-500/20': 'border-white/20',
    'border-rose-500/40': 'border-white/40',
    'bg-rose-500/10': 'bg-white/10',
    'bg-rose-500/20': 'bg-white/20',
    'hover:bg-rose-600': 'hover:bg-zinc-200',
    'hover:text-rose-300': 'hover:text-zinc-300',
    'accent-rose-500': 'accent-white',
    'hover:bg-rose-500/20': 'hover:bg-white/20',
    'selection:bg-rose-500 selection:text-white': 'selection:bg-white selection:text-black',
    'bg-[#E11D48]': 'bg-white'
}

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.html') or file.endswith('.css') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            for old, new in replacements.items():
                content = content.replace(old, new)
                
            # Replace badgeColors in presets.ts
            if file == 'presets.ts':
                content = re.sub(r"badgeColor:\s*'#[A-F0-9]+'", "badgeColor: '#FFFFFF'", content)
                
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {path}')
