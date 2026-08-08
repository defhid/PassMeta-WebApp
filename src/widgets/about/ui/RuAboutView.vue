<template>
    <div class="py-6 px-2">
        <h4 class="text-3xl text-center">
            Что такое
            <span class="text-surface-500 font-black">Pass</span>
            <span class="text-primary-400 font-black">Meta</span>?
        </h4>

        <p class="text-xl pt-8 italic text-center text-surface-300">
            Это надёжный 🔐 менеджер паролей
            <span class="inline-block text-no-wrap">с открытым 👀 исходным кодом</span><br />
            <span class="inline-block text-no-wrap">и современным дизайном 🔥</span>
        </p>

        <h4 class="text-3xl pt-12 pb-8 text-center">Распределённая система</h4>
        <div class="flex flex-wrap gap-5 align-start justify-center">
            <PmCard class="max-w-[420px]">
                <template #title>
                    <h4 class="text-center pb-2 leading-7">Сервер синхронизации</h4>
                </template>

                <template #content>
                    <span class="text-surface-400 text-wrap italic leading-6">
                        Отвечает за хранение эталонных версий пакетов паролей, доступ к ним, резервное копирование,
                        журналирование.
                    </span>
                    <br />
                    <PmButton
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        as="a"
                        href="https://github.com/defhid/PassMeta-Server"
                        target="_blank"
                    >
                        <i class="pi pi-github button-icon-lg" />
                        PassMeta-Server
                    </PmButton>
                </template>
            </PmCard>

            <PmCard class="max-w-[420px]">
                <template #title>
                    <h4 class="text-center pb-2 leading-7">Web клиент для браузера</h4>
                </template>

                <template #content>
                    <span class="text-surface-400 text-wrap italic leading-6">
                        Универсальный способ получить доступ к своим паролям и журналу действий.
                    </span>
                    <br />
                    <PmButton
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        as="a"
                        href="https://github.com/defhid/PassMeta-WebApp"
                        target="_blank"
                    >
                        <i class="pi pi-github button-icon-lg" />
                        PassMeta-WebApp
                    </PmButton>
                </template>
            </PmCard>

            <PmCard class="max-w-[420px]">
                <template #title>
                    <h4 class="text-center pb-2 leading-7">Кроссплатформенные приложения для устройств</h4>
                </template>

                <template #content>
                    <span class="text-surface-400 text-wrap italic leading-6">
                        Локальные хранилища паролей предоставляют удобный доступ к содержимому, поддерживают автономную
                        работу и синхронизацию, дополнительно резервируют версии пакетов.
                    </span>
                    <br />
                    <PmButton
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        as="a"
                        href="https://github.com/defhid/PassMeta-DesktopApp"
                        target="_blank"
                    >
                        <i class="pi pi-github button-icon-lg" />
                        PassMeta-DesktopApp
                    </PmButton>
                    <PmButton
                        v-tooltip.bottom="$tooltip({ value: 'В планах', showDelay: 100 })"
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        disabled
                    >
                        <i class="pi pi-github button-icon-lg" />
                        PassMeta-IosApp
                    </PmButton>
                    <PmButton
                        v-tooltip.bottom="$tooltip({ value: 'В планах', showDelay: 100 })"
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        disabled
                    >
                        <i class="pi pi-github button-icon-lg" />
                        PassMeta-AndroidApp
                    </PmButton>
                </template>
            </PmCard>
        </div>

        <h4 class="text-3xl pt-12 pb-8 text-center">Защита без компромиссов</h4>
        <div class="flex justify-center">
            <ul class="text-xl text-surface-300 flex flex-col gap-5 italic md:items-center">
                <li class="flex gap-4 items-center">
                    <i class="pi pi-verified" />
                    <div>Все пароли хранятся и передаются <strong>только в зашифрованном виде</strong></div>
                </li>
                <li class="flex gap-4 items-center">
                    <i class="pi pi-verified" />
                    <div>
                        Данные шифруются уникальным алгоритмом с мультипроходом <strong>на основе AES 256</strong>
                    </div>
                </li>
                <li class="flex gap-4 items-center">
                    <i class="pi pi-verified" />
                    <div>Без знания мастер-пароля <strong>взломать пакет невозможно</strong>*</div>
                </li>
            </ul>
        </div>

        <p class="pt-16 text-xs text-surface-500 italic">
            * - на текущем этапе развития компьютерных технологий, в разумные сроки, при условии использования
            качественного мастер-пароля.
        </p>
    </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.pi-verified {
    @apply text-4xl text-primary-400;
}
</style>
