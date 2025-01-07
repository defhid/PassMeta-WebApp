<template>
    <div class="py-6 px-2">
        <h4 class="text-h4 text-center">
            Что такое
            <em>
                <span class="text-gray-500 font-black">Pass</span>
                <span class="text-green-600 font-black">Meta</span>?
            </em>
        </h4>

        <p class="text-xl pt-8 italic text-center">
            Это надёжный 🔐 менеджер паролей
            <span class="inline-block text-no-wrap">с открытым 👀 исходным кодом</span><br />
            <span class="inline-block text-no-wrap">и современным дизайном 🔥.</span>
        </p>

        <h4 class="text-h4 pt-12 pb-8 text-center">Распределённая система</h4>
        <div class="flex flex-wrap gap-5 align-start justify-center">
            <v-card class="max-w-[390px]" elevation="16" variant="outlined">
                <v-card-item>
                    <v-card-title class="text-wrap text-center pb-1">Сервер синхронизации</v-card-title>
                    <v-card-subtitle class="text-wrap italic">
                        Отвечает за хранение эталонных версий пакетов паролей, доступ к ним, резервное копирование,
                        журналирование.
                    </v-card-subtitle>
                </v-card-item>

                <v-card-text>
                    <div class="flex flex-col align-start">
                        <v-card
                            append-icon="mdi-open-in-new"
                            href="https://github.com/defhid/PassMeta-Server"
                            prepend-icon="mdi-github"
                            rel="noopener"
                            subtitle="PassMeta-Server"
                            target="_blank"
                        />
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="max-w-[390px]" elevation="16" variant="outlined">
                <v-card-item>
                    <v-card-title class="text-wrap text-center pb-1">Web клиент для браузера</v-card-title>
                    <v-card-subtitle class="text-wrap italic">
                        Универсальный способ получить доступ к своим паролям и журналу действий.
                    </v-card-subtitle>
                </v-card-item>

                <v-card-text>
                    <div class="flex flex-col align-start">
                        <v-card
                            append-icon="mdi-open-in-new"
                            href="https://github.com/defhid/PassMeta-WebApp"
                            prepend-icon="mdi-github"
                            rel="noopener"
                            subtitle="PassMeta-WebApp"
                            target="_blank"
                        />
                    </div>
                </v-card-text>
            </v-card>

            <v-card class="max-w-[390px]" elevation="16" variant="outlined">
                <v-card-item>
                    <v-card-title class="text-wrap text-center pb-1">
                        Кроссплатформенные приложения для устройств
                    </v-card-title>
                    <v-card-subtitle class="text-wrap italic">
                        Локальные хранилища паролей предоставляют удобный доступ к содержимому, поддерживают автономную
                        работу и синхронизацию, дополнительно резервируют версии пакетов.
                    </v-card-subtitle>
                </v-card-item>

                <v-card-text>
                    <div class="flex flex-col gap-2 align-start">
                        <v-card
                            append-icon="mdi-open-in-new"
                            href="https://github.com/defhid/PassMeta-DesktopApp"
                            prepend-icon="mdi-github"
                            rel="noopener"
                            subtitle="PassMeta-DesktopApp"
                            target="_blank"
                        />
                        <v-card
                            class="hover:opacity-30"
                            append-icon="mdi-open-in-new"
                            disabled
                            href="#"
                            prepend-icon="mdi-github"
                            rel="noopener"
                            subtitle="PassMeta-IosApp | в планах"
                        />
                        <v-card
                            class="hover:opacity-30"
                            append-icon="mdi-open-in-new"
                            disabled
                            href="#"
                            prepend-icon="mdi-github"
                            rel="noopener"
                            subtitle="PassMeta-AndroidApp | в планах"
                        />
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <h4 class="text-h4 pt-12 pb-8 text-center">Защита без компромиссов</h4>
        <ul class="text-xl text-center flex flex-col gap-5 italic">
            <li>
                <span class="text-green text-h5 pr-1">✔</span>
                Все пакеты паролей сохраняются и передаются <b>только в зашифрованном виде</b>.
            </li>
            <li>
                <span class="text-green text-h5 pr-1">✔</span>
                В качестве способа шифрования используется специальный алгоритм с мультипроходом на основе
                <b>AES 256</b>.
            </li>
            <li>
                <span class="text-green text-h5 pr-1">✔</span>
                Без знания мастер-пароля <b>взломать пакет</b> при текущем развитии компьютерных мощностей
                <b>невозможно</b>*.
            </li>
        </ul>

        <p class="pt-16 opacity-70">* - в разумные сроки, при условии использования качественного мастер-пароля.</p>
    </div>
</template>
