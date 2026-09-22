# D&D Character Creator

Prototipo funcional para crear personajes de **Dungeons & Dragons 5ta Edición**. La aplicación separa la Vista, el Controlador y el Modelo mediante una arquitectura MVC distribuida entre un frontend React y un backend FastAPI.

## 1. Tecnologías utilizadas

### Backend

- **Python 3.13**: lenguaje principal del backend.
- **FastAPI 0.111.0**: framework para construir la API REST asíncrona.
- **Uvicorn**: servidor ASGI para ejecutar FastAPI.
- **Pydantic 2.8.2**: validación y serialización de los modelos de datos.
- **Persistencia en memoria**: repositorio interno para que el prototipo funcione sin depender de MongoDB durante la demostración.

### Frontend

- **React 18**: construcción de la interfaz y manejo del estado.
- **Vite**: servidor de desarrollo y herramienta de compilación.
- **Tailwind CSS**: estilos utilitarios y diseño responsive.
- **Axios**: cliente HTTP para comunicarse con FastAPI.

## 2. Funcionalidades

- Crear personajes con nombre, raza, clase y nivel.
- Validar niveles entre 1 y 20.
- Validar atributos entre 8 y 20.
- Calcular automáticamente los modificadores de D&D 5e:

```text
modificador = floor((atributo - 10) / 2)
```

- Consultar la lista de personajes creados.
- Mantener los datos durante la ejecución actual del backend.

> Como se utiliza persistencia en memoria, los personajes se eliminan cuando se reinicia el backend. MongoDB puede incorporarse posteriormente reemplazando el repositorio sin cambiar los endpoints ni la lógica de la aplicación.

## 3. Arquitectura MVC

El patrón **Model-View-Controller** se distribuye de esta forma:

### Model

- [backend/models.py](backend/models.py): define `AttributesBase`, `CharacterCreate`, `CharacterResponse` y los modificadores mediante Pydantic.
- [backend/database.py](backend/database.py): contiene el repositorio de persistencia en memoria.

### View

- [frontend/src/App.jsx](frontend/src/App.jsx): coordina la pantalla principal y el estado de la aplicación.
- [frontend/src/components/CharacterForm.jsx](frontend/src/components/CharacterForm.jsx): formulario para crear personajes.
- [frontend/src/components/CharacterList.jsx](frontend/src/components/CharacterList.jsx): renderizado de las tarjetas recibidas desde la API.

### Controller

- [backend/routes.py](backend/routes.py): expone `POST /characters` y `GET /characters`, y delega la lógica al servicio.
- [backend/main.py](backend/main.py): configura FastAPI, CORS y el router.

### Service

- [backend/services.py](backend/services.py): contiene la lógica de negocio, incluyendo el cálculo de modificadores y la coordinación entre la Factory y el repositorio.

## 4. Patrones de diseño implementados

### 4.1 MVC

La aplicación separa responsabilidades entre frontend y backend. El frontend funciona como Vista; FastAPI recibe las peticiones mediante los Controladores; los modelos Pydantic y el servicio representan el Modelo y la lógica de negocio.

Referencias exactas:

- Modelo Pydantic: [backend/models.py](backend/models.py).
- Servicio: [backend/services.py](backend/services.py#L6-L8).
- Controlador: [backend/routes.py](backend/routes.py#L6-L7).
- Configuración y composición de la aplicación: [backend/main.py](backend/main.py#L6-L7).

### 4.2 Singleton

`CharacterMemoryRepository` implementa un Singleton para garantizar que exista una sola instancia del repositorio en memoria durante la vida del proceso. El método `__new__` crea la instancia una única vez y después devuelve siempre la misma referencia.

Referencias exactas:

- Declaración de la clase: [backend/database.py](backend/database.py#L8-L9).
- Instancia única: [backend/database.py](backend/database.py#L11-L17).
- Uso del Singleton para insertar datos: [backend/database.py](backend/database.py#L30-L31).
- Uso del Singleton para consultar datos: [backend/database.py](backend/database.py#L34-L35).

Esto evita tener varios repositorios con listas de personajes diferentes dentro de la misma ejecución.

### 4.3 Factory

`CharacterFactory` centraliza la creación de documentos persistibles y de respuestas `CharacterResponse`. De esta manera, el servicio no necesita conocer todos los detalles de construcción de cada representación del personaje.

Referencias exactas:

- Declaración de la Factory: [backend/services.py](backend/services.py#L11-L12).
- Creación del documento: [backend/services.py](backend/services.py#L14-L23).
- Creación de la respuesta: [backend/services.py](backend/services.py#L25-L27).
- Uso al crear personajes: [backend/services.py](backend/services.py#L51-L57).
- Uso al listar personajes: [backend/services.py](backend/services.py#L60-L62).

## 5. Estructura principal

```text
dnd-character-creator/
|-- backend/
|   |-- database.py       # Singleton y persistencia en memoria
|   |-- main.py           # Configuración de FastAPI y CORS
|   |-- models.py         # Modelos Pydantic
|   |-- routes.py         # Controladores y endpoints
|   |-- services.py       # Lógica D&D y Factory
|   |-- requirements.txt
|-- frontend/
|   |-- src/
|       |-- App.jsx
|       |-- api.js
|       |-- components/
|           |-- CharacterForm.jsx
|           |-- CharacterList.jsx
|-- .env.example
|-- .gitignore
|-- README.md
```

## 6. Requisitos previos

- Python 3.13 o superior compatible con las dependencias del proyecto.
- Node.js y npm.
- PowerShell en Windows, Terminal en macOS/Linux o equivalente.
- No se necesita MongoDB para ejecutar esta versión del prototipo.

## 7. Instalación y ejecución

### Backend

Desde la carpeta raíz del proyecto:

```powershell
cd "C:\Projects\DnD Creator\dnd-character-creator"

# Crear el entorno virtual solo la primera vez
python -m venv .venv

# Activarlo en PowerShell
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
python -m pip install -r backend\requirements.txt

# Iniciar la API
cd backend
python -m uvicorn main:app --reload --port 8000
```

La API quedará disponible en:

- http://127.0.0.1:8000/
- Documentación interactiva: http://127.0.0.1:8000/docs

### Frontend

Abre una segunda terminal:

```powershell
cd "C:\Projects\DnD Creator\dnd-character-creator\frontend"
npm install
npm run dev
```

La interfaz quedará disponible en:

- http://127.0.0.1:5173/

## 8. Endpoints

### `POST /characters`

Ejemplo de solicitud:

```json
{
  "name": "Aria",
  "race": "Humana",
  "class": "Guerrera",
  "level": 1,
  "attributes": {
    "strength": 16,
    "dexterity": 12,
    "constitution": 14,
    "intelligence": 8,
    "wisdom": 10,
    "charisma": 18
  }
}
```

La respuesta incluye los modificadores calculados:

```json
{
  "strength": 3,
  "dexterity": 1,
  "constitution": 2,
  "intelligence": -1,
  "wisdom": 0,
  "charisma": 4
}
```

### `GET /characters`

Devuelve todos los personajes almacenados en el repositorio Singleton durante la ejecución actual.

## 9. Justificación técnica

Este prototipo resuelve un problema sencillo pero representativo: permitir que una persona cree personajes de D&D sin realizar manualmente las validaciones ni los cálculos de atributos. La selección tecnológica busca mantener una separación clara entre la interfaz, la API y la lógica del dominio, al mismo tiempo que permite ejecutar el proyecto con una configuración local pequeña.

### Selección del backend

Se eligió Python con FastAPI porque FastAPI permite definir endpoints REST de forma concisa y ofrece soporte asíncrono, validación automática y documentación OpenAPI generada por defecto. Esto resulta útil para un prototipo distribuido: el frontend no necesita conocer detalles internos del cálculo de modificadores y puede consumir una interfaz HTTP estable. La documentación disponible en `/docs` facilita probar los endpoints y demostrar el funcionamiento del backend sin construir herramientas adicionales.

Pydantic se utiliza para expresar las reglas del modelo. `CharacterCreate` valida que existan nombre, raza, clase, nivel y atributos; `Field` restringe el nivel al rango 1–20 y cada atributo al rango 8–20. Esta validación ocurre antes de ejecutar la lógica de negocio, por lo que evita que el servicio tenga que repetir comprobaciones básicas y mantiene un contrato consistente entre frontend y backend.

Inicialmente se contempló MongoDB, pero la conexión externa presentó problemas de autenticación durante la ejecución del prototipo. Por esa razón se eligió un repositorio en memoria como sustituto temporal. Esta decisión permite demostrar el flujo completo de creación y consulta sin que una credencial, una IP autorizada o un servicio externo impida evaluar la aplicación. El repositorio conserva una interfaz asíncrona y aislada, así que posteriormente puede reemplazarse por Motor o PyMongo sin modificar los controladores ni la vista. La principal limitación es que los datos no sobreviven al reinicio del proceso.

### Selección del frontend

React se eligió porque permite dividir la Vista en componentes con responsabilidades claras. `CharacterForm` gestiona la captura de datos y `CharacterList` representa la colección recibida del backend. `App` coordina el estado y las llamadas HTTP. Esta división facilita mantener el código y permite ampliar el prototipo con edición, eliminación o filtros sin convertir un único componente en una pieza difícil de mantener.

Vite proporciona un servidor de desarrollo rápido y una compilación sencilla. Tailwind CSS reduce el tiempo necesario para construir una interfaz responsive y mantiene los estilos cerca de los componentes. Axios centraliza la configuración del cliente HTTP en `api.js`, evitando repetir la URL base y haciendo más fácil cambiarla cuando la aplicación se despliegue en otro entorno.

### Justificación de MVC

MVC es adecuado porque el problema tiene tres responsabilidades diferentes. La Vista se ocupa de la interacción y presentación; el Controlador recibe las peticiones HTTP; y el Modelo representa los datos junto con la lógica relacionada con el dominio. En este proyecto, el servicio funciona como una capa adicional de aplicación para que los controladores permanezcan delgados. El endpoint no calcula modificadores ni construye manualmente documentos: recibe el modelo validado y delega esa tarea.

Esta separación también representa la distribución solicitada. La Vista vive en React, mientras que los modelos, controladores y servicios viven en FastAPI. El contrato HTTP conecta ambas partes y permite desarrollar o reemplazar una capa sin reescribir completamente la otra.

### Justificación del Singleton

El Singleton se aplicó al repositorio de memoria porque el prototipo necesita una única fuente de datos dentro del proceso. Si cada llamada creara un repositorio nuevo, la lista de personajes podría reiniciarse accidentalmente y un personaje creado por `POST /characters` no estaría disponible para `GET /characters`. `CharacterMemoryRepository` centraliza el estado y sus operaciones asíncronas ofrecen un punto de sustitución claro para una base de datos real.

El patrón se utiliza de manera acotada: solo controla el repositorio temporal, no toda la aplicación. Esto evita convertir el Singleton en una dependencia global innecesaria y deja la lógica de negocio en `services.py`.

### Justificación del Factory

El Factory se aplicó porque un personaje tiene varias representaciones: datos de entrada, documento almacenado y respuesta pública. `CharacterFactory` concentra la creación del documento y de `CharacterResponse`, evitando duplicación en los métodos de servicio. Si más adelante se agregan campos calculados, una representación para exportación o distintos tipos de personajes, la construcción puede evolucionar dentro de la Factory sin llenar los controladores de condicionales.

En conjunto, MVC organiza las responsabilidades generales, Singleton controla la única fuente de datos del prototipo y Factory centraliza la construcción de objetos. Los tres patrones se complementan sin introducir una infraestructura excesiva para el tamaño de la aplicación.

## 10. Limitaciones y mejoras futuras

- Sustituir el repositorio en memoria por MongoDB cuando las credenciales y la red estén configuradas.
- Agregar persistencia de usuarios y autenticación.
- Añadir edición y eliminación de personajes.
- Añadir pruebas automatizadas para validaciones, modificadores y endpoints.
- Configurar variables de entorno separadas para desarrollo y producción.
- Restringir CORS a los dominios reales cuando la aplicación se despliegue.
