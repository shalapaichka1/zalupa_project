<template>
    <h1 class="in-development">В РАЗРАБОТКЕ</h1>
    <a href="/" class="in-development-button">Вернуться на главную </a>
</template>

<style scoped>
@import '../assets/base.scss';

.in-development {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    FONT-SIZE: 60px;
    color: #6441A5;
    font-family: 'Raleway-SemiBold', sans-serif;
    text-align: center;
}

.in-development-button {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    FONT-SIZE: 20px;
    color: #6441A5;
    font-family: 'Raleway-SemiBold', sans-serif;
    text-align: center;
}

a:hover {
    cursor: pointer;
    text-decoration: underline;

}
</style>