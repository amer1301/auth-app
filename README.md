# Skyddad Inloggningsapplikation (Node.js + MongoDB)

Detta projekt är en enkel användarautentiseringstjänst byggd med **Node.js**, **Express**, **MongoDB** och **JWT (JSON Web Tokens)**. Applikationen tillåter användare att registrera sig, logga in och få tillgång till en skyddad route om de har en giltig JWT-token.

## API-dokumentation (URI:er)
Alla endpoints prefixas med /api.

Metod	Endpoint	Beskrivning
POST	/api/register	Registrerar en ny användare
POST	/api/login	Loggar in en användare och returnerar token
GET	/api/protected	Returnerar skyddad data (kräver JWT-token)

## Exempel: Registrera användare
POST /api/register
{
  "username": "testuser",
  "password": "hemligt"
}

Svar:
{ "message": "Användare skapad" }

## Exempel: Logga in
POST /api/login
{
  "username": "testuser",
  "password": "hemligt"
}

Svar:
{
  "response": {
    "message": "Användare inloggad!",
    "token": "JWT_TOKEN",
    "created": "2025-05-14T10:12:34.567Z"
  }
}

## Exempel: Skyddad resurs
GET /api/protected

Header:
Authorization: Bearer JWT_TOKEN

Svar:
{ "message": "Välkommen testuser" }

## Säkerhet
Lösenord sparas aldrig i klartext (hashas med bcrypt).
JWT-token är tidsbegränsad (1h).
Endast skyddade rutter kräver token.
