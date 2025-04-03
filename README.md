# ESCULIBIERTO - El Juego de la Serpiente 🐍

¡Bienvenido a **ESCULIBIERTO**, un emocionante juego de la serpiente version ASTURIAS, puntuaciones y desafíos únicos! 🎮

## Características principales
- **Niveles dinámicos** : Juega en diferentes niveles con obstáculos y desafíos únicos.
- **Controles intuitivos**: Usa las teclas de dirección para mover la serpiente y recoger comida.
- **Comida especial**: Obtén bonificaciones con comida especial y evita la manzana negra.
- **Tabla de puntuaciones**: Guarda tus mejores resultados y compite con otros jugadores.
- **Mensajes motivacionales**: ¡Recibe frases únicas mientras juegas! unicos tipicos de ASTURIES

## Requisitos del sistema
- Python 3.8 o superior
- Django 5.1 o superior
- Navegador web moderno (Chrome, Firefox, Edge, etc.)

## Instalación
1. Clona este repositorio:
   ```bash
   git clone https://github.com/SkarGT23/esculibierto.git
   cd esculibierto
   ```

2. Crea un entorno virtual e instala las dependencias:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configura la base de datos:
   ```bash
   python manage.py migrate
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

5. Abre tu navegador y visita `http://localhost:8000`

## Controles del juego
- ⬆️ Flecha arriba: Mover hacia arriba
- ⬇️ Flecha abajo: Mover hacia abajo
- ⬅️ Flecha izquierda: Mover a la izquierda
- ➡️ Flecha derecha: Mover a la derecha
- Espacio: Pausar/Reanudar juego

## Puntuación
- 🍎 Manzana normal: +10 puntos
- 🍏 Manzana verde: +20 puntos y velocidad extra
- ⚫ Manzana negra: -5 puntos ¡Evítala!

## Contribuir
¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el juego:
1. Haz un fork del repositorio
2. Crea una rama para tu función: `git checkout -b nueva-funcion`
3. Realiza tus cambios y haz commit: `git commit -m 'Añade nueva función'`
4. Empuja a la rama: `git push origin nueva-funcion`
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto
- GitHub: [@SkarGT23](https://github.com/SkarGT23)
