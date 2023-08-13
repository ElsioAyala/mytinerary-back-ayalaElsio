

export const getCliente = (req, res) =>{
    res.json({clientes: {
        name: "john",
        lasName: "Johnson",
        age: "16"
    }})
}