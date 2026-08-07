import { type App, type Plugin } from "vue";
import { useAppContext } from "~stores";

const versionPlugin: Plugin = (app: App) => {
    const versionUpgradeFlag = "__upgrade";

    const router = app.config.globalProperties.$router;
    const context = useAppContext();

    const isReady = Promise.all([router.isReady(), context.isReady()]);

    isReady.then(async () => {
        const route = router.currentRoute.value;

        const currentVersion = context.uiVersion;
        const latestVersion = context.uiVersionLatest.value;

        if (versionUpgradeFlag in route.query) {
            const targetVersion = route.query[versionUpgradeFlag];

            if (targetVersion === currentVersion) {
                console.info(`Successfully updated to v${context.uiVersion}!`);
            } else if (latestVersion) {
                console.error(`Failed to update version, current is ${currentVersion}, latest is ${latestVersion}!`);
            }

            return await router.replace({
                ...route,
                query: { ...route.query, [versionUpgradeFlag]: undefined },
            });
        }

        if (!latestVersion || latestVersion === currentVersion) {
            return;
        }

        console.info(`Updating from v${currentVersion} to v${latestVersion}...`);

        if (window.navigator.serviceWorker) {
            await Promise.race([
                window.navigator.serviceWorker.ready.then((reg) => {
                    reg.active?.postMessage({ type: "invalidate-cache" });
                }),
                new Promise((resolve) => setTimeout(resolve, 3_000)),
            ]);
        }

        await router.replace({
            ...route,
            query: { ...route.query, [versionUpgradeFlag]: latestVersion },
        });

        window.location.reload();
    });
};

export default versionPlugin;
