export const delay = (timeout: number): Promise<void> => new Promise((resolve: Function) => setTimeout(resolve, timeout));