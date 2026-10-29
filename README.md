# Agotar el archivo

**Fernanda Angel · DPPI 2026 · T06 Sonidos**

> Todavía queda algo por escuchar.

Versión de estudio 02. Interfaz y motor de sonificación operativos con tres cartas digitalizadas, un estudio de trazos y archivos propios. **Colección de 1985, 1986 y 1987 incorporada. Faltan las capturas finales, pruebas con dispositivos reales y el video de entrega.** Este README documenta lo construido; la reflexión debe completarse después de probar las cartas reales.

## 1. Concepto y relación imagen–sonido

Tres cartas de los años ochenta recuperadas del persa en Chile son el punto de partida. El proyecto propone visitar el archivo, detenerse ante su materialidad y producir otras lecturas de lo que conserva. Los tres envíos se ordenan por sus fechas manuscritas: 19 de agosto de 1985, 2 de diciembre de 1986 y 17 de febrero de 1987. Comparten destinatario, Galvarino Henríquez S., y destino en Santiago, Chile. Los sobres sitúan el origen en Wilmington, California. Las fechas de escritura se distinguen de los matasellos. El lugar y fecha precisos del hallazgo siguen pendientes. Se conservan todas las páginas y ambas caras de cada sobre en el selector de documentos.

**La huella** transforma la distribución de tinta en una composición. **El eco de la lectura** transforma las variaciones de una lectura en voz alta en otra composición. Son dos traducciones diseñadas: la primera parte del papel; la segunda, del cuerpo que vuelve a leerlo. Ninguna reconstruye la voz del autor ni revela emociones ocultas.

La relación continúa la pregunta de «Confiésate aquí»: una medición de lo visible o audible puede producir una representación sensible, pero siempre deja algo fuera. Aquí cada aproximación añade una capa al archivo. La escritura conserva una huella; la lectura produce otra; el sistema compone con ambas. Intentar agotarlo produce más archivo.

La invitación final, **«Arriésgate: arruina una hoja blanca»**, reivindica el tiempo, la corrección y las marcas del escribir frente a la facilidad de borrar. Escribe. Tacha. Vuelve sobre una palabra. Deja algo que no puedas borrar con una tecla.

## 2. Banco de sonidos y disparador

Diez WAV mono, 44.1 kHz, 16 bits, creados por síntesis para este proyecto con asistencia de IA. No se utilizaron grabaciones de una persona ni fragmentos de canciones. Las vocales son aproximaciones mediante armónicos y resonancias; no son voces humanas. El generador reproducible se incluye en `scripts/generate_sounds.py` y requiere Python, NumPy y SciPy solamente para regenerar los sonidos, no para usar la web.

| Archivo | Nombre / duración | Origen y autoría | Licencia |
| --- | --- | --- | --- |
| `audio/a.wav` | Apertura / 2,2 s | Síntesis original para Agotar el archivo, con asistencia de IA | CC0 1.0 |
| `audio/e.wav` | Claridad / 2,1 s | Ídem | CC0 1.0 |
| `audio/i.wav` | Hilo / 2,0 s | Ídem | CC0 1.0 |
| `audio/o.wav` | Cavidad / 2,4 s | Ídem | CC0 1.0 |
| `audio/u.wav` | Profundidad / 2,6 s | Ídem | CC0 1.0 |
| `audio/m.wav` | Murmullo / 2,5 s | Ídem | CC0 1.0 |
| `audio/s.wav` | Fricción / 0,65 s | Ídem | CC0 1.0 |
| `audio/f.wav` | Aire / 1,2 s | Ídem | CC0 1.0 |
| `audio/ta.wav` | Contacto / 0,32 s | Ídem | CC0 1.0 |
| `audio/ka.wav` | Quiebre / 0,4 s | Ídem | CC0 1.0 |

Licencia del banco: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Esta declaración se refiere a estos sonidos, no a las cartas históricas ni a las bibliotecas externas. Los nombres son evocaciones de diseño, no categorías emocionales científicas.

### La huella

La imagen se reduce a 350 píxeles de ancho y se separa tinta/fondo mediante luminosidad. La persona decide una grilla de 1 a 24 filas y 1 a 24 columnas. Se recorre por filas o columnas, hacia delante o en reversa, a un tempo entre 15 y 900 BPM. Cada pulso avanza una zona, incluyendo las silenciosas; el cursor permite seguir ese recorrido. Se puede editar sonido, nota y silencio de cada zona, cambiar escala, transponer dos octavas en ambas direcciones y aplicar desfase rítmico. Las decisiones por zona se conservan por página y tamaño de grilla durante la sesión. La imagen fija se convierte así en una partitura recorrida en el tiempo.

| Dato de la imagen | Traducción |
| --- | --- |
| Presencia de tinta en una zona | Disparo de una muestra |
| Zonas vacías entre trazos | Pausas en el recorrido |
| Fila de la grilla | Nota automática en la escala elegida; la nota de cada zona también se puede editar |
| Densidad local de tinta | Intensidad y duración |
| Proporción de bordes respecto a tinta | Selección de timbre vocal; zonas compactas → murmullo |
| Densidad alta | Articulación adicional KA |
| Complejidad alta de bordes | Fricción S en algunas zonas |
| Posición horizontal | Panorama estéreo |

La escala predeterminada crea una familia sonora compartida; no pretende asignar emociones universales a las notas. La complejidad de bordes es una aproximación visual: esta versión no reconoce letras, redondez caligráfica, errores o presión del bolígrafo. Una mancha puede ser tinta, sombra o textura. La interfaz permite ver y ajustar la máscara.

### El eco de la lectura

Después de activar micrófono y cámara, se calibra el ambiente durante 1,5 segundos de silencio. Un medidor de entrada muestra si el micrófono entrega señal. Luego se lee hasta un máximo de dos minutos. Se almacenan características numéricas en memoria, no una grabación de voz ni un video. Al terminar queda disponible «3 · Escuchar el eco». La sensibilidad, la velocidad (0,25–4×), el timbre y la transposición pueden ajustarse sin volver a grabar. La última lectura se conserva al cambiar de carta o de página, hasta iniciar otra o recargar. El inicio vacío se recorta; las pausas internas permanecen.

| Registro | Traducción |
| --- | --- |
| Intensidad de voz sobre el ruido de fondo | Disparo y volumen |
| Altura vocal periódica estimada (75–500 Hz) | Nota aproximada en la escala compartida |
| Voz sin altura periódica fiable | Aire F |
| Pausas | Ausencia de nuevos eventos, con decaimiento del sonido anterior |
| Apertura de boca respecto al inicio | Vocal U/O/A y duración |
| Variación de cejas/comisuras | Articulación TA adicional |
| Inclinación de línea de ojos | Panorama estéreo |

MediaPipe Face Landmarker aporta posiciones y coeficientes de movimiento; no se usa para diagnosticar emociones. El espectrograma muestra energía por frecuencia en el tiempo; no transcribe palabras. Si la cámara o el modelo no están disponibles, el micrófono puede seguir funcionando. Hablar durante la calibración, ruido intenso, rostro fuera de cuadro y voces sin periodicidad estable afectan el resultado.

## 3. Parámetros y gráfica

| Control | Sentido dentro del proyecto |
| --- | --- |
| Tempo (15–900 BPM) | Define cuánto tiempo dedicamos a cada zona, desde 4 s hasta unos 67 ms |
| Filas y columnas (1–24 cada una) | Define la resolución de la lectura y qué marcas se agrupan |
| Orden y reversa | Permite reorganizar la dirección de lectura del archivo |
| Escala, transposición y nota por zona | Hace explícita la elección musical de quien traduce |
| Timbre y silencio por zona | Permite componer con una marca o decidir no escucharla |
| Desfase rítmico y repetición | Propone otras duraciones y retornos al documento |
| Detección de tinta | Hace visible el límite entre marca y fondo |
| Voz / resonancia musical | Aproxima la composición al lenguaje sin palabras o a notas sostenidas |
| Persistencia | Modifica cuánto tarda cada marca en desaparecer sonoramente |
| Volumen | Permite una escucha cómoda |

La página utiliza papel marfil, grano fino, azul cobalto y acentos coral/amarillo. Instrument Serif da escala editorial a los títulos; DM Sans organiza la lectura y DM Mono identifica registros y mediciones. Las manchas difusas responden a la actividad sonora, junto a la precisión del cursor y el espectrograma. La imagen del documento permanece consultable y ampliable.

**Capturas de entrega pendientes:** portada y colección real; huella sobre una carta; eco de una lectura real. No se presentan capturas simuladas como resultados del archivo histórico.

### Probar en Mac

1. Descomprime el proyecto. Abre Terminal en la carpeta que contiene `index.html`.
2. Escribe `python3 -m http.server 8010` y presiona Enter.
3. Abre `http://localhost:8010/`. Deja Terminal abierta mientras pruebas.
4. Pulsa «Explorar el estudio de trazos» y «Escuchar la huella», o carga tu propia foto.
5. Para el eco, usa auriculares, pulsa «Registrar mi lectura», permite cámara/micrófono, espera la calibración y lee. Pulsa «Terminar» y «Escuchar el eco».
6. Descarga la composición WAV si quieres conservarla.

Si el puerto está ocupado, detén el servidor anterior con Control+C o usa otro puerto y abre ese mismo número en el navegador. No abras `index.html` con doble clic: utiliza un servidor.

### Publicar en GitHub Pages

Sube el contenido del ZIP con **`index.html` directamente en la raíz del repositorio**, junto a CSS, JS, módulos y carpeta `audio`. En Settings → Pages selecciona la publicación desde la rama `main`, carpeta raíz. Abre la URL que GitHub muestre al completar el despliegue. Completa aquí los enlaces reales de repositorio y plataforma cuando existan. No se han publicado aún en GitHub en esta versión.

El sitio es estático, sin compilación ni backend. Requiere conexión para las fuentes y el modelo facial. Cámara y micrófono requieren HTTPS o localhost y permiso del navegador. Fotos y datos de lectura se procesan localmente; no se agregan al archivo público. El WAV exportado contiene la composición, no la voz original.

Archivos principales: `index.html`, `style.css`, `app.js` (interfaz/audio/captura), `analysis.mjs` (reglas), `audio/` (banco), `scripts/generate_sounds.py` (reproducción del banco), `tests.mjs` (verificación de reglas).

Tecnologías: Canvas 2D, Web Audio API, MediaDevices y MediaPipe Tasks Vision 0.10.21. Implementación propia desde cero; «Oír la luz» es la herramienta de referencia del encargo, no código reutilizado en esta versión. Las mediciones de imagen usan Canvas y reglas propias; esta versión no usa OpenCV.

## 4. Reflexión

Texto provisional que debe revisarse después de trabajar con las tres cartas:

Al intentar extraer otra lectura del documento aparecen decisiones que no pertenecen a la carta: dónde empieza una marca, cuánto dura una pausa, qué sonido corresponde a una zona de tinta. La traducción hace audibles ciertas relaciones, pero también revela el criterio de quien construye el sistema. La melodía no estaba esperando intacta dentro del papel: surge del encuentro entre una huella y una regla.

En la lectura en voz alta, el archivo se encuentra con un cuerpo presente. Sus pausas, su registro vocal y sus movimientos añaden información que no puede atribuirse a quien escribió. El eco registra ese encuentro, sin resolver el contexto perdido. Quedan fuera el significado de las frases, la experiencia del remitente y del destinatario, las razones de cada tachadura y las circunstancias de conservación.

Mejoras concretas:

1. Contrastar las tres cartas reales, corregir inclinación/iluminación y permitir delimitar manualmente renglones para evitar que sombras y pliegues se conviertan en tinta.
2. Comparar varias lecturas del mismo documento con calibración individual, mostrando qué variaciones permanecen y cuáles dependen de quien lee.
3. Añadir un editor visible del mapping, para poder discutir y alterar las decisiones de traducción.

### Antes de entregar

- Precisar lugar y fecha del hallazgo y revisar las fichas documentales.
- Probar cámara/micrófono reales y escuchar críticamente los resultados de cada carta.
- Completar reflexión con observaciones efectivas y las referencias de clase que correspondan.
- Añadir 2–3 capturas y grabar un video de uso de 30–60 segundos.
- Publicar y verificar GitHub Pages desde otro dispositivo.
- Entregar enlaces al repositorio y a la plataforma, README y video según el encargo.

### Colección incorporada

Los PDF proporcionados son M. Carolina M. (1985, cinco páginas digitalizadas), 1122 C Walk 369 (1986, cuatro páginas) y M. Elena M. (1987, cinco páginas). Incluyen sobres y cartas, no cinco/cuatro cartas separadas. Imágenes derivadas de estos escaneos en `letters/`; las fotografías del archivo no están cubiertas por la licencia CC0 del banco de sonidos. No se han inventado transcripciones.

La carta de 1987 menciona un cassette para escuchar sus voces. Ese dato permite pensar la sonificación como una nueva mediación de una correspondencia que ya buscaba cruzar escritura y voz. El cassette no fue proporcionado: la plataforma no lo reconstruye ni reproduce aquellas voces.

### Actualización de controles y eco

La última lectura ya no se descarta al navegar entre páginas. La detección de voz usa una estimación del ruido menos dependiente de palabras dichas durante la calibración, con sensibilidad ajustable y diagnóstico explícito si no hay señal. Se conecta el analizador de micrófono a una salida silenciada para mantener activo el grafo de audio, sin retorno de la voz a los altavoces. Se añadieron pruebas del flujo grabar–terminar–escuchar con APIs de micrófono simuladas; sigue siendo necesaria la prueba de cámara y micrófono físicos en el equipo de entrega. Los WAV de más de 10 minutos no se exportan en esta versión para evitar un consumo excesivo de memoria; la reproducción de la grilla conserva su rango completo.
