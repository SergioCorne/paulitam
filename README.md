# PaulitaM

Tienda de muestra de Paulita: cuatro estaciones, estética rosa, catálogo filtrable, tallas EU, carrito local persistente y descarga de selección. Español, diseño adaptable, sin seguimiento ni datos personales, sin pagos ni pedidos reales. Los productos, precios e imágenes son conceptuales.

**Web:** https://paulitam.woas-team.team

## Desarrollo

Sin dependencias de compilación. `python3 -m http.server 4173 --directory site` y abrir http://localhost:4173.

`node --check site/app.js` valida JavaScript. `kubectl kustomize .` renderiza los manifiestos.

## GitOps en WoAS

ArgoCD observa la raíz de este repositorio en `main` con Kustomize. Genera ConfigMaps con hash para la web y Nginx, de forma que cada cambio despliega automáticamente dos réplicas. El contenido completo (incluida la imagen WebP) se sirve desde Kubernetes: no necesita una imagen de aplicación, registro privado ni credenciales de GitHub dentro del pod.

El Application y el AppProject acotado `paulitam` están registrados en `WoAS-dev-team/woas-gitops`, dentro de `clusters/bare-metal-prod/argocd`. Este repositorio personal contiene toda la tienda y sus manifiestos; el repositorio de plataforma solo registra la aplicación y la ruta compartida del túnel existente.

Tráfico: Cloudflare HTTPS → túnel WoAS clients → Traefik HTTPS → Service → Nginx sin privilegios. El DNS CNAME proxied apunta al túnel existente `08fdca05-9c98-4c77-8b9e-c25496de6aae.cfargotunnel.com`.

Para actualizar, editar `site/`, validar y enviar a `main`. ArgoCD sincroniza automáticamente, con self-heal y prune. Revertir con `git revert` del commit correspondiente. La CI valida JavaScript y renderizado de Kubernetes.

La imagen principal fue generada con la herramienta integrada de generación de imágenes, con el prompt de fotografía editorial de un par de zuecos rosas con charms de margaritas, pedestal rosa y luz de estudio, sin logos ni texto. Archivo final: `site/hero.webp`. Los colores del catálogo son variantes CSS conceptuales de esa imagen.

## Antes de vender

Sustituir modelos y precios de muestra en `site/app.js` por catálogo y disponibilidad reales, incorporar guía de tallas, datos del vendedor, condiciones y política de venta; conectar backend y proveedor de cobros. Cambiar textos de muestra y `site/robots.txt` al activar las ventas.
