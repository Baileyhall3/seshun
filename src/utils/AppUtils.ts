import router from '@/router';

class AppUtils {
    goTo(route: string) {
        router.push(route);
    }
}

const appUtils = new AppUtils();

export default appUtils;