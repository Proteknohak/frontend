<script setup>
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n();
</script>

<template>
  <footer>
    <div class="footer-group footer-group-left">
      <button class="footer-btn footer-btn-round">
        <img src="../assets/link.svg" alt="Button 1" />
      </button>
    </div>
    <div class="footer-group footer-group-center">
      <button class="footer-btn footer-btn-pill">
        {{t('broadcast')}}
        <img src="../assets/tv.svg" alt="Button 3" />
      </button>
      <button class="footer-btn footer-btn-round use">
        <img src="../assets/video.svg" alt="Button 4" />
      </button>
      <button class="footer-btn footer-btn-round use">
        <img src="../assets/mic.svg" alt="Button 5" />
      </button>
      <button class="footer-btn footer-btn-pill">
        {{t('users')}}
        <img src="../assets/users.svg" alt="Button 6" />
      </button>
      <button class="footer-btn footer-btn-pill">
        {{t('chat')}}
        <img src="../assets/chat.svg" alt="Button 7" />
      </button>
    </div>
    <div class="footer-group footer-group-right">
      <button class="footer-btn footer-btn-round">
        <img src="../assets/more-vertical.svg" alt="Button 8" />
      </button>
      <button class="footer-btn footer-btn-round">
        <img src="../assets/leave.svg" alt="Button 9" />
      </button>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  $primary-color: #9770c0;
  $secondary-color: #ece6f0;
  $text-color: #333;
  $hover-color: #e8e8e8;
  footer {
    background-color: $secondary-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .footer-group {
    display: flex;
    align-items: center;
  }

  .footer-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    margin: 0 5px;
    background-color: #fff;
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
    padding: 12px;
    border-radius: 8px;
  }

  .footer-btn:hover {
    background-color: $hover-color;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .footer-btn-round {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .use {
    background-color: #9770c0;
  }

  .footer-btn-pill {
    font-size: 14px;
    border-radius: 25px;
    padding: 12px 25px;
  }

  .footer-btn img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
</style>
