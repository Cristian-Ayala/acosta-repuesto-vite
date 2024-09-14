# Acosta Repuestos

![logo](./src/assets/img/acosta.webp)

# Go to README in english
English: (click here ➡)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Cristian-Ayala/acosta-repuesto-vite/blob/master/README.md)
> ACTUALMENTE LO ESTAS LEYENDO EN ESPAÑOL

## Table of Contents

- [Descripción](#descripción-de-la-aplicación)
- [Instalación](#instalación)
- [Funcionalidades](#funcionalidades)
   - [Instalar App](#instalar-app)
   - [Abrir App](#abrir-app)
   - [Barra Lateral](#barra-lateral)
   - [Selección de Área](#selección-de-área)
   - [Marcas](#marcas)
   - [Categorias](#categorias)
   - [Productos](#productos)
   - [Ordenes](#ordenes)
   - [Estadísticas](#estadísticas)
   - [Clientes](#clientes)
- [Contribuir](#contribuir)

## Descripción de la aplicación

La aplicación proporciona una plataforma integral para la gestión de múltiples aspectos comerciales, ofreciendo una amplia gama de funcionalidades y características avanzadas para optimizar la gestión empresarial.

### Gestión de Productos

Facilita la administración completa de productos, incluyendo la capacidad de agregar, editar y eliminar productos de manera intuitiva. Los usuarios pueden escanear códigos UPC (códigos de barras) mediante la cámara de su dispositivo móvil o conectar un escáner profesional para una entrada de datos rápida y precisa.

### Gestión de Marcas y Categorías

Permite crear, organizar y gestionar marcas y categorías para una clasificación eficiente de productos, proporcionando una estructura organizativa más sólida y fácil de navegar.

### Gestión de Clientes

Ofrece herramientas para registrar y administrar información detallada de clientes, incluyendo historiales de compras, preferencias y datos de contacto, permitiendo una relación más personalizada con los clientes.

### Gestión de Órdenes

Facilita un seguimiento exhaustivo de pedidos desde la recepción hasta la entrega. Los usuarios pueden gestionar pedidos pendientes, en proceso y completados.

### Estadísticas de Ventas

Proporciona análisis profundos de ventas y métricas clave para evaluar el rendimiento comercial y tomar decisiones estratégicas informadas.

### Gestión de Inventarios

Ofrece un control preciso del inventario, garantizando una gestión eficiente y en tiempo real del inventario.

### Separación de Productos por Sedes

Permite una gestión detallada y específica de productos en múltiples ubicaciones o sedes, asegurando un control efectivo de la disponibilidad y distribución de productos.

La aplicación está equipada con la capacidad de escanear códigos UPC utilizando la cámara del dispositivo móvil o conectando un escáner profesional, brindando a los usuarios flexibilidad y eficiencia en la entrada de datos. Esta característica agrega un nivel adicional de comodidad y precisión en la gestión de productos, mejorando la experiencia del usuario y optimizando los procesos comerciales.

## Instalación

Proporcione instrucciones paso a paso sobre cómo instalar o configurar su proyecto. Incluya los requisitos previos, las dependencias o la configuración del entorno necesarios.

### 1. Clonar los repositorios de GitHub:
   - [Frontend app](https://github.com/Cristian-Ayala/acosta-repuesto-vite/)
   - [NestJS backend](https://github.com/Cristian-Ayala/acosta-rep-backend)

### 2. Pasos de configuración:

#### Para el Frontend (Vite App):
1. Navegue hasta el directorio clonado `acosta-repuesto-vite`.
2. Crea un archivo `.env` en el directorio raíz si no existe.
3. Añada las siguientes variables al archivo `.env`:

```plaintext

# Hasura Integration
VITE_BACKEND_URL="<HASURA_URL>"

# NestJS Integration
VITE_FILE_MANAGER="<NESTJS_BACKEND_URL>/file-manager/"
```

#### Opcional: Integración con Sentry:
Si desea configurar Sentry para la notificación de errores, añada estas variables al archivo `.env`:

```plaintext
# Sentry Variables
VITE_SENTRY_TRACES_SAMPLE_RATE=1.0
VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE=1.0
VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE=1.0
VITE_SENTRY_TRACE_PROPAGATION_TARGET="https://yourserver.io/api/"
SENTRY_TELEMETRY=false # Set to true in production
VITE_SENTRY_DSN="NONE"
SENTRY_AUTH_TOKEN="NONE"
SENTRY_ORG="NONE"
SENTRY_PROJECT="NONE"
```

Sustituya los valores del marcador de posición por su configuración real.

### 3. Ejecución de los proyectos:

#### Para el Frontend:
1. Instale las dependencias: Ejecuta `npm install` o `yarn install`.
2. Inicia el servidor de desarrollo: Ejecuta `npm run dev` o `yarn dev`

#### Para el backend NestJS:
1. Navegue hasta el directorio clonado `acosta-rep-backend`.
2. Configure las variables de entorno requeridas por la aplicación NestJS.
3. Instale las dependencias: Ejecuta `npm install` o `yarn install`.
4. Iniciar el servidor: Ejecuta `npm run start` o `yarn start`.

### Recursos adicionales:
Por favor, asegúrese de reemplazar los marcadores de posición como `<HASURA_URL>`, `<NESTJS_BACKEND_URL>` con los valores reales obtenidos de sus configuraciones.

Consulte siempre la documentación del proyecto y los archivos README específicos en los repositorios para cualquier paso de configuración adicional o instrucciones específicas no cubiertas aquí.

## Funcionalidades

### Instalar App

#### Instalación desde el navegador
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/a3f94d86-cf25-48b4-94ec-8f8aaa15461e" height="500"/>
</p>

### Abrir App

#### Igual que otra aplicación
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/19048c0c-b0cf-4a96-821b-1543aaaedab0" height="500"/>
</p>

### Barra Lateral

#### Navegación fácil
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/d3813f9d-029e-4d14-81f3-400534c1801d" height="500"/>
</p>

### Selección de Área

#### Cambio de zona en función de dónde te encuentres
(vea cómo cambian las existencias de cada producto en función de la zona seleccionada)
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/eb0c1d71-e3bd-46ea-a9c5-8dc5520d158d" height="500"/>
</p>


### Marcas

#### Listar marcas
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/427c282e-f401-41ee-9fe7-c363cb97ded0" height="500"/>
</p>

#### Agregar marca
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/513d3cfb-8a6b-4f0e-8a0b-c73831adbf94" height="500"/>
</p>

#### Filtrar marcas
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/e6cfccb3-a6a1-4e56-948f-cb37bdf994a7" height="500"/>
</p>

#### Editar marcas
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/be38d110-0ecb-4cf2-b7c0-91096deddcd8" height="500"/>
</p>

#### Eliminar marcas
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/5f47b053-546a-4ba2-8e78-93415fcd0902" height="500"/>
</p>

### Categorias

#### Listar categorias
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/329786f7-8904-4351-a611-f2c23cf77646" height="500"/>
</p>

#### Agregar categoria
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/a3ac3210-2f87-41a8-b63f-45ba56570675" height="500"/>
</p>

#### Filtrar categorias
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/aa4cb2c8-2bae-419e-a030-bf6591c46b59" height="500"/>
</p>

#### Editar categorias
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/1acaefa2-18bf-4867-8525-ee7de84c39a0" height="500"/>
</p>

#### Eliminar categorias
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/171ad36b-dc51-4723-b4e9-1308bccee2aa" height="500"/>
</p>

### Productos

#### Crear productos
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/ae6f4773-a031-4df5-9005-1155ac94d04c" height="500"/>
</p>

#### Filtrar productos
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/c4c0f1ae-55fc-425b-8ed1-f44e6e0ce654" height="500"/>
</p>

#### Editar productos
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/acc4775b-3647-4489-95c0-72068913f598" height="500"/>
</p>

#### Eliminar productos
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/300b93ba-76c7-4221-bacc-0cd3a5bde374" height="500"/>
</p>

#### Impedir la creación o modificación si el identificador UPC ya existe
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/8639a68b-b959-45d6-851b-358a7cc31c5e" height="500"/>
</p>

### Ordenes

#### Crear orden dentro del local
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/0cffa2f5-c084-4114-aefb-4c4074ef19f8" height="500"/>
</p>

#### Crear orden para entregar (delivery)
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/6fd4bd22-732b-4d00-88e4-d70f9e0d24b2" height="500"/>
</p>

#### Filtrar ordenes
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/1fbc412a-07c3-41fe-944f-f3342f7800f7" height="500"/>
</p>

### Estadísticas

#### Obtener Estadísticas
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/131ff0b4-9a32-4ac2-bf1a-d5971617049f" height="500"/>
</p>

### Clientes

#### Listar todos los clientes
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/57f70938-daa2-42b9-8bb8-c6b4c1155c9b" height="500"/>
</p>

#### Agregar cliente
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/6e9d840f-7bd1-473d-a34a-ee29e48b5e77" height="500"/>
</p>

#### Filtrar clientes
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/39798989-802c-4df2-b60c-328d843152fb" height="500"/>
</p>

#### Editar clientes
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/2fd6c153-922d-4989-ac49-a6d331c3d22e" height="500"/>
</p>

#### Eliminar clientes
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/6b87b056-a08e-4e11-9259-6a765f7f9297" height="500"/>
</p>

## Contribuir

- Informar de problemas
- Realizar mejoras o añadir nuevas funciones
- Envío de pull requests
- Formateo del código y guías de estilo
- Ampliar o corregir README