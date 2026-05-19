export function listHandler(id, list) {
    const obj = list.find(item => item.id === Number(id));
    return obj;
}