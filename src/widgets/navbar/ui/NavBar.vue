<script setup lang="ts">
import PassMetaIcon from "~assets/icons/PassMeta.png";
import { Routes } from "~routing";
import { t, useAppContext } from "~stores";
import { useSessionClose } from "~features/auth";
import { useRouter } from "vue-router";

const { currentRoute } = useRouter();
const { currentUser } = useAppContext();
const { closeCurrentSession } = useSessionClose();
</script>

<template>
    <v-card class="py-1 w-full">
        <div class="flex justify-between items-center">
            <RouterLink class="ml-3" :to="Routes.Home.to()">
                <img :src="PassMetaIcon" alt="PM" width="48" />
            </RouterLink>

            <div class="flex w-full justify-center gap-[3rem] sm:gap-[7rem] lg:gap-[10rem] xl:gap-[12rem] px-1">
                <v-btn
                    icon="mdi-safe-square-outline"
                    :to="Routes.Storage.to()"
                    :active="currentRoute.name === Routes.Storage.to.name"
                />
                <v-btn
                    icon="mdi-lightbulb-outline"
                    :to="Routes.Generator.to()"
                    :active="currentRoute.name === Routes.Generator.to.name"
                />
                <v-btn
                    icon="mdi-history"
                    :to="Routes.History.to()"
                    :active="currentRoute.name === Routes.History.to.name"
                />
            </div>

            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        icon="mdi-account-circle-outline"
                        class="mr-3"
                        :active="currentRoute.name === Routes.Account.to.name"
                    />
                </template>

                <v-list class="min-w-[150px]">
                    <v-list-item v-if="currentUser" :value="1" :to="Routes.Account.to()">
                        <v-list-item-title>{{ t("App.NavigationBar.Account") }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-else :value="1" :to="Routes.Auth.to()">
                        <v-list-item-title>{{ t("App.NavigationBar.SignIn") }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="currentUser" :value="2" @click.stop="closeCurrentSession()">
                        <v-list-item-title>{{ t("App.NavigationBar.SignOut") }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-card>
</template>
