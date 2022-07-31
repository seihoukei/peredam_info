<script>
    export let date = new Date()

    const days = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
    ]
    const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ]
    const years = [
        2022,
        2023,
        2024,
        2025,
        2026,
        2027,
        2028,
        2029,
        2030,
        2031,
        2032,
        2033,
        2034,
        2035,
        2036,
        2037,
        2038,
        2039,
        2040,
        2041,
        2042,
        2043,
        2044,
        2045,
        2046,
        2047,
        2048,
        2049,
        2050,
    ]

    $: day = date.getDate()
    $: month = date.getMonth()
    $: year = date.getFullYear()
    $: hours = date.getHours()
    $: minutes = date.getMinutes()
</script>

<div class="row-flex nowrap">
    <select value={day}>
        {#each days as day}
            <option value={day}>{day}</option>
        {/each}
    </select>

    <select value={month}>
        {#each months as month, id}
            <option value={id}>{month}</option>
        {/each}
    </select>

    <select value={year}>
        {#each years as year}
            <option value={year}>{year}</option>
        {/each}
    </select>
</div>
