<template>
  <nav>
    <router-link to="/">Tabelle</router-link> |
    <router-link to="/about">Grafici</router-link> |
    <router-link to="/tabclass">Tabella Classifica</router-link> |
    <router-link to="">Grafici Regioni</router-link> |
    <router-link to="">Tabelle Regioni</router-link> |
    <router-link to="/grafclass">Grafico Classifica</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #00bfff; /* Colore del testo azzurro */
  background-color: white; /* Sfondo bianco */
  border: 2px solid #00bfff; /* Contorno azzurro */
  padding: 10px 20px; /* Spaziatura interna per sembrare un bottone */
  text-decoration: none; /* Rimuove la sottolineatura */
  border-radius: 5px; /* Angoli arrotondati */
  transition: background-color 0.3s ease; /* Transizione per il cambio di sfondo */
}

nav a:hover {
  background-color: #dcdcdc; 
}

nav a.router-link-exact-active {
  color: #000000; /* Mantiene il colore originale per il link attivo */
}
</style>
