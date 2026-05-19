export const formHandler = (e, prevData) => {
    const { name, value } = e.target;

    const relation = ["vehicle", "washPackage", "user"]

    const formattedValue = relation.includes(name) ? { id: Number(value) } : value

    console.log(prevData)
    return { ...prevData, [name]: formattedValue }

}