# PaulitaM

Tienda de muestra de Paulita: 17 colecciones y 19 diseños con charms propios, dos vistas por modelo, tallas EU y cursor corazón. Colecciones estacionales, Disney (La Bella y la Bestia y El Rey León), Piratas del Caribe, Snoopy, Pack BFF, Navidad, San Valentín, Halloween, vuelta al cole, foodie, cósmica, mascotas, música y deportes. Invierno y Navidad llevan pelito interior.

El Pack BFF incluye dos pares complementarios (sol y luna), cada uno con su talla. Música permite elegir Quevedo, Bad Bunny o Aitana; deportes, Cristiano Ronaldo, Marc Márquez o LeBron James. La opción regalo añade papel temático y tarjeta con dedicatoria por 3,90 € orientativos por unidad o pack. El test de cinco preguntas recomienda un modelo según las respuestas. El rincón de Paulita cuenta la historia facilitada por sus creadores.

Carrito local persistente y descarga de selección con tallas, charms y presentación de regalo. Las dedicatorias solo se guardan en el navegador; el test no guarda ni transmite respuestas. Español, diseño adaptable, sin seguimiento, pagos ni pedidos reales. Los productos, precios e imágenes son conceptuales, sin afiliación oficial.

**Web:** https://paulitam.woas-team.team

## Desarrollo

Sin dependencias de compilación. `python3 -m http.server 4173 --directory site` y abrir http://localhost:4173.

`node --test tests/*.test.cjs` verifica catálogo, importes de regalos y packs, restauración del carrito y recomendaciones. `node --check site/app.js` valida JavaScript. `kubectl kustomize .` renderiza los manifiestos.

## GitOps en WoAS

ArgoCD observa la raíz de este repositorio en `main` con Kustomize. Genera ConfigMaps con hash para la web, Nginx y cada imagen, montados mediante un volumen proyectado, de forma que cada cambio despliega automáticamente dos réplicas. Las imágenes están separadas para respetar los límites de tamaño de Kubernetes. El contenido completo se sirve desde Kubernetes: no necesita una imagen de aplicación, registro privado ni credenciales de GitHub dentro del pod.

El Application y el AppProject acotado `paulitam` están registrados en `WoAS-dev-team/woas-gitops`, dentro de `clusters/bare-metal-prod/argocd`. Este repositorio personal contiene toda la tienda y sus manifiestos; el repositorio de plataforma solo registra la aplicación y la ruta compartida del túnel existente.

Tráfico: Cloudflare HTTPS → túnel WoAS clients → Traefik HTTPS → Service → Nginx sin privilegios. El DNS CNAME proxied apunta al túnel existente `08fdca05-9c98-4c77-8b9e-c25496de6aae.cfargotunnel.com`.

Para actualizar, editar `site/`, validar y enviar a `main`. ArgoCD sincroniza automáticamente, con self-heal y prune. Revertir con `git revert` del commit correspondiente. La CI valida JavaScript y renderizado de Kubernetes.

La portada y las 19 imágenes de catálogo fueron creadas con la herramienta integrada de generación de imágenes. Cada imagen de producto contiene dos fotografías conceptuales del mismo diseño, frontal y superior, mostradas por separado en su galería. Archivos finales y prompts en [ASSETS.md](ASSETS.md). Los diseños Disney utilizan motivos del cuento y la sabana; no son fotografías de producto oficial.

## Antes de vender

Sustituir modelos y precios de muestra en `site/catalog.js` por catálogo y disponibilidad reales, incorporar guía de tallas, datos del vendedor, condiciones y política de venta; conectar backend y proveedor de cobros. Cambiar textos de muestra y `site/robots.txt` al activar las ventas.
