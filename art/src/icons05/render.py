import sys,os,subprocess,math
from PIL import Image,ImageDraw
D=os.path.dirname(os.path.abspath(__file__))
defs=open(D+'/defs2.svgpart').read()
names=[l.strip() for l in sys.argv[1:]] or sorted(f[:-4] for f in os.listdir(D+'/svg') if f.endswith('.svg'))
cols=8; rows=math.ceil(len(names)/cols)
cells=''.join(f'<div style="position:absolute;left:{(i%cols)*256}px;top:{(i//cols)*256}px;width:256px;height:256px"><svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">{defs}{open(D+"/svg/"+n+".svg").read()}</svg></div>' for i,n in enumerate(names))
open(D+'/sheet.html','w').write('<html><body style="margin:0;background:transparent">'+cells+'</body></html>')
subprocess.run(["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome","--headless=new","--disable-gpu","--hide-scrollbars","--default-background-color=00000000","--force-device-scale-factor=1",f"--window-size={cols*256},{rows*256}",f"--screenshot={D}/sheet.png","file://"+D+"/sheet.html"],stderr=subprocess.DEVNULL,stdout=subprocess.DEVNULL)
s=Image.open(D+'/sheet.png').convert('RGBA')
os.makedirs(D+'/out',exist_ok=True)
prev=Image.new('RGBA',(cols*200,rows*215),(58,58,58,255)); dr=ImageDraw.Draw(prev)
for i,n in enumerate(names):
    im=s.crop(((i%cols)*256,(i//cols)*256,(i%cols)*256+256,(i//cols)*256+256))
    im.save(D+f'/out/{n}.webp','WEBP',quality=88,method=6)
    prev.alpha_composite(im.resize((200,200),Image.LANCZOS),((i%cols)*200,(i//cols)*215))
    dr.text(((i%cols)*200+6,(i//cols)*215+200),n,fill=(230,230,230,255))
prev.convert('RGB').save(D+'/preview.png')
print('rendered',len(names))
