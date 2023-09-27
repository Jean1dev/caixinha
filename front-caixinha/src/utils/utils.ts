export function getAleatorio(data: Array<any>) {
    const indiceAleatorio = Math.floor(Math.random() * data.length);
    return data[indiceAleatorio];
}

export const getInitials = (name: string = '') => name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join('');