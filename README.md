# Acosta Repuestos

![logo](./src/assets/img/acosta.webp)

# Ir a leer README en español
Idioma español: (haz click ➡)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/Cristian-Ayala/acosta-repuesto-vite/blob/master/README.es.md)
> YOUR ARE CURRENTLY READING IT IN ENGLISH

## Table of Contents

- [Description](#description-of-the-application)
- [Installation](#installation)
- [Functionalities](#functionalities)
   - [Install App](#install-app)
   - [Open App](#open-app)
   - [SideBar](#sideBar)
   - [Area selection](#area-selection)
   - [Brands](#brands)
   - [Categories](#categories)
   - [Products](#products)
   - [Orders](#orders)
   - [Statistics](#statistics)
   - [Clients](#clients)
- [Contributing](#contributing)

## Description of the application

The application provides a comprehensive platform for managing multiple business aspects, offering a wide range of functionalities and advanced features to optimize business management.

### Product Management

Facilitates complete product management, including the ability to intuitively add, edit and delete products. Users can scan UPC codes (barcodes) using their mobile device's camera or connect a professional scanner for fast and accurate data entry.

### Brand and Category Management

Allows you to create, organize and manage brands and categories for efficient product classification, providing a more robust and easy-to-navigate organizational structure.

### Customer Management

Provides tools to record and manage detailed customer information, including purchase histories, preferences and contact details, enabling a more personalized relationship with customers.

### Order Management

Facilitates comprehensive order tracking from receipt to delivery. Users can manage pending, in-process and completed orders.

### Sales Statistics

Provides in-depth sales analysis and key metrics to evaluate business performance and make informed strategic decisions.

### Inventory Management

Provides precise inventory control, ensuring efficient, real-time inventory management.

### Product segregation by location

Allows detailed and specific management of products across multiple locations, ensuring effective control of product availability and distribution.

The application is equipped with the ability to scan UPC codes using the mobile device's camera or by connecting a professional scanner, providing users with flexibility and efficiency in data entry. This feature adds an additional level of convenience and accuracy to product management, enhancing the user experience and optimizing business processes.

## Installation

Provide step-by-step instructions on how to install or set up your project. Include any prerequisites, dependencies, or environment setup required.

### 1. Clone the GitHub repositories:
   - [Frontend app](https://github.com/Cristian-Ayala/acosta-repuesto-vite/)
   - [NestJS backend](https://github.com/Cristian-Ayala/acosta-rep-backend)

### 2. Configuration Steps:

#### For the Frontend (Vite App):
1. Navigate to the cloned `acosta-repuesto-vite` directory.
2. Create a `.env` file in the root directory if it doesn't exist.
3. Add the following variables to the `.env` file:

```plaintext
# Auth0 Integration
VITE_CLIENT_ID="<YOUR_AUTH0_CLIENT_ID>"
VITE_DOMAIN="<YOUR_AUTH0_DOMAIN>"

# Hasura Integration
VITE_BACKEND_URL="<HASURA_URL>"

# NestJS Integration
VITE_FILE_MANAGER="<NESTJS_BACKEND_URL>/file-manager/"
```

#### Optional: Sentry Integration:
If you want to set up Sentry for error reporting, add these variables to the `.env` file:

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

Replace the placeholder values with your actual configuration.

### 3. Running the projects:

#### For the Frontend:
1. Install dependencies: Run `npm install` or `yarn install`.
2. Start the development server: Run `npm run dev` or `yarn dev`.

#### For the NestJS Backend:
1. Navigate to the cloned `acosta-rep-backend` directory.
2. Set up the environment variables required by the NestJS application.
3. Install dependencies: Run `npm install` or `yarn install`.
4. Start the server: Run `npm run start` or `yarn start`.

### Additional Resources:
- [Hasura Documentation for integrating Auth0](https://hasura.io/learn/graphql/hasura/authentication/1-create-auth0-app/)

Please ensure to replace placeholders like `<YOUR_AUTH0_CLIENT_ID>`, `<YOUR_AUTH0_DOMAIN>`, `<HASURA_URL>`, `<NESTJS_BACKEND_URL>` with the actual values obtained from your configurations.

Always refer to the project's documentation and specific README files in the repositories for any additional setup steps or specific instructions not covered here.

## Functionalities

### Install App

#### Instalation from browser
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/a3f94d86-cf25-48b4-94ec-8f8aaa15461e" height="500"/>
</p>

### Open App

#### Just like another app
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/19048c0c-b0cf-4a96-821b-1543aaaedab0" height="500"/>
</p>

### SideBar

#### Easy Navigation
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/d3813f9d-029e-4d14-81f3-400534c1801d" height="500"/>
</p>

### Area selection

#### Change area depending on where you are
(see how the stock from each product changes depending on the area selected)
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/eb0c1d71-e3bd-46ea-a9c5-8dc5520d158d" height="500"/>
</p>


### Brands

#### List all brands
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/427c282e-f401-41ee-9fe7-c363cb97ded0" height="500"/>
</p>

#### Add brand
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/513d3cfb-8a6b-4f0e-8a0b-c73831adbf94" height="500"/>
</p>

#### Filter brands
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/e6cfccb3-a6a1-4e56-948f-cb37bdf994a7" height="500"/>
</p>

#### Edit brands
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/be38d110-0ecb-4cf2-b7c0-91096deddcd8" height="500"/>
</p>

#### Delete brands
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/5f47b053-546a-4ba2-8e78-93415fcd0902" height="500"/>
</p>

### Categories

#### List all categories
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/329786f7-8904-4351-a611-f2c23cf77646" height="500"/>
</p>

#### Add category
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/a3ac3210-2f87-41a8-b63f-45ba56570675" height="500"/>
</p>

#### Filter categories
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/aa4cb2c8-2bae-419e-a030-bf6591c46b59" height="500"/>
</p>

#### Edit categories
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/1acaefa2-18bf-4867-8525-ee7de84c39a0" height="500"/>
</p>

#### Delete categories
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/171ad36b-dc51-4723-b4e9-1308bccee2aa" height="500"/>
</p>

### Products

#### Create products
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/ae6f4773-a031-4df5-9005-1155ac94d04c" height="500"/>
</p>

#### Filter products
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/c4c0f1ae-55fc-425b-8ed1-f44e6e0ce654" height="500"/>
</p>

#### Edit products
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/acc4775b-3647-4489-95c0-72068913f598" height="500"/>
</p>

#### Delete products
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/300b93ba-76c7-4221-bacc-0cd3a5bde374" height="500"/>
</p>

#### Prevent creation or modification if UPC id duplicated
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/8639a68b-b959-45d6-851b-358a7cc31c5e" height="500"/>
</p>

### Orders

#### Create local order
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/0cffa2f5-c084-4114-aefb-4c4074ef19f8" height="500"/>
</p>

#### Create order with delivery option
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/6fd4bd22-732b-4d00-88e4-d70f9e0d24b2" height="500"/>
</p>

#### Filter orders
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/1fbc412a-07c3-41fe-944f-f3342f7800f7" height="500"/>
</p>

### Statistics

#### Get statistics
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/131ff0b4-9a32-4ac2-bf1a-d5971617049f" height="500"/>
</p>

### Clients

#### List all clients
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/57f70938-daa2-42b9-8bb8-c6b4c1155c9b" height="500"/>
</p>

#### Add client
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/6e9d840f-7bd1-473d-a34a-ee29e48b5e77" height="500"/>
</p>

#### Filter clients
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/39798989-802c-4df2-b60c-328d843152fb" height="500"/>
</p>

#### Edit clients
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/2fd6c153-922d-4989-ac49-a6d331c3d22e" height="500"/>
</p>

#### Delete clients
<p align="center">
  <img src="https://github.com/Cristian-Ayala/acosta-repuesto-vite/assets/41448429/6b87b056-a08e-4e11-9259-6a765f7f9297" height="500"/>
</p>

## Contributing

- Reporting issues
- Making enhancements or adding new features
- Submitting pull requests
- Code formatting and style guides
- Add or correct README
