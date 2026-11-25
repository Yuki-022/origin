import numpy as np, wave
SR=44100; D=30.0; N=int(SR*D); t=np.arange(N)/SR
bpm=120; beat=60/bpm
out=np.zeros(N)
def note(f): return 440*2**((f-69)/12)
# chord progression (Cmaj9-ish lofi): Am9, Fmaj7, Cmaj7, G6 — 2 bars each
chords=[[57,60,64,67,71],[53,57,60,64,69],[48,55,59,64,67],[55,59,62,64,71]]
bar=4*beat
for i in range(int(D/(2*bar))+1):
    c=chords[i%4]; s=i*2*bar; e=min(D,s+2*bar)
    a,b=int(s*SR),int(e*SR)
    if a>=N: break
    tt=t[a:b]-s; L=e-s
    env=np.minimum(1,tt/0.4)*np.minimum(1,(L-tt)/0.4)
    for m in c:
        f=note(m)
        out[a:b]+=0.05*env*(np.sin(2*np.pi*f*tt)+0.5*np.sin(2*np.pi*f*1.003*tt)+0.2*np.sin(2*np.pi*2*f*tt))
    # bass
    f=note(c[0]-12)
    out[a:b]+=0.12*env*np.sin(2*np.pi*f*tt)
rng=np.random.default_rng(1)
nb=int(D/beat)
for k in range(nb):
    s=k*beat; a=int(s*SR)
    if s<3.0 or s>27.4: continue  # intro/outro without drums
    # kick on 1,3 ; soft
    if k%2==0:
        L=int(0.35*SR); tt=np.arange(L)/SR
        f=50+80*np.exp(-tt*25)
        kick=0.5*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9)
        out[a:a+L]+=kick[:max(0,min(L,N-a))]
    # snare-ish on 2,4
    if k%2==1:
        L=int(0.2*SR); tt=np.arange(L)/SR
        sn=0.12*rng.standard_normal(L)*np.exp(-tt*22)
        out[a:a+L]+=sn[:max(0,min(L,N-a))]
    # hat on offbeat
    h=int((s+beat/2)*SR); L=int(0.05*SR); tt=np.arange(L)/SR
    hat=rng.standard_normal(L); hat=np.diff(np.concatenate([[0],hat]))*0.04*np.exp(-tt*80)
    out[h:h+L]+=hat[:max(0,min(L,N-h))]
# whoosh at scene changes
for s in [3,6,8.5,11,13,15,17.5,20.5,23,25,27.5]:
    a=int((s-0.35)*SR); L=int(0.6*SR); tt=np.arange(L)/SR
    nz=rng.standard_normal(L); nz=np.convolve(nz,np.ones(30)/30,'same')
    env=np.sin(np.pi*tt/0.6)**2
    out[a:a+L]+=0.22*nz*env
# chime at logo
for m,d in [(76,0),(83,0.12),(88,0.24)]:
    a=int((27.6+d)*SR); L=int(2.2*SR); tt=np.arange(L)/SR; f=note(m)
    ch=0.08*(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2.01*f*tt))*np.exp(-tt*2.2)
    out[a:a+L]+=ch[:N-a]
out*=np.minimum(1,t/1.0)*np.minimum(1,(D-t)/1.5)
out=out/np.max(np.abs(out))*0.85
# simple stereo widening
l=out; r=np.roll(out,int(0.012*SR))
st=(np.stack([l,r],1)*32767).astype(np.int16)
w=wave.open('bgm.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
print('ok')
