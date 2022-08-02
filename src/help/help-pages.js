const HELP_PAGES = {
    '/anon' : `
    Выберите город, где находится счетчик, данные которого вы хотите передавать.
    `,
    
    '/anon/city' : `
    Выберите поставщика услуг, данные по которому хотите передавать. Его наименование указано в квитанциях.
    Если сомневаетесь - подверьтесь по типу услуг, указанному под кнопкой.
    Если вам нужны поставщики из другого города - нажмите на название города вверху, чтобы отобразить список вариантов.
    `,
    
    '/anon/prov' : `
    Внимательно заполните все обязательные поля. Если поле необязательное - рядом будет написано, когда его можно не заполнять.
    
    Когда все поля будут корректно заполнены, станут доступны кнопки для отправки показаний.
    Если поставщик услуг предоставил такую возможность, сервис отправит сообщение сам. В противном случае вам будут представлены способы, которыми можно передать показания самому.
    Если возможна отправка письмом или SMS-сообщением, вам так же будет предложена ссылка, нажав на которую вы сможете отправить заранее заготовленное письмо или сообщение. Обращаем внимание, что в таком случае за эту операцию может списываться оплата вашим оператором интернета или сотовой связи.
    
    Если вы выбрали не того оператора - нажмите "Назад", чтобы вернуться к выбору.
    
    Также вы можете заполнить поля, которые не меняются из месяца в месяц (например, лицевой счёт), после чего добавить страницу в закладки своего браузера и передавать показания каждый месяц таким образом, если не хотите регистриоваться и получать напоминания
    
    Чтобы мы могли передавать ваши данные без регистрации, закон требует от нас получить ваше согласие на обработку персональных данных. При передаче вручную это не требуется.
    `,
    
    '/user' : `
    На этой странице отображаются все указанные вами системы, по которым вы хотите передавать показания. Число в скобках - указанный номер лицевого счета.
    Под каждой системой указывается период следующей рекомендованной передачи показаний.
    Если список пуст или не хватает какой-то из систем, по которым вы передаете показания - нажмите "Добавить систему".
    Чтобы посмотреть информацию об имеющейся системе или передать показания - нажмите на кнопку соответствующей системы.
    Чтобы передать показания за другого человека, можно использовать кнопку "Передать без запоминания".
    
    Для управления подписками - нажмите кнопку ☰ и выберите "Настройки уведомлений".
    `,
    
    '/user/sys' : `
    На этой странице вы можете передать показания счетчиков, а также исправить данные о системе, если у вас, например, поменялся номер счетчика, или удалить систему, потерявшую актуальность.
    Для передачи данных счетчиков нажмите "Передать". При этом, если вы уже передавали данные в этом периоде или сейчас не рекомендованное поставщиком услуг время, - сервис сообщит вам об этои.
    Для правки данных нажмите "Изменить".
    Кнопка "Назад" вернёт вас в список систем.
    `,
    
    '/user/sys/edit' : `
    Чтобы сохранить изменения - нажмите "Сохранить". Если кнопка недоступна - проверьте, все ли обязательные поля корректно заполнены.
    Чтобы выйти без сохранения изменений - нажмите "Отмена". После сохранения изменений, отменить их нельзя!
    Вы также можете насовсем удалить систему из списка. Это действие необратимо!
    `,
    
    '/user/sys/send' : `
    Внимательно заполните все обязательные поля. Если поле необязательное - рядом будет написано, в каких случаях его можно не заполнять.
    
    Когда все поля будут корректно заполнены, станут доступны кнопки для отправки показаний.
    Если в пустых полях ввода отображаются прозрачные цифры - это показания, переданные вами ранее.
    Если поставщик услуг предоставил такую возможность, сервис отправит сообщение сам. В противном случае вам будут представлены способы, которыми можно передать показания самостоятельно.
    Если возможна отправка письмом или SMS-сообщением, вам так же будет предложена ссылка, нажав на которую вы сможете отправить заранее заготовленное письмо или сообщение. Обращаем внимание, что в таком случае за эту операцию может списываться оплата, установленная вашим оператором интернета или сотовой связи.
    Если вам пришлось передавать показания вручную - рекомендуем всё равно заполнить значения и нажать "Сохранить", чтобы сервис знал, что в этом периоде вам больше не надо передавать эти показания.
    `,
    
    '/add' : `
    Выберите город, где находится счетчик, данные которого вы хотите передавать.
    `,
    
    '/add/city' : `
    Выберите поставщика услуг, данные по которому хотите передавать. Его наименование указано в квитанциях.
    Если сомневаетесь - подверьтесь по типу услуг, указанному под кнопкой.
    Если вам нужны поставщики из другого города - нажмите на название города вверху, чтобы отобразить список вариантов.
    `,
    
    '/add/prov' : `
    Внимательно заполните данные, которые не будут меняться каждый месяц - обычно это номер счета и номера счетчиков или их последние цифры.
    После добавления системы в список, вам больше не придется указывать их каждый раз.
    Если вы ошиблись при выборе поставщика услуг - нажмите на кнопку с его названием вверху или "Назад".
    `,
    
    '/info' : `Информация`,
    '/conf' : `Настройки уведомлений`,
    '/read' : `Просмотр показаний для поставщика`,
    
    '/login/login' : `
    Укажите свой номер телефона или имя пользователя для идентификации. Если вы здесь впервые и не хотите указывать номер телефона - нажмите "Вход без телефона", введите желаемое имя пользователя и нажмите вперёд. Если имя свободно - вам будет предложено зарегистрироваться в системе.
    Вы можете также передать показания без регистрации, нажав кнопку "Просто передать показания".
    Основое отличие пользования сервисом с регистрацией - в том, что после разовой настройки можно получать уведомления-напоминания о сроках передачи показаний и не вводить лицевые счета и номера счетчиков каждый раз.
    `,
    
    '/login/login/new' : `
    Если вы впервые авторизуетесь на сайте, нам надо уладить буквально пару формальностей, которые от нас требует законодательство РФ.
    Так как мы будем хранить ваши данные, нам нужно ваше разрешение. Вы можете ознакомиться со списком, какие данные и зачем мы используем по ссылке на странице. Мы собираем только самый минимум, необходимый для выполнения стоящей перед сервисом задачи!
    Также вам следует ознакомиться с простыми правилами пользования сервера. Самое главное - не злоупотребляйте удобством и простотой, чтобы заваливать операторов лишними сообщениями, передавайте сообщения в срок и один раз за период, если только не случилось что-то из ряда вон выходящее.
    Ну и для того, чтобы другой человек не мог себя выдать за вас, вам придется придумать и запомнить пароль. Мы бы с радостью сделали вход через код в СМС, но пока что для нас это очень дорого.
    
    Если вы уже регистрировались, но попали на эту страницу, то вы, вероятно, неправильно указали телефон или имя пользователя, или ввели телефон вместо имени пользователя. В таком случае - вернитесь нажатием на "Другой пользователь" и попробуйте ещё раз.
    `,
    
    '/login/password' : `
    Введите пароль, который вы указывали при регистрации.
    Если вы его уже забыли - это очень печально, так как восстановление доступа возможно только если вы указывали свой электронный адрес. Впрочем, если вы ранее передавали показания и напишете письмо на support@peredam.info, где предоставите подтверждение принадлежности вам данной учетной записи - возможно, у нас всё получится. Но не быстро, нас мало и у нас лапки :(
    `,
    
    '/login/password/new' : `
    Придумайте пароль, чтобы другой человек не смог зайти от вашего имени и всё испортить. Постарайтесь запомнить или записать пароль, потому что в случае его утраты восстановить доступ может быть проблематично. Наши операторы вам помогут, но нас мало и у нас лапки, так что это займёт некоторое время.
    `,
    
    '/login/code' : `
    Ранее при входе или регистрации вы указали код быстрого доступа. Введите его, чтобы войти, или нажиите "Войти с паролем", чтобы воспользоваться паролем.
    `,
    
    '/login/code/set' : `
    Вы можете установить код быстрого доступа, чтобы защитить быстрый вход в систему, например, от случайных манипуляций детей или любого другого человека, получившего доступ к вашему устройству. Код действует только на этом устройстве.
    Вы также можете нажать "Не надо кода", чтобы не устанавливать код и входить сразу.
    В дальнейшем сменить, включить или отключить код можно, заново зайдя с паролем.
    `,
}

export default class HelpPages {
    static get(address) {
        const text = HELP_PAGES[address] ?? `Не найдена подсказка для ${address}`
        return text
            .split("\n")
            .map(x => `<p>${x}</p>`)
            .join("")
    }
}
