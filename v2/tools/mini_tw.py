import re,sys
PAL={'slate':{50:'f8fafc',100:'f1f5f9',200:'e2e8f0',300:'cbd5e1',400:'94a3b8',500:'64748b',600:'475569',700:'334155',800:'1e293b',900:'0f172a'},
'teal':{50:'f0fdfa',100:'ccfbf1',200:'99f6e4',300:'5eead4',400:'2dd4bf',500:'00bfa5',600:'00897b',700:'0f766e',800:'115e59',900:'134e4a'},
'amber':{100:'fef3c7',300:'fcd34d',500:'f59e0b',600:'d97706',700:'b45309'},
'blue':{100:'dbeafe',700:'1d4ed8'},'emerald':{100:'d1fae5',300:'6ee7b7',800:'065f46'},'purple':{100:'f3e8ff',700:'7e22ce'},
'ocean':{700:'0e7490',800:'05445e',900:'0b2545',950:'07162c'}}
def color(tok):
    a=None
    if '/' in tok: tok,a=tok.split('/'); a=int(a)/100
    if tok=='white': h='ffffff'
    elif tok=='black': h='000000'
    else:
        m=re.fullmatch(r'([a-z]+)-(\d+)',tok)
        if not m or m.group(1) not in PAL or int(m.group(2)) not in PAL[m.group(1)]: return None
        h=PAL[m.group(1)][int(m.group(2))]
    if a is None: return '#'+h
    r,g,b=int(h[:2],16),int(h[2:4],16),int(h[4:],16)
    return f'rgb({r} {g} {b} / {a:g})'
def fmt(x):
    s=f'{x:.4f}'.rstrip('0').rstrip('.'); return s
def sp(v):
    if v=='px': return '1px'
    if v=='full': return '100%'
    if v=='auto': return 'auto'
    if v.startswith('['): return v[1:-1]
    if '/' in v:
        a,b=v.split('/'); return fmt(int(a)/int(b)*100)+'%'
    if v=='0': return '0'
    return fmt(float(v)*0.25)+'rem'
FS={'xs':('.75rem','1rem'),'sm':('.875rem','1.25rem'),'base':('1rem','1.5rem'),'lg':('1.125rem','1.75rem'),'xl':('1.25rem','1.75rem'),'2xl':('1.5rem','2rem'),'3xl':('1.875rem','2.25rem'),'4xl':('2.25rem','2.5rem'),'5xl':('3rem','1'),'6xl':('3.75rem','1')}
MW={'sm':'24rem','md':'28rem','lg':'32rem','xl':'36rem','2xl':'42rem','3xl':'48rem','4xl':'56rem','5xl':'64rem','7xl':'80rem'}
FW={'normal':400,'medium':500,'semibold':600,'bold':700,'extrabold':800,'black':900}
RD={'md':'.375rem','lg':'.5rem','xl':'.75rem','2xl':'1rem','3xl':'1.5rem','full':'9999px'}
SH={'sm':'0 1px 2px 0 var(--c,rgb(0 0 0/.05))','md':'0 4px 6px -1px var(--c,rgb(0 0 0/.1)),0 2px 4px -2px var(--c,rgb(0 0 0/.1))','lg':'0 10px 15px -3px var(--c,rgb(0 0 0/.1)),0 4px 6px -4px var(--c,rgb(0 0 0/.1))','xl':'0 20px 25px -5px var(--c,rgb(0 0 0/.1)),0 8px 10px -6px var(--c,rgb(0 0 0/.1))','2xl':'0 25px 50px -12px var(--c,rgb(0 0 0/.25))'}
TR='transform:translate(var(--tx,0),var(--ty,0)) scale(var(--s,1))'
SIMPLE={'block':'display:block','flex':'display:flex','grid':'display:grid','hidden':'display:none','inline-block':'display:inline-block','inline-flex':'display:inline-flex',
'relative':'position:relative','absolute':'position:absolute','fixed':'position:fixed','truncate':'overflow:hidden;text-overflow:ellipsis;white-space:nowrap','whitespace-nowrap':'white-space:nowrap','overflow-hidden':'overflow:hidden','object-cover':'object-fit:cover','italic':'font-style:italic','uppercase':'text-transform:uppercase','antialiased':'-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale','cursor-pointer':'cursor:pointer','shrink-0':'flex-shrink:0','flex-1':'flex:1 1 0%','flex-col':'flex-direction:column','flex-row':'flex-direction:row','flex-wrap':'flex-wrap:wrap',
'items-center':'align-items:center','items-start':'align-items:flex-start','items-baseline':'align-items:baseline','items-stretch':'align-items:stretch','justify-between':'justify-content:space-between','justify-center':'justify-content:center',
'border-dashed':'border-style:dashed','mix-blend-multiply':'mix-blend-mode:multiply','text-center':'text-align:center','text-left':'text-align:left','font-sans':"font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",'font-mono':"font-family:'Space Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
'stroke-current':'stroke:currentColor','fill-none':'fill:none','transition-all':'transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s','transition-colors':'transition-property:color,background-color,border-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s','transition-transform':'transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s',
'h-auto':'height:auto','w-full':'width:100%','h-full':'height:100%','mx-auto':'margin-left:auto;margin-right:auto','animate-ping':'animation:ping 1s cubic-bezier(0,0,.2,1) infinite','focus-none':'outline:2px solid transparent;outline-offset:2px','bg-gradient-to-br':'background-image:linear-gradient(to bottom right,var(--gs))','border':'border-width:1px','border-2':'border-width:2px','border-b':'border-bottom-width:1px','border-t':'border-top-width:1px','border-l':'border-left-width:1px','border-y':'border-top-width:1px;border-bottom-width:1px','border-l-2':'border-left-width:2px','ring-4':'box-shadow:0 0 0 4px var(--rc,#3b82f680)','ring-1':'box-shadow:0 0 0 1px var(--rc,#3b82f680)'}
ORDER=['display','pos','inset','z','size','m','p','grid','flex','type','color','bg','border','round','shadow','opac','tr','anim']
def util(b,neg):
    """returns (cat, decl, mode)"""
    if b in SIMPLE:
        d=SIMPLE[b]
        cat='display' if b in('block','flex','grid','hidden','inline-block','inline-flex') else 'pos' if b in('relative','absolute','fixed') else 'tr' if b.startswith('transition') else 'border' if b.startswith('border') or b.startswith('ring') else 'bg' if b.startswith('bg-') else 'anim' if b.startswith('animate') else 'flex' if b.split('-')[0] in('items','justify','flex','shrink') else 'type'
        if b in('h-auto','w-full','h-full'): cat='size'
        if b=='mx-auto': cat='m'
        if b=='ring-4' or b=='ring-1': cat='shadow'
        return cat,d,'p'
    m=re.fullmatch(r'inset-0',b)
    if m: return 'inset','top:0;right:0;bottom:0;left:0','p'
    m=re.fullmatch(r'(top|right|bottom|left)-(.+)',b)
    if m: return 'inset',f"{m[1]}:{'-' if neg else ''}{sp(m[2])}",'p'
    m=re.fullmatch(r'z-(\d+)',b)
    if m: return 'z',f'z-index:{m[1]}','p'
    m=re.fullmatch(r'(w|h|min-h|min-w)-(.+)',b)
    if m:
        pr={'w':'width','h':'height','min-h':'min-height','min-w':'min-width'}[m[1]]; return 'size',f'{pr}:{sp(m[2])}','p'
    m=re.fullmatch(r'max-w-(.+)',b)
    if m and m[1] in MW: return 'size',f'max-width:{MW[m[1]]}','p'
    m=re.fullmatch(r'([mp])([trblxy]?)-(.+)',b)
    if m:
        if m[3] in('shadow',): return None
        pr='margin' if m[1]=='m' else 'padding'; v=('-' if neg else '')+sp(m[3])
        sides={'':['']," x":0}
        s={'':[''],'x':['-left','-right'],'y':['-top','-bottom'],'t':['-top'],'b':['-bottom'],'l':['-left'],'r':['-right']}[m[2]]
        return ('m' if m[1]=='m' else 'p'),';'.join(f'{pr}{x}:{v}' for x in s),'p'
    m=re.fullmatch(r'grid-cols-(\d+)',b)
    if m: return 'grid',f'grid-template-columns:repeat({m[1]},minmax(0,1fr))','p'
    m=re.fullmatch(r'col-span-(\d+)',b)
    if m: return 'grid',f'grid-column:span {m[1]} / span {m[1]}','p'
    m=re.fullmatch(r'gap-(.+)',b)
    if m: return 'grid',f'gap:{sp(m[1])}','p'
    m=re.fullmatch(r'space-y-(.+)',b)
    if m: return 'grid',f'margin-top:{sp(m[1])}','space'
    if b=='divide-y': return 'border','border-top-width:1px','space'
    m=re.fullmatch(r'divide-(.+)',b)
    if m and color(m[1]): return 'border',f'border-color:{color(m[1])}','space'
    m=re.fullmatch(r'text-(.+)',b)
    if m:
        t=m[1]
        if t in FS: return 'type',f'font-size:{FS[t][0]};line-height:{FS[t][1]}','p'
        if t.startswith('['): return 'type',f'font-size:{t[1:-1]}','p'
        c=color(t)
        if c: return 'color',f'color:{c}','p'
    m=re.fullmatch(r'font-(.+)',b)
    if m and m[1] in FW: return 'type',f'font-weight:{FW[m[1]]}','p'
    m=re.fullmatch(r'tracking-(.+)',b)
    if m: return 'type','letter-spacing:'+{'tight':'-.025em','wide':'.025em','wider':'.05em','widest':'.1em'}[m[1]],'p'
    m=re.fullmatch(r'leading-(.+)',b)
    if m: return 'type','line-height:'+({'tight':'1.25','snug':'1.375','relaxed':'1.625'}.get(m[1]) or m[1][1:-1]),'p'
    m=re.fullmatch(r'bg-(.+)',b)
    if m and color(m[1]): return 'bg',f'background-color:{color(m[1])}','p'
    m=re.fullmatch(r'from-(.+)',b)
    if m and color(m[1]): return 'bg',f'--gf:{color(m[1])};--gs:var(--gf),var(--gt,transparent)','p'
    m=re.fullmatch(r'to-(.+)',b)
    if m and color(m[1]): return 'bg',f'--gt:{color(m[1])}','p'
    m=re.fullmatch(r'border-(.+)',b)
    if m and color(m[1]): return 'border',f'border-color:{color(m[1])}','p'
    m=re.fullmatch(r'rounded-(.+)',b)
    if m and m[1] in RD: return 'round',f'border-radius:{RD[m[1]]}','p'
    m=re.fullmatch(r'shadow-(.+)',b)
    if m:
        if m[1] in SH: return 'shadow','box-shadow:'+SH[m[1]].replace('var(--c,','var(--sc,'),'p'
        if color(m[1]): return 'shadow',f'--sc:{color(m[1])}','p'
    m=re.fullmatch(r'ring-(.+)',b)
    if m and color(m[1]): return 'shadow',f'--rc:{color(m[1])}','p'
    m=re.fullmatch(r'opacity-(\d+)',b)
    if m: return 'opac',f'opacity:{int(m[1])/100:g}','p'
    m=re.fullmatch(r'(translate-x|translate-y)-(.+)',b)
    if m: return 'tr',f"--{'tx' if m[1][-1]=='x' else 'ty'}:{'-' if neg else ''}{sp(m[2])};{TR}",'p'
    m=re.fullmatch(r'scale-(\d+)',b)
    if m: return 'tr',f'--s:{int(m[1])/100:g};{TR}','p'
    m=re.fullmatch(r'duration-(\d+)',b)
    if m: return 'anim',f'transition-duration:{int(m[1])/1000:g}s','p'
    m=re.fullmatch(r'stroke-\[(.+)\]',b)
    if m: return 'type',f'stroke-width:{m[1]}','p'
    if b.startswith('backdrop-blur') or b in('group','scroll-smooth','selection'): return 'noop','','p'
    m=re.fullmatch(r'placeholder-(.+)',b)
    if m and color(m[1]): return 'color',f'color:{color(m[1])}','ph'
    return None
SCR={'sm':640,'md':768,'lg':1024}
def esc(c): return re.sub(r'([^a-zA-Z0-9_-])',r'\\\1',c)
def gen(classes):
    buckets={}; unknown=[]
    for c in sorted(classes):
        parts=c.split(':'); b=parts[-1]; vs=parts[:-1]
        neg=b.startswith('-') and not b.startswith('--'); bb=b[1:] if neg else b
        screen=next((v for v in vs if v in SCR),None); st=[v for v in vs if v not in SCR]
        key='focus-none' if bb=='outline-none' else bb
        r=util(key,neg)
        if r is None: unknown.append(c); continue
        cat,d,mode=r
        if cat=='noop': continue
        sel='.'+esc(c); pre=''
        if 'group-hover' in st: sel='.group:hover '+sel
        elif 'hover' in st: sel+=':hover'
        elif 'focus' in st: sel+=':focus'
        if 'selection' in st: sel=f'{sel} ::selection,{sel}::selection'
        if mode=='space': sel+=' > :not([hidden]) ~ :not([hidden])'
        if mode=='ph': sel+='::placeholder'
        stateflag=1 if st else 0
        buckets.setdefault(screen,[]).append((stateflag,ORDER.index(cat),c,f'{sel}{{{d}}}'))
    out=['/* generado por build/mini_tw.py — utilidades estáticas (sin Tailwind en runtime) */','@keyframes ping{75%,100%{transform:scale(2);opacity:0}}']
    for scr in [None,'sm','md','lg']:
        rules=[x[3] for x in sorted(buckets.get(scr,[]))]
        if not rules: continue
        out.append('\n'.join(rules) if scr is None else f'@media (min-width:{SCR[scr]}px){{\n'+'\n'.join(rules)+'\n}')
    return '\n'.join(out),unknown
if __name__=='__main__':
    h=open(sys.argv[1]).read(); cls=set()
    for m in re.finditer(r'class="([^"]*)"',h): cls.update(m.group(1).split())
    css,unk=gen(cls); open(sys.argv[2],'w').write(css); print(len(css),'bytes; sin regla:',unk)
