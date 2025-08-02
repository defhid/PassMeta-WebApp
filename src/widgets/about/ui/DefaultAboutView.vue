<template>
    <div class="py-6 px-2">
        <h4 class="text-h4 text-center">
            WHAT IS
            <span class="text-surface-500 font-black">Pass</span>
            <span class="text-primary-400 font-black">Meta</span>?
        </h4>

        <p class="text-xl pt-8 italic text-center text-surface-300">
            This is open-source 👀
            <span class="inline-block text-no-wrap">reliable password manager 🔐</span><br />
            <span class="inline-block text-no-wrap"> with modern design 🔥</span>
        </p>

        <h4 class="text-h4 pt-12 pb-8 text-center">DISTRIBUTED</h4>
        <div class="flex flex-wrap gap-5 align-start justify-center">
            <PmCard class="max-w-[420px]">
                <template #title>
                    <h4 class="text-center pb-1">Sync server</h4>
                </template>

                <template #content>
                    <span class="text-surface-400 text-wrap italic">
                        Responsible for storing reference versions of password packages, accessing them, and backing
                        them up.
                    </span>
                    <br />
                    <PmButton
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        icon="pi pi-github"
                        as="a"
                        href="https://github.com/defhid/PassMeta-Server"
                        target="_blank"
                        label="PassMeta-Server"
                    />
                </template>
            </PmCard>

            <PmCard class="max-w-[420px]">
                <template #title>
                    <h4 class="text-center pb-1">Web client for browser</h4>
                </template>

                <template #content>
                    <span class="text-surface-400 text-wrap italic">
                        Universal way to access your passwords and activity logs.
                    </span>
                    <br />
                    <PmButton
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        icon="pi pi-github"
                        as="a"
                        href="https://github.com/defhid/PassMeta-WebApp"
                        target="_blank"
                        label="PassMeta-WebApp"
                    />
                </template>
            </PmCard>

            <PmCard class="max-w-[420px]">
                <template #title>
                    <h4 class="text-center pb-1">Cross-platform applications for devices</h4>
                </template>

                <template #content>
                    <span class="text-surface-400 text-wrap italic">
                        Local password storages provide convenient access to your passfiles, support offline work and
                        synchronization, and additionally backup passfile versions.
                    </span>
                    <br />
                    <PmButton
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        icon="pi pi-github"
                        as="a"
                        href="https://github.com/defhid/PassMeta-DesktopApp"
                        target="_blank"
                        label="PassMeta-DesktopApp"
                    />
                    <PmButton
                        v-tooltip.bottom="$tooltip({ value: 'In future', showDelay: 100 })"
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        icon="pi pi-github"
                        disabled
                        label="PassMeta-IosApp"
                    />
                    <PmButton
                        v-tooltip.bottom="$tooltip({ value: 'In future', showDelay: 100 })"
                        class="mt-4"
                        severity="contrast"
                        variant="outlined"
                        icon="pi pi-github"
                        disabled
                        label="PassMeta-AndroidApp"
                    />
                </template>
            </PmCard>
        </div>

        <h4 class="text-h4 pt-12 pb-8 text-center">SAFE</h4>
        <div class="flex justify-center">
            <ul class="text-xl text-surface-300 flex flex-col gap-5 italic">
                <li class="flex gap-5 items-center">
                    <span class="text-primary-400 text-h5">✔</span>
                    <div>All passwords are stored and transmitted <strong>only in encrypted form</strong></div>
                </li>
                <li class="flex gap-5 items-center">
                    <span class="text-primary-400 text-h5">✔</span>
                    <div>
                        The data is encrypted with a special multi-pass algorithm <strong>based on AES 256</strong>
                    </div>
                </li>
                <li class="flex gap-5 items-center">
                    <span class="text-primary-400 text-h5">✔</span>
                    <div>
                        It is <strong>impossible to crack</strong> the system without knowing user's master password*
                    </div>
                </li>
            </ul>
        </div>

        <p class="pt-16 text-xs text-surface-500 italic">
            * - at the current stage of computer technology development, within a reasonable time, provided that a
            high-quality master password is used.
        </p>
    </div>
</template>
<script setup lang="ts"></script>
