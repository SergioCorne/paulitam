# Revisión y publicación

Esta rama es una propuesta completa, **no desplegada**. El usuario pidió: «No publiques automáticamente los cambios hasta que podamos revisarlos». No hacer merge a main ni sincronizar Argo CD antes de su aprobación.

## Revisar

- 43 colecciones, 197 modelos temáticos, un modelo liso en nueve colores y 90 charms. Los conceptos nuevos son ilustraciones de muestra; faltan fotografías, referencias, stock, autenticidad y costes reales.
- Propuesta completa en PRECIOS.md y precios.csv. Sin cobro: catálogo, carrito y descarga de pedido. No se inventan ventas, reseñas o disponibilidad.
- Alternativas de estética original en LICENCIAS.md. Invierno mantiene forro interior como propuesta pendiente de proveedor.
- Test de cinco preguntas y seis perfiles, emociones, inspiración aleatoria, configurador y comparación antes/después; cartas cifradas, planetas, deseos, jardín, parejas y cápsulas.

## Servicio y privacidad

Node 24 + SQLite persistente en PVC local-path 2 GiB, una réplica Recreate. El PVC requiere aprobar primero el cambio del AppProject en woas-gitops. Se conserva el despliegue estático y el dominio actuales. No se han aplicado manifiestos ni creado secretos en producción.

Las cartas y fotografías se cifran con AES-GCM en el navegador. La clave viaja en el fragmento del enlace y nunca al servidor. Cualquiera con el enlace completo o QR puede leer; no son cuentas con identificación. El recibo privado permite borrar y cancelar correo pendiente; perderlo impide recuperar esa capacidad. La cápsula se bloquea por fecha en el servidor. Caducidad: un año desde creación o apertura programada. Hacer copia protegida del volumen y probar restauración antes de usar datos reales. El almacenamiento local-path depende del nodo; no proporciona alta disponibilidad.

Planetas, deseos y flores quedan pendientes hasta moderación humana. No se presentan como reseñas verificadas. `/ #moderacion` (sin espacio) abre la herramienta de moderación; requiere MODERATION_TOKEN y no guarda el token. El backend filtra datos personales obvios y exige revisión antes de aprobar; el filtro no sustituye al moderador.

El ejemplo deploy/experiences-runtime.example.yaml NO está incluido en Kustomize ni contiene credenciales válidas. Configurar por un canal seguro el Secret paulitam-experiences-runtime: MODERATION_TOKEN (>=24 caracteres), DATA_ENCRYPTION_KEY (32 bytes en hexadecimal), RESEND_API_KEY y CAPSULE_FROM de un dominio verificado. PUBLIC_ORIGIN ya apunta al dominio público. Sin configuración completa el correo aparece deshabilitado; la cápsula y el calendario siguen funcionando. Hay doble confirmación voluntaria del correo; las pruebas usan un proveedor simulado y no envían mensajes reales. La notificación no incluye la clave de lectura: hace falta el enlace original o recibo guardado.

La API limita solicitudes por IP remota; detrás del proxy esta cuota puede ser compartida. Revisar capacidad y monitorizar antes de abrir a tráfico alto. No se registran rutas privadas en el proxy. Limitar acceso operativo al PVC y secretos.

## Orden después de aprobar

1. Validar catálogo, costes, fotos, permisos y propuesta económica.
2. Aprobar y fusionar el PR del AppProject (solo añade PersistentVolumeClaim en paulitam).
3. Preparar secretos y copia de seguridad por canal seguro; correo opcional hasta verificar remitente.
4. Fusionar el PR de la tienda: Argo CD sigue main y desplegará mediante GitOps.
5. Verificar Synced/Healthy, PVC Bound, /api/status, dominio, compra sin cobro, cartas/QR, moderación y cápsula. Solo entonces avisar de publicación.
