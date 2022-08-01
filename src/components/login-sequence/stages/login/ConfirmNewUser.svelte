<script>
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"

    import Transitions from "utility/transitions.js"

    const dispatch = createEventDispatcher()
    // confirm - create new user
    // cancel - different user

    export let login

    let agreedToRules = false
    let agreedToData = false

    $: agreed = agreedToRules && agreedToData

    function cancel() {
        dispatch("cancel")
    }

    function confirm() {
        dispatch("confirm")
    }

</script>

<div class="flex central centered spaced wrapper" transition:fly={Transitions.loginFlyLeft}>
    <p class="large">Пользователь <span class="nowrap">{login}</span> не найден.</p>

    <p>Если вы здесь впервые, то для регистрации вам необходимо подтвердить, что вы принимаете
        <a href="/agreement/rules.html"
           rel="noopener noreferrer"
           target="_blank"> условия использования сервиса</a>

        , согласны на

        <a href="/agreement/personal.html"
           rel="noopener noreferrer"
           target="_blank" >обработку персональных данных</a>

        и задать пароль.</p>

    <label>
        <input bind:checked={agreedToRules} type="checkbox"/>
        Я принимаю условия пользования сервисом
        (<a href="/agreement/rules.html"
            rel="noopener noreferrer"
            target="_blank">Подробнее</a>).
    </label>

    <label>
        <input bind:checked={agreedToData} type="checkbox"/>
        Я даю согласие на обработку моих персональных данных
        (<a href="/agreement/personal.html"
            rel="noopener noreferrer"
            target="_blank" >Подробнее</a>)
    </label>

    <div class="row-flex">
        <button on:click={cancel}>◀ Другой пользователь</button>
        <button disabled={!agreed} on:click={confirm}>Задать пароль ▶</button>
    </div>

</div>
