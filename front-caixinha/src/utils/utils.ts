export function getAleatorio(data: Array<any>) {
    const indiceAleatorio = Math.floor(Math.random() * data.length);
    return data[indiceAleatorio];
}