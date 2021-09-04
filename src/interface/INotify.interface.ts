interface INotify {
    publish: (fcm: string, message: string) => void;
}

export default INotify;
