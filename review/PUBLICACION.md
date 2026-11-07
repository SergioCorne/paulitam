# Revisión y publicación

El usuario autorizó la publicación tras revisar la propuesta, condicionada a las modificaciones posteriores de HOME, imágenes y charms. Esta versión incorpora esas modificaciones. La publicación se realiza fusionando los cambios revisados y validados en main; Argo CD reconcilia el estado del cluster.

## Revisar

- 43 colecciones, 197 modelos temáticos, un modelo liso en diez colores y 153 charms. Los conceptos nuevos son ilustraciones de muestra; faltan fotografías, referencias, stock, autenticidad y costes reales.
- Propuesta completa en PRECIOS.md y precios.csv. Sin cobro: catálogo, carrito y descarga de pedido. No se inventan ventas, reseñas o disponibilidad.
- Alternativas de estética original en LICENCIAS.md. Invierno mantiene forro interior como propuesta pendiente de proveedor.
- Test de cinco preguntas y seis perfiles, emociones, inspiración aleatoria, configurador y comparación antes/después; cartas cifradas, planetas, deseos, jardín, parejas y cápsulas.

## Servicio y privacidad

Node 24 + SQLite persistente en PVC local-path 2 GiB, una réplica Recreate. El PVC requiere fusionar primero el cambio del AppProject en woas-gitops. Se conserva el despliegue estático y el dominio actuales. El servicio utiliza un Secret de runtime fuera de Git; nunca se guardan credenciales en el repositorio.

Las cartas y fotografías se cifran con AES-GCM en el navegador. La clave viaja en el fragmento del enlace y nunca al servidor. Cualquiera con el enlace completo o QR puede leer; no son cuentas con identificación. El recibo privado permite borrar y cancelar correo pendiente; perderlo impide recuperar esa capacidad. La cápsula se bloquea por fecha en el servidor. Caducidad: un año desde creación o apertura programada. Hacer copia protegida del volumen y probar restauración antes de usar datos reales. El almacenamiento local-path depende del nodo; no proporciona alta disponibilidad.

Planetas, deseos y flores quedan pendientes hasta moderación humana. No se presentan como reseñas verificadas. `/ #moderacion` (sin espacio) abre la herramienta de moderación; requiere MODERATION_TOKEN y no guarda el token. El backend filtra datos personales obvios y exige revisión antes de aprobar; el filtro no sustituye al moderador.

El ejemplo deploy/experiences-runtime.example.yaml NO está incluido en Kustomize ni contiene credenciales válidas. Configurar por un canal seguro el Secret paulitam-experiences-runtime: MODERATION_TOKEN (>=24 caracteres), DATA_ENCRYPTION_KEY (32 bytes en hexadecimal), RESEND_API_KEY y CAPSULE_FROM de un dominio verificado. PUBLIC_ORIGIN ya apunta al dominio público. Sin configuración completa el correo aparece deshabilitado; la cápsula y el calendario siguen funcionando. Hay doble confirmación voluntaria del correo; las pruebas usan un proveedor simulado y no envían mensajes reales. La notificación no incluye la clave de lectura: hace falta el enlace original o recibo guardado.

La API limita solicitudes por IP remota; detrás del proxy esta cuota puede ser compartida. Revisar capacidad y monitorizar antes de abrir a tráfico alto. No se registran rutas privadas en el proxy. Limitar acceso operativo al PVC y secretos.

## Procedimiento de publicación y verificación

1. Mantener el catálogo sin cobro mientras faltan referencias, fotos de proveedor, costes y condiciones de venta.
2. Aprobar y fusionar el PR del AppProject (solo añade PersistentVolumeClaim en paulitam).
3. Preparar secretos y copia de seguridad por canal seguro; correo opcional hasta verificar remitente.
4. Fusionar el PR de la tienda: Argo CD sigue main y desplegará mediante GitOps.
5. Verificar Synced/Healthy, PVC Bound, /api/status, dominio, compra sin cobro, cartas/QR, moderación y cápsula. Solo entonces avisar de publicación.

## Imágenes y mantenimiento

153 referencias individuales de charms y diez colores lisos, con vistas adicionales del rosa pastel. Todas se generan de forma independiente mediante la herramienta integrada, se optimizan como WebP y llevan etiqueta visible. Los archivos y prompts están en IMAGENES.json; no acreditan disponibilidad ni materiales reales. Para incorporar fotos reales, editar product-media.js y añadir los archivos correspondientes al empaquetado de Kustomize, distinguiendo expresamente su procedencia. Nunca anunciar zuecos genéricos como Crocs originales.

El PVC lleva Prune=false para proteger los datos al revertir una versión. No borrarlo al hacer rollback. La galería pública requiere moderación manual; no se añaden mensajes o clientes ficticios.
