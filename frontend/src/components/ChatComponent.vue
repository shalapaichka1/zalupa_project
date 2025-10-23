<script setup lang="js">

import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
const isChatOpen = ref(true)
const limitCounter = ref(0)
const userChatColor = ref('#6441a5')
const messages = ref([
  
])
const newMessage = ref({
  name: '',
  text: ''
})

function funcLimitCounter() {
  limitCounter.value = document.querySelector('.chat-footer-input').value.length
}

function hideChat() {
  const chat = document.querySelector('.chat')
  const hideChat = document.querySelector('.hide-chat')
  const videoMainArea = document.querySelector('.video-main-area')

  chat.style.transition = '.2s'
  if (isChatOpen.value) {
    chat.style.width = '0'
    chat.style.left = '100px'
    hideChat.style.transform = 'rotate(180deg)'
    videoMainArea.style.width = '100%'

  }
  else {
    chat.style.width = '400px'
    chat.style.left = '0'
    hideChat.style.transform = 'rotate(0deg)'
    videoMainArea.style.width = 'calc(100% - 400px)'
  }
  isChatOpen.value = !isChatOpen.value
}

function sendMessage() {
  if (limitCounter.value !== 0) {
    messages.value.push({
    id: Date.now(),
    name: newMessage.value.name,
    text: newMessage.value.text
  })
  newMessage.value = {
    name: '',
    text: ''
    }
  }
  const sendedMessage = document.querySelector('.chat-footer-input').value
  addMessageToChat(sendedMessage, useAuthStore().getCookie('userNickname'));
  limitCounter.value = 0
}

const savedMessages = localStorage.getItem('chatMessages');

let chatMessages = savedMessages ? JSON.parse(savedMessages) : [];

function addMessageToChat(message, sender) {
  chatMessages.push({ message, sender });
  localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
}

function getChatMessages() {
  return chatMessages;
}

const allMessages = getChatMessages();
console.log(allMessages);



</script>

<template>
    <div class="chat">
        <div class="chat-header">
            <img @click="hideChat" class="hide-chat" src="../images/hide-chat.svg" alt="" title="Скрыть">
            <h1>Общий чат</h1>
        </div>

        <div class="chat-body">
            <div class="chat-message" v-for="message in allMessages">
              <p class="chat-message-user">{{ message.sender }}: </p>{{ message.message }}
              <div class="chat-message-options">...</div>
            </div>
        </div>

        <div class="chat-footer">
            <input v-model="newMessage.text" @keyup.enter="sendMessage" maxlength="250" class="chat-footer-input" type="text" placeholder="Сообщение" @input="funcLimitCounter">
            <p class="chat-footer-limit-counter">{{limitCounter}}/250</p>
            <button @click="sendMessage" class="chat-footer-button">го</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../assets/main.scss';

.chat {
    float: right;
    position: relative;
    background-color: $secondBlack;
    width: 400px;
    height: 100%;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    height: 60px;
    font-family: 'RaleWay', sans-serif;
    color: white;
    font-size: 14px;
    letter-spacing: 5px;
    align-items: center;
    gap: 10px;
    background-color: #232323;
    align-items: center;
    justify-content: center;
    cursor: default;
  }
  
  .chat-body {
    flex-direction: column-reverse;
    justify-content: flex-end;
    padding: 10px;
    color: white;
    font-family: 'RaleWay-SemiBold', sans-serif;
    height: calc(100vh - 220px);
    overflow-y: auto;
  }
  
  .chat-message {
    font-size: 12px;
    flex-wrap: wrap;
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
    background-color: #151515;
    padding: 5px 15px ;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;

    &:hover {
      background-color: #303030;
    }
  }
  
  .chat-footer {
    padding: 5px;
    position: relative;
    bottom: 0px;
    height: 100px;
    width: 100%;
    background-color: #232323;
    display: flex;
  }
  
  .chat-footer-input {
    margin-right: 5px;
    border: 1px solid $twitchColor;
    height: 40px;
    width: 100%;
    border-radius: 5px;
    padding: 5px 15px;
    font-size: 14px;
    font-family: 'RaleWay', sans-serif;
    background-color: $thirdBlack;
    color: white;
    outline: none;
  }
  
  .chat-footer-limit-counter {
    color: $twitchColor;
    font-size: 12px;
    font-family: 'RaleWay-SemiBold', sans-serif;
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  
  .hide-chat {
    border: 1px solid $twitchColor;
    background-color: $thirdBlack;
    padding: 5px;
    position: relative;
    border-radius: 5px;
    left: -60px;
    z-index: 2;
    cursor: pointer;
    
    &:hover {
      transition: all .2s;
      scale: 1.1;
    }
    &:active {
      transition: all .2s;
      scale: 1;
    }
  }

  .chat-message-user {
    font-size: 14px;
    cursor: pointer;
    font-family: 'RaleWay-SemiBold', sans-serif;
    color: #26b821;
    border-radius: 3px;
    padding: 2px 2px;

    &:hover {
      background-color: #4e4e4e;
    }
  }

  .chat-footer-button {
    height: 40px;
  }

  .chat-message-options {
    cursor: pointer;
    color: $twitchColor;
    position: relative;
    font-size: 12px;
    font-family: 'RaleWay-SemiBold', sans-serif;
    float: right;

    &:hover {
      transition: all .2s;
      scale: 1.1;
    }
    &:active {
      transition: all .2s;
      scale: 1;
    }
  }
</style>