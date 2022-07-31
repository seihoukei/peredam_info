<script>
    import Rules from "./Rules.svelte"
    import {createEventDispatcher} from "svelte"
    import {fly} from "svelte/transition"
    import Transitions from "../../../../utility/transitions.js"

    export let login

    let agreed = false
    let showRules = false

    const dispatch = createEventDispatcher()

    function rules() {
        showRules = true
    }

    function cancel() {
        dispatch("cancel")
    }

    function confirm() {
        dispatch("confirm")
    }
</script>

<div class="flex central centered spaced wrapper" transition:fly={Transitions.loginFlyLeft}>
    <p class="large">Пользователь <span class="nowrap">{login}</span> не найден.</p>
    <p>Если вы здесь впервые, то для регистрации вам необходимо подтвердить, что вы принимаете <a on:click={rules}>условия
        использования сервиса</a> и задать пароль.</p>
    <label>
        <input bind:checked={agreed} type="checkbox"/> Я принимаю условия пользования сервисом.
    </label>
    <div class="row-flex">
        <button on:click={cancel}>◀ Другой пользователь</button>
        <button disabled={!agreed} on:click={confirm}>Задать пароль ▶</button>
    </div>
</div>

<Rules bind:visible={showRules}/>
