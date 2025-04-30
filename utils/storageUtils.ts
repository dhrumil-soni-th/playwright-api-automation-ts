export const injectTokenToLocalStorage = async (page, token): Promise<void> => {
    await page.addInitScript((token: string) => {
        window.localStorage.setItem('token', token);
    }, token);
};