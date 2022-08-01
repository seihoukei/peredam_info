<script>
    import {fade} from "svelte/transition"

    import Transitions from "utility/transitions.js"
    import appState from "stores/app-state.js"

    const PAGES = {
        'anon' : 'Анонимная передача - Выбор города',
        'anon/city' : 'Анонимная передача - Выбор поставщика',
        'anon/prov' : 'Анонимная передача - Заполнение данных и передача',
        'user' : 'Список систем',
        'user/sys' : 'Просмотр системы',
        'user/sys/edit' : 'Правка системы',
        'user/sys/send' : 'Передача показаний',
        'add' : 'Добавление - Выбор города',
        'add/city' : 'Добавление - Выбор поставщика',
        'add/prov' : 'Добавление - Заполнение данных пользователя',
        'info' : 'Информация',
        'conf' : 'Настройки',
        'read' : 'Просмотр показаний для поставщика',
    }

    $: helpPage = $appState.helpPage

    function close() {
        appState.setHelpPage("")
    }
</script>

{#if helpPage !== ``}
    <div class="fullscreen-container" transition:fade={Transitions.fastFade}>
        <div class="dialog">
            Здесь будет помощь по текущей странице

            <div>{PAGES[helpPage] ?? helpPage}</div>

            <button on:click={close}>Закрыть</button>

        </div>

    </div>
{/if}
