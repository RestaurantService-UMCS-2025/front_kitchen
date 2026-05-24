# ETAP 1: Budowanie aplikacji
FROM node:20-alpine AS builder

WORKDIR /app

# UWAGA: Kopiujemy pliki konfiguracyjne z podkatalogu 'kitchen-nightmare'
COPY kitchen-nightmare/package*.json ./

# Instalujemy zależności
RUN npm install

# UWAGA: Kopiujemy resztę kodu z podkatalogu 'kitchen-nightmare' do kontenera
COPY kitchen-nightmare/ .

# Budujemy wersję produkcyjną (utworzy się katalog /app/dist wewnątrz kontenera)
RUN npm run build

# ETAP 2: Lekki serwer produkcyjny
FROM node:20-alpine

WORKDIR /app

# Instalujemy globalnie lekki serwer 'serve'
RUN npm install -g serve

# Kopiujemy tylko zbudowane pliki z etapu pierwszego
COPY --from=builder /app/dist ./dist

# Informujemy, że kontener nasłuchuje na porcie 8080 (zgodnie z poprzednim ustaleniem)
EXPOSE 8080

# Uruchamiamy serwer.
CMD ["serve", "-s", "dist", "-l", "8080"]