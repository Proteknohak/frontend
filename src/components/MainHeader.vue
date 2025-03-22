<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const systemLang = ref('ru')

  const fullLang = new Map()
  fullLang.set('ru', 'Русский')
  fullLang.set('en', 'English')

  const router = useRouter()
</script>

<template>
  <header>
    <div class="logo">
      <img src="../assets/logo.svg" alt="Connecto Logo" @click="router.push('/')" />
    </div>
    <div class="lecture-title" v-if="router.currentRoute.value.name === 'room'">Лекция первая</div>
    <div class="lang-dropdown">
      <p>{{ fullLang.get(systemLang) }}</p>
      <button class="lang-dropdown-btn">
        <img src="../assets/translate.svg" alt="Выбор языка" />
      </button>
      <div class="lang-dropdown-content">
        <a @click="systemLang = 'ru'">Русский</a>
        <a @click="systemLang = 'en'">English</a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 5px 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Улучшенная тень */
    border-bottom: 1px solid #e0e0e0; /* Лёгкая линия внизу */
  }

  .logo img {
    height: 40px;
    width: auto;
    border-radius: 8px; /* Красивая форма */
  }

  .lecture-title {
    color: #333;
    text-align: center;
    flex: 1;
    margin: 0 20px;
    padding: 5px;
    border-radius: 8px;
  }

  .lang-dropdown {
    position: relative;
    display: inline-block;
  }

  .lang-dropdown-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .lang-dropdown-btn img {
    height: 24px;
    width: auto;
  }

  .lang-dropdown-content {
    display: none;
    position: absolute;
    top: 80%;
    right: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    z-index: 10;
    min-width: 100px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Тень для дропдауна */
    padding: 10px;
  }

  .lang-dropdown-content a {
    display: block;
    padding: 8px 12px;
    text-decoration: none;
    color: #333;
    transition: background-color 0.2s ease;
    border-radius: 6px;
  }

  .lang-dropdown-content a:hover {
    background-color: #f2f2f2;
  }

  .lang-dropdown:hover .lang-dropdown-content {
    display: block;
  }

  .lang-dropdown-btn:hover {
    transform: scale(1.1); /* Анимация при наведении на кнопку */
  }
</style>
