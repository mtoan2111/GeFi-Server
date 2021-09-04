interface ITOTP {
    generateNumber: (base32: string, startCountingTime: number, timeStep: number) => number;
}

export default ITOTP;
