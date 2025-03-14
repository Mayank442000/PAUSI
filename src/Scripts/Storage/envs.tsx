const getEnvVar = (varName: string, vitify = true) => {
    return import.meta.env[(vitify ? "VITE_" : "") + varName] as string;
};

export { getEnvVar };
