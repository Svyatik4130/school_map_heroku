const router = require("express").Router()
const Point = require("../models/pointModel")
const auth = require("../middleware/auth")
const { route } = require("./userRouter")

router.post("/add", auth,  async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ msg: "Non registered users cant make a points" })
        }

        const { pointCoords,
            userEmail,
            userId,
            textareaValue } = req.body

        if(textareaValue.length < 5) {
            return res.status(400).json({ msg: "Please, make a note longer than 5 symbols" })
        }
        
        let allPoints = await Point.find({})
        allPoints.sort((first, second) => {
            return second.id - first.id
        })
        if (allPoints.length === 0) {
            allPoints = [{ id: -1 }]
        }
        const newPoint = new Point({
            id: allPoints[0].id + 1,
            userEmail: userEmail,
            userID: userId,
            pointCoords: pointCoords,
            note: textareaValue,
        })

        const savedPoint = await newPoint.save()
        res.json(savedPoint)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

router.get("/getpoints", async (req, res) => {
    const allPoints = await Point.find({})
    res.json(allPoints)
})

module.exports = router
