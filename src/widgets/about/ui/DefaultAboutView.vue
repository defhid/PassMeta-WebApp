<template>
    <div class="py-6 px-2">
        <h4 class="text-h4 text-center">
            What is
            <em>
                <span class="text-gray-500 font-black">Pass</span>
                <span class="text-green-600 font-black">Meta</span>?
            </em>
        </h4>

        <p class="text-xl pt-8 italic text-center">
            This is open-source 👀
            <span class="inline-block text-no-wrap">reliable password manager 🔐</span><br />
            <span class="inline-block text-no-wrap"> with modern design 🔥</span>
        </p>

        <h4 class="text-h4 pt-12 pb-8 text-center">DISTRIBUTED</h4>
        <div class="flex flex-wrap gap-5 align-start justify-center">
            <v-card class="max-w-[390px]" elevation="16" variant="outlined">
                <v-card-item>
                    <v-card-title class="text-wrap text-center pb-1">Sync server</v-card-title>
                    <v-card-subtitle class="text-wrap italic">
                        Responsible for storing reference versions of password packages, accessing them, and backing
                        them up.
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
                    <v-card-title class="text-wrap text-center pb-1">Web client for browser</v-card-title>
                    <v-card-subtitle class="text-wrap italic">
                        Universal way to access your passwords and activity logs.
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
                        Cross-platform applications for devices
                    </v-card-title>
                    <v-card-subtitle class="text-wrap italic">
                        Local password storages provide convenient access to your passfiles, support offline work and
                        synchronization, and additionally backup passfile versions.
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
                            subtitle="PassMeta-IosApp | planning"
                        />
                        <v-card
                            class="hover:opacity-30"
                            append-icon="mdi-open-in-new"
                            disabled
                            href="#"
                            prepend-icon="mdi-github"
                            rel="noopener"
                            subtitle="PassMeta-AndroidApp | planning"
                        />
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <h4 class="text-h4 pt-12 pb-8 text-center">SAFE</h4>
        <ul class="text-xl text-center flex flex-col gap-5 italic">
            <li>
                <span class="text-green text-h5 pr-1">✔</span>
                All passwords are stored and transmitted <strong>only in encrypted form</strong>
            </li>
            <li>
                <span class="text-green text-h5 pr-1">✔</span>
                The data is encrypted with a special multi-pass algorithm <strong>based on AES 256</strong>
            </li>
            <li>
                <span class="text-green text-h5 pr-1">✔</span>
                It is <strong>impossible to crack</strong> the system without knowing user's master password*
            </li>
        </ul>

        <p class="pt-16 text-xs opacity-70 italic">
            * - at the current stage of computer technology development, within a reasonable time, provided that a
            high-quality master password is used.
        </p>
    </div>
</template>
<script setup lang="ts"></script>
