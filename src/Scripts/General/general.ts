const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const awaitAll = async (...promises: Array<Promise<any>>) => await Promise.all(promises);

export { sleep, awaitAll };
