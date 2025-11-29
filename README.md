# Emago CORS Proxy

Ez egy egyszerű Node.js proxy szerver a `cors-anywhere` csomag használatával, kifejezetten az Emago UXP pluginhoz.
Célja, hogy áthidalja az UXP környezet korlátait (CORS, WebSocket headerek) az Appwrite Realtime kapcsolat során.

## Telepítés Render-re

1.  Töltsd fel ezt a `proxy-server` mappát egy új GitHub repository-ba (vagy a meglévőbe).
2.  Regisztrálj a [Render.com](https://render.com)-on.
3.  Hozz létre egy új **Web Service**-t.
4.  Válaszd ki a GitHub repository-t.
5.  A beállításoknál:
    *   **Root Directory:** `proxy-server` (FONTOS! Mivel alkönyvtárban van)
    *   **Environment:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
6.  Kattints a **Create Web Service** gombra.

## Ébren tartás (Ingyenes csomaghoz)

A Render ingyenes csomagja 15 perc inaktivitás után elalszik. Hogy ezt elkerüld:

1.  Regisztrálj az [UptimeRobot](https://uptimerobot.com)-on (ingyenes).
2.  Adj hozzá egy új **HTTP(s)** monitort.
3.  URL-nek add meg a Render-es címedet a `/health` végponttal:
    `https://te-app-neved.onrender.com/health`
4.  Intervallum: **5 perc**.

Így a proxy mindig ébren marad és azonnal reagál.
