<script setup lang="ts">
import PassMetaIcon from "~assets/icons/PassMeta.png";
import { Routes } from "~routing";
import { t, useAppContext } from "~stores";
import { useSessionClose } from "~features/auth";
import { useRouter } from "vue-router";

const { currentRoute } = useRouter();
const { currentUser } = useAppContext();
const { closeCurrentSession } = useSessionClose();

function makeItemTooltip(text: string) {
    return { text, "open-delay": 900, location: "bottom" };
}
</script>

<template>
    <v-card class="py-1 w-full">
        <div class="flex justify-between items-center">
            <RouterLink class="mx-3 w-[48px] min-w-[48px]" :to="Routes.Home.to()">
                <img v-tooltip="makeItemTooltip(t('Home.Title'))" :src="PassMetaIcon" alt="PM" />
            </RouterLink>

            <div class="flex w-[50%] justify-space-around">
                <v-btn
                    v-tooltip="makeItemTooltip(t('Storage.Title'))"
                    icon="mdi-safe-square-outline"
                    :to="Routes.Storage.to()"
                    :active="currentRoute.name === Routes.Storage.to.name"
                />
                <v-btn
                    v-tooltip="makeItemTooltip(t('Generator.Title'))"
                    icon="mdi-lightbulb-outline"
                    :to="Routes.Generator.to()"
                    :active="currentRoute.name === Routes.Generator.to.name"
                />
                <v-btn
                    v-tooltip="makeItemTooltip(t('History.Title'))"
                    icon="mdi-history"
                    :to="Routes.History.to()"
                    :active="currentRoute.name === Routes.History.to.name"
                />
            </div>

            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        v-tooltip="makeItemTooltip(t('Account.Title'))"
                        v-bind="props"
                        icon="mdi-account-circle-outline"
                        class="mr-3 min-w-[60px]"
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
