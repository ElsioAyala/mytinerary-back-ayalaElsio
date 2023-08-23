export const validateDataCity = (req, res, next) => {
    const payload = req.body

    for (const key in payload) {
        if (payload[key] === "") {
            return res.status(400).json({ message: `${key} is required field!` })
        }
    }
    next()
}