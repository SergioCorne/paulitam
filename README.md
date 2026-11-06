# PaulitaM

Tienda de muestra de Paulita: 17 colecciones y 19 diseños con charms propios, dos vistas por modelo, tallas EU y cursor corazón. Colecciones estacionales, Disney (La Bella y la Bestia y El Rey León), Piratas del Caribe, Snoopy, Pack BFF, Navidad, San Valentín, Halloween, vuelta al cole, foodie, cósmica, mascotas, música y deportes. Invierno y Navidad llevan pelito interior.

El Pack BFF incluye dos pares complementarios (sol y luna), cada uno con su talla. Música permite elegir Quevedo, Bad Bunny o Aitana; deportes, Cristiano Ronaldo, Marc Márquez o LeBron James. La opción regalo añade papel temático y tarjeta con dedicatoria por 3,90 € orientativos por unidad o pack. El test de cinco preguntas recomienda un modelo según las respuestas. El rincón de Paulita cuenta la historia facilitada por sus creadores.

Carrito local persistente y descarga de selección con tallas, charms y presentación de regalo. Las dedicatorias solo se guardan en el navegador; el test no guarda ni transmite respuestas. Español, diseño adaptable, sin seguimiento, pagos ni pedidos reales. Los productos, precios e imágenes son conceptuales, sin afiliación oficial.

**Web:** https://paulitam.woas-team.team

## Atelier de PaulitaM

La ampliación conserva las 17 colecciones y sus 19 diseños. Añade un único modelo liso con nueve variantes de color (no nueve productos duplicados), 18 charms independientes en nueve categorías, favoritos locales y un configurador real conectado al carrito. Permite llevar solo zuecos, solo charms o una combinación sin mínimo de charms. El color, la talla, las cantidades y las posiciones se conservan tras recargar; las posiciones se mueven con arrastre o flechas del teclado. La vista representa hasta 24 charms y contabiliza todos los seleccionados.

Las nuevas referencias son editables en `site/atelier-catalog.js`. No tienen fotografías reales, stock ni costes confirmados: las ilustraciones esquemáticas se etiquetan como tales. Para incorporar fotos, añadir rutas relativas en `photos` (por color en los zuecos, por producto en los charms). Mantener referencias y costes verificados al completar el catálogo. Los recuerdos del diario también se editan en ese archivo; sus fotos y fechas están vacías hasta disponer de contenido real.

Los precios de muestra revisados y el desglose anterior/nuevo están documentados en [PRECIOS.md](PRECIOS.md) y en la web. Los importes se calculan en céntimos, incluyen los charms y regalos elegidos y separan el envío. `costCents` permite configurar un coste real; el cálculo rechaza un precio inferior al coste. No hay costes inferidos.

El álbum, la colección «Pequeñas cosas que me hacen ser yo», la personalidad de la marca, el sobre con mensajes sin repetición inmediata, el corazón escondido y las dedicatorias sugeridas amplían la web original. Se conservan el test, Pack BFF, regalos, imágenes, historia y descarga de selección. Favoritos, borrador y bolsa se guardan en el navegador, sin enviar datos personales.

## Desarrollo

Sin dependencias de compilación. `python3 -m http.server 4173 --directory site` y abrir http://localhost:4173.

`node --test tests/*.test.cjs` verifica catálogo, importes de regalos y packs, restauración del carrito y recomendaciones. `node --check site/app.js` valida JavaScript. `kubectl kustomize .` renderiza los manifiestos.

## GitOps en WoAS

ArgoCD observa la raíz de este repositorio en `main` con Kustomize. Genera ConfigMaps con hash para la web, Nginx y cada imagen, montados mediante un volumen proyectado, de forma que cada cambio despliega automáticamente dos réplicas. Las imágenes están separadas para respetar los límites de tamaño de Kubernetes. El contenido completo se sirve desde Kubernetes: no necesita una imagen de aplicación, registro privado ni credenciales de GitHub dentro del pod.

El Application y el AppProject acotado `paulitam` están registrados en `WoAS-dev-team/woas-gitops`, dentro de `clusters/bare-metal-prod/argocd`. Este repositorio personal contiene toda la tienda y sus manifiestos; el repositorio de plataforma solo registra la aplicación y la ruta compartida del túnel existente.

Tráfico: Cloudflare HTTPS → túnel WoAS clients → Traefik HTTPS → Service → Nginx sin privilegios. El DNS CNAME proxied apunta al túnel existente `08fdca05-9c98-4c77-8b9e-c25496de6aae.cfargotunnel.com`.

Para actualizar, editar `site/`, ejecutar `python3 scripts/version-assets.py`, validar y enviar a `main`. El script versiona por contenido las referencias HTML para que las cachés de navegador y Cloudflare no mezclen JavaScript antiguo con un catálogo nuevo. ArgoCD sincroniza automáticamente, con self-heal y prune. Revertir con `git revert` del commit correspondiente. La CI valida JavaScript, versiones de recursos y renderizado de Kubernetes.

La portada y las 19 imágenes de catálogo fueron creadas con la herramienta integrada de generación de imágenes. Cada imagen de producto contiene dos fotografías conceptuales del mismo diseño, frontal y superior, mostradas por separado en su galería. Archivos finales y prompts en [ASSETS.md](ASSETS.md). Los diseños Disney utilizan motivos del cuento y la sabana; no son fotografías de producto oficial.

## Antes de vender

Sustituir modelos y precios de muestra en `site/catalog.js` por catálogo y disponibilidad reales, incorporar guía de tallas, datos del vendedor, condiciones y política de venta; conectar backend y proveedor de cobros. Cambiar textos de muestra y `site/robots.txt` al activar las ventas.
