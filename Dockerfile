# Usa una imagen de Node para construir la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build  # Asegúrate de que el comando build genere los archivos en el directorio "dist"

# Usa una imagen ligera de servidor web para servir la app
FROM nginx:stable-alpine

# Copia los archivos de la build al directorio de NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para acceder a la aplicación
EXPOSE 80

# Inicia NGINX
CMD ["nginx", "-g", "daemon off;"]