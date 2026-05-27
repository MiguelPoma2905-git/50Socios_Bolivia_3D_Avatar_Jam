```markdown
# UTAFORMERS: AL FONDO HAY CAMPO
> **Proyecto Indie de Combate y Scrollytelling Andean Cyberpunk**
> *Ubicación de Desarrollo: La Paz, Bolivia*

---

## Sinopsis del Proyecto

**UTAFORMERS: Al Fondo Hay Campo** es una propuesta de videojuego independiente ambientada en una versión futurista e hiper-cibernética de la ciudad de La Paz. En este universo, la radiación cósmica concentrada en las huacas altiplánicas reacciona con el diésel pesado y el neón chicha, dando vida propia a los legendarios vehículos de transporte paceño. 

Los clásicos microbuses Dodge de 1978, la flota municipal PumaKatari y los veloces trufis Toyota Caldina despliegan sus chasis, extienden pistones hidráulicos oxidados y se erigen como colosales mechas en una guerra secreta por el control de las pendientes y las rutas comerciales de la ciudad.

---

## Características Principales y Mecánicas Inmersivas

La landing page del proyecto está diseñada como una terminal de diagnóstico retro-industrial clandestina. Sus características clave incluyen:

### 1. Tablero de Comando Industrial (Top-Right Dashboard)
* **Generador Acústico (Sound System)**: Conectado a la Web Audio API para reproducir un zumbido analógico de fondo, sonido de lluvia sobre el chasis y chasquidos analógicos al interactuar.
* **Control de Clima Paceño (Theme Switch)**: Alterna de forma fluida y cinemática toda la estética de la web entre:
  * **Noche Cyberpunk**: Iluminación de neones magenta/chicha, lluvia ácida y oscuridad urbana profunda.
  * **Mañana Fría Paceña**: Atmósfera inspirada en el amanecer andino, cielo gris adoquín, bancos de neblina densa y nubes en movimiento constante.

### 2. Simulador de Acelerador y Transformación (Hero Pedal)
* Un pedal de acelerador interactivo en 3D que responde al mouse o al tacto.
* Al presionarlo, el motor ruge y sube de RPMs mediante síntesis de audio procedimental.
* Si se mantiene la presión al 100%, se activa la Transformación Mecha, sacudiendo toda la interfaz con efectos de vibración mecánica (Screen Shake) y emitiendo vapor hidráulico con destellos eléctricos.

### 3. La Bitácora del Chofer (Mesa de Trabajo)
* Un piso de micro clásico paceño lleno de monedas de bolivianos y objetos caídos que esconden la historia del conflicto:
  * **El Periódico "Extra Paceño"**: Columnas y reportes sensacionalistas sobre avistamientos mecha.
  * **Radio de Sindicato**: Receptor de frecuencias que genera transmisiones de voz interceptadas en tiempo real.
  * **Cassette de Grabación**: Un visualizador LED que renderiza ondas de audio dinámicas en Canvas 2D mientras reproduce cintas encontradas con testimonios de choferes.
  * **Plano de Colectivo**: Planos vectoriales detallando el núcleo reactor de presión de los mechas rebeldes.

### 4. Bajo el Capó: Selector de Ingeniería (Under the Hood)
* Una caja de cambios manual de 4 velocidades interactiva.
* Deslizar la palanca física o cambiar de marcha permite diagnosticar las capas 3D del colectivo principal (Boceto, Malla Holográmica, Textura y Render Final) acompañado de efectos de barrido láser verde en pantalla.

### 5. Garaje de Diseño de Personajes (Hangar Interactivo)
* Espacio especializado para explorar cómo se esculpió de punta a punta a los guerreros de la calle:
  * **Colectivo Rayo (Dodge D-300)**: Unidad de mecha pesado propulsado por diésel con decoraciones tradicionales de chapa y chicha.
  * **Puma Metropolitano (PumaKatari)**: Unidad de mecha de orden y patrullaje equipado con escudos de fotones y whipala activa en su pecho.
  * **Chasqui Trufi (Toyota Caldina)**: El veloz y ágil explorador de Sopocachi que reemplaza ruedas por propulsores hover en microsegundos.
* **Timeline de Evolución**: Navegador por fases (Boceto de Concepción, Wireframe Holográfico, Texturizado y Render Final) con ilustraciones vectoriales personalizadas y notas de la bitácora del modelador 3D.

### 6. Hoja de Roadmap y Registro (Beta Sign-up)
* Sistema para el reclutamiento de pilotos de prueba en la Beta de Utaformers.
* Al rellenar la hoja de ruta física del chofer, la interfaz reacciona con traqueteos de motor diésel y vibraciones según la velocidad a la que se completen los datos.

---

## Identidad Gráfica y Diseño

* **CRT Monitor Scanlines**: Superposición global de líneas de escaneo analógicas CRT que sumergen al usuario en una pantalla de computadora antigua.
* **Microbus Idle Rattle**: Micro-vibraciones suaves en elementos seleccionados de la UI que imitan la vibración natural de un motor diésel viejo encendido a ralentí.
* **Paleta de Colores HSL**:
  * **Neon Green (`#39ff14`)**: Energía y telemétrica del HUD.
  * **Neon Blue (`#00e5ff`)**: Visores celestes del PumaKatari y escudos holográficos.
  * **Neon Red (`#ff003c`)**: Alertas críticas de presión y luces traseras.
  * **Chicha Magenta (`#ff00ff`)**: Decos y fileteados tradicionales paceños.
  * **Andean Copper (`#C46A2D`)**: Colores tierra y óxido paceño.
* **Tipografías**:
  * *Montserrat* (Para títulos principales limpios).
  * *Oxanium* (Para elementos robóticos y futuristas).
  * *Share Tech Mono* (Para especificaciones técnicas HUD).
  * *Special Elite* (Para textos mecánicos y periódicos antiguos).

---

## Pila Tecnológica (Tech Stack)

1. **Frontend**: React 19 (Componentes funcionales de alto rendimiento y hooks reactivos).
2. **Construcción y Bundler**: Vite 8 (Compilación ultra rápida e HMR).
3. **Efectos de Audio**: Web Audio API (Generadores procedurales de osciladores, filtros paso bajo/banda y buffers de ruido blanco para audio sintético sin depender de archivos pesados).
4. **Gráficos e Ilustraciones**: SVGs nativos optimizados, CSS Keyframes y Canvas HTML5.
5. **Estilos**: Vanilla CSS modular.

---

## Instalación y Desarrollo Local

El código fuente del proyecto y sus componentes interactivos se encuentran estructurados en la subcarpeta `50Socios_Bolivia_3D_Avatar_Jam`. Sigue estos pasos para iniciarlo:

1. **Clonar e ingresar a la carpeta del proyecto**:
   ```bash
   cd 50Socios_Bolivia_3D_Avatar_Jam