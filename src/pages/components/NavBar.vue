<script setup lang="ts">
import PassMetaIcon from "~assets/icons/PassMeta.png";
import { Routes } from "~routing";
import { t, useAppContext } from "~stores";
import { useRouter } from "vue-router";
import { useSessionClose } from "~entities/backend";
import { computed, useTemplateRef } from "vue";
import type { MenuItem } from "primevue/menuitem";
import type { RouteInfo } from "~infra";

const { currentRoute } = useRouter();
const { currentUser } = useAppContext();
const { closeCurrentSession } = useSessionClose();

const isVisible = (route: RouteInfo<any, any>) => route.to.isAnonymous || currentUser.value != null;

const router = useRouter();

const profileMenu = useTemplateRef("profileMenu");
const profileMenuItems = computed(
    (): MenuItem[] =>
        [
            currentUser.value
                ? {
                      label: t("App.NavigationBar.Account"),
                      icon: "pi pi-user",
                      command: () => router.push(Routes.Account.to()),
                  }
                : {
                      label: t("App.NavigationBar.SignIn"),
                      icon: "pi pi-sign-in",
                      command: () => router.push(Routes.Auth.to()),
                  },
            currentUser.value
                ? {
                      label: t("App.NavigationBar.SignOut"),
                      icon: "pi pi-sign-out",
                      command: () => closeCurrentSession(Routes.Home.to()),
                  }
                : null,
        ].filter((x) => x) as MenuItem[],
);
const toggleProfileMenu = (event: Event) => profileMenu.value!.toggle(event);
</script>

<template>
    <PmCard class="nav-bar">
        <template #content>
            <div class="flex justify-between items-center">
                <RouterLink class="mx-3 w-[48px] min-w-[48px]" :to="Routes.Home.to()">
                    <img v-tooltip.bottom="$tooltip('Home.Title')" :src="PassMetaIcon" alt="PM" />
                </RouterLink>

                <div class="flex w-[50%] justify-space-around">
                    <RouterLink v-if="isVisible(Routes.Storage)" :to="Routes.Storage.to()">
                        <PmButton
                            v-tooltip.bottom="$tooltip('Storage.Title')"
                            icon="pi pi-lock"
                            rounded
                            size="large"
                            severity="secondary"
                            :variant="currentRoute.name === Routes.Storage.to.name ? undefined : 'text'"
                        />
                    </RouterLink>
                    <RouterLink v-if="isVisible(Routes.Generator)" :to="Routes.Generator.to()">
                        <PmButton
                            v-tooltip.bottom="$tooltip('Generator.Title')"
                            icon="pi pi-lightbulb"
                            rounded
                            size="large"
                            severity="secondary"
                            :variant="currentRoute.name === Routes.Generator.to.name ? undefined : 'text'"
                        />
                    </RouterLink>
                    <RouterLink v-if="isVisible(Routes.History)" :to="Routes.History.to()">
                        <PmButton
                            v-tooltip.bottom="$tooltip('History.Title')"
                            icon="pi pi-history"
                            rounded
                            size="large"
                            severity="secondary"
                            :variant="currentRoute.name === Routes.History.to.name ? undefined : 'text'"
                        />
                    </RouterLink>
                </div>

                <PmButton
                    v-tooltip.bottom="$tooltip('Account.Title')"
                    class="mr-2"
                    icon="pi pi-user"
                    size="large"
                    rounded
                    raised
                    severity="secondary"
                    :variant="currentRoute.name === Routes.Account.to.name ? undefined : 'text'"
                    aria-haspopup="true"
                    aria-controls="overlay_menu"
                    @click="toggleProfileMenu"
                />
                <PmMenu id="overlay_menu" ref="profileMenu" :model="profileMenuItems" popup />
            </div>
        </template>
    </PmCard>
</template>

<style scoped>
.nav-bar {
    width: 100%;
    --p-card-body-padding: 6px 4px;
}
</style>
