#!/usr/bin/env python3
"""Package individually generated reference images; never substitutes supplier photography."""
import json, pathlib, re, subprocess, hashlib
root=pathlib.Path(__file__).resolve().parents[1]
entries=[]
for name in ('clog-image-sources.json','charm-image-sources.json','extra-image-sources.json'):
 path=root/'qa'/name
 if path.exists(): entries.extend(json.loads(path.read_text()))
manifest=[]
for row in entries:
 source=pathlib.Path(re.search(r'as (/[^\n]+\.png) by default',row['hint']).group(1))
 dest=root/'site'/('ref-'+row['id']+'.webp')
 if not dest.exists(): subprocess.run(['cwebp','-quiet','-q','82','-resize','720','720',str(source),'-o',str(dest)],check=True)
 manifest.append({'id':row['id'],'file':dest.name,'status':'generated-reference','sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'prompt':row.get('prompt','Use case: product-mockup. One unbranded plain foam clog pair in the specified color. Three-quarter front view, full pair visible, warm cream blush studio backdrop, soft diffuse light, realistic molded foam texture, no logos or charms. Generated reference, no verified inventory.')})
(root/'review'/'IMAGENES.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
# Keep every ConfigMap safely below the repository's 240KB rendered-object limit.
groups=[];group=[];size=0
for asset in sorted((root/'site').glob('ref-*.webp')):
 if size+asset.stat().st_size>130000 and group:groups.append(group);group=[];size=0
 group.append(asset);size+=asset.stat().st_size
if group:groups.append(group)
k=root/'kustomization.yaml';text=k.read_text();text=text.split('\n  # BEGIN GENERATED REFERENCE ASSETS')[0].rstrip()+'\n'
text+='  # BEGIN GENERATED REFERENCE ASSETS\n'
for i,group in enumerate(groups):
 text+=f'  - name: paulitam-reference-{i+1:02d}\n    files:\n'+''.join(f'      - site/{p.name}\n' for p in group)
k.write_text(text)
d=root/'deploy'/'deployment.yaml';text=d.read_text();text=re.sub(r'\n              # BEGIN GENERATED REFERENCE ASSETS.*?\n              # END GENERATED REFERENCE ASSETS','',text,flags=re.S)
block='\n              # BEGIN GENERATED REFERENCE ASSETS'+''.join(f'\n              - configMap:\n                  name: paulitam-reference-{i+1:02d}'for i in range(len(groups)))+'\n              # END GENERATED REFERENCE ASSETS'
text=text.replace('\n        - name: config\n',block+'\n        - name: config\n');d.write_text(text)
print(f'{len(manifest)} references packaged in {len(groups)} bounded ConfigMaps')
